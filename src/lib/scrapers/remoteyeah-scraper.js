const BaseScraper = require('./base-scraper');
const { query } = require('../../db/connection');
const cheerio = require('cheerio');

/**
 * RemoteYeah Scraper
 * 
 * Scrapes remote engineering jobs from https://remoteyeah.com/
 * 
 * Features:
 * - Comprehensive job filtering
 * - Salary information
 * - Company details
 * - Skill tags
 * - Location information
 */

class RemoteYeahScraper extends BaseScraper {
  constructor() {
    super('RemoteYeah');
    this.baseUrl = 'https://remoteyeah.com';
    this.searchUrl = 'https://remoteyeah.com';
  }

  async getSourceId() {
    const result = await query('SELECT id FROM job_sources WHERE name = $1', ['RemoteYeah']);
    return result.rows[0]?.id;
  }

  normalizeJob(jobData) {
    return {
      title: jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || 'Remote',
      description: jobData.description || '',
      tags: jobData.tags || [],
      source_job_id: jobData.id?.toString() || '',
      apply_url: jobData.apply_url || jobData.url || '',
      salary_min: this.extractSalary(jobData.salary, 'min'),
      salary_max: this.extractSalary(jobData.salary, 'max'),
      salary_currency: 'USD',
      job_type: this.determineJobType(jobData),
      remote_type: this.determineRemoteType(jobData),
      experience_level: this.determineExperienceLevel(jobData),
      posted_at: jobData.posted_at ? new Date(jobData.posted_at) : new Date()
    };
  }

  extractSalary(salary, type) {
    if (!salary) return null;
    
    if (typeof salary === 'string') {
      const numbers = salary.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return type === 'min' ? parseInt(numbers[0]) : parseInt(numbers[1]);
      }
      if (numbers && numbers.length === 1) {
        const num = parseInt(numbers[0]);
        return type === 'min' ? num : num;
      }
    }
    
    if (typeof salary === 'object') {
      return type === 'min' ? salary.min : salary.max;
    }
    
    return null;
  }

  determineJobType(jobData) {
    const title = (jobData.title || '').toLowerCase();
    const description = (jobData.description || '').toLowerCase();
    
    if (title.includes('part-time') || description.includes('part-time')) {
      return 'part-time';
    }
    if (title.includes('contract') || description.includes('contract')) {
      return 'contract';
    }
    if (title.includes('freelance') || description.includes('freelance')) {
      return 'freelance';
    }
    if (title.includes('intern') || description.includes('intern')) {
      return 'internship';
    }
    
    return 'full-time';
  }

  determineRemoteType(jobData) {
    const title = (jobData.title || '').toLowerCase();
    const description = (jobData.description || '').toLowerCase();
    const location = (jobData.location || '').toLowerCase();
    
    if (title.includes('remote') || description.includes('remote') || 
        title.includes('work from home') || description.includes('work from home') ||
        location.includes('remote') || location.includes('work from home')) {
      return 'remote';
    }
    if (title.includes('hybrid') || description.includes('hybrid') || location.includes('hybrid')) {
      return 'hybrid';
    }
    
    return 'remote'; // RemoteYeah is specifically for remote jobs
  }

  determineExperienceLevel(jobData) {
    const title = (jobData.title || '').toLowerCase();
    const description = (jobData.description || '').toLowerCase();
    
    if (title.includes('senior') || description.includes('senior')) {
      return 'senior';
    }
    if (title.includes('lead') || description.includes('lead')) {
      return 'lead';
    }
    if (title.includes('staff') || description.includes('staff')) {
      return 'senior';
    }
    if (title.includes('principal') || description.includes('principal')) {
      return 'lead';
    }
    if (title.includes('junior') || description.includes('junior')) {
      return 'junior';
    }
    if (title.includes('entry') || description.includes('entry')) {
      return 'entry';
    }
    if (title.includes('intern') || description.includes('intern')) {
      return 'entry';
    }
    
    return 'mid';
  }

  async searchJobs() {
    try {
      const url = `${this.searchUrl}`;
      const html = await this.makeRequest(url);
      const $ = cheerio.load(html);

      const jobs = [];
      
      console.log('🔍 HTML length:', html.length);
      console.log('🔍 Looking for job elements...');
      
      // Try different selectors that might contain jobs
      const jobSelectors = [
        '.job-card', '[data-job-id]', '.job-listing', '.job-item', '.job',
        '.position', '.listing', '.card', '.item',
        '[class*="job"]', '[class*="position"]', '[class*="listing"]',
        'div[class*="job"]', 'div[class*="position"]', 'div[class*="listing"]'
      ];
      
      let foundJobs = 0;
      
      for (const selector of jobSelectors) {
        const elements = $(selector);
        console.log(`🔍 Selector "${selector}": found ${elements.length} elements`);
        
        if (elements.length > 0) {
          elements.each((index, element) => {
            try {
              const $job = $(element);
              
              const jobId = $job.attr('data-job-id') || 
                           $job.attr('id') || 
                           $job.find('a[href*="/jobs/"]').attr('href')?.split('/').pop() ||
                           `remoteyeah-${Date.now()}-${index}`;

              const title = $job.find('.job-title, h2, h3, .title, .job-name').text().trim() ||
                           $job.find('a[href*="/jobs/"]').text().trim() ||
                           $job.find('a').first().text().trim();

              const company = $job.find('.company-name, .company, .employer, .company-name').text().trim();

              const location = $job.find('.location, .job-location, .job-location-text').text().trim() || 'Remote';

              const salary = $job.find('.salary, .compensation, .salary-range').text().trim();

              const postedDate = $job.find('.posted-date, .date, time, .job-date, .time-ago, .ago, [class*="date"], [class*="time"]').text().trim() ||
                               $job.find('time').attr('datetime') ||
                               $job.find('[datetime]').attr('datetime');

              const jobUrl = $job.find('a[href*="/jobs/"]').attr('href') || 
                            $job.find('a').first().attr('href');
              const applyUrl = jobUrl ? (jobUrl.startsWith('http') ? jobUrl : `${this.baseUrl}${jobUrl}`) : '';

              const tags = [];
              $job.find('.skills .skill, .tags .tag, .technologies .tech, .skill-tag').each((i, tag) => {
                const tagText = $(tag).text().trim();
                if (tagText) tags.push(tagText);
              });

              if (title && company) {
                const parsedDate = this.parseDate(postedDate);
                if (postedDate) {
                  console.log(`📅 Job: "${title}" - Posted: "${postedDate}" -> Parsed: ${parsedDate.toISOString()}`);
                }
                
                jobs.push({
                  id: jobId,
                  title,
                  company,
                  location: location || 'Remote',
                  salary,
                  posted_at: parsedDate,
                  apply_url: applyUrl,
                  description: '',
                  tags
                });
                foundJobs++;
              }
            } catch (error) {
              console.error('Error parsing job card:', error.message);
            }
          });
          
          if (foundJobs > 0) {
            console.log(`✅ Found ${foundJobs} jobs with selector "${selector}"`);
            break;
          }
        }
      }
      
      if (foundJobs === 0) {
        console.log('🔍 Trying broader approach - looking for any links that might be jobs...');
        
        $('a').each((index, element) => {
          try {
            const $link = $(element);
            const href = $link.attr('href');
            const text = $link.text().trim();
            
            if (!text || text.length < 5 || text.length > 100) return;
            
            if (text.toLowerCase().includes('home') || 
                text.toLowerCase().includes('about') || 
                text.toLowerCase().includes('contact') ||
                text.toLowerCase().includes('login') ||
                text.toLowerCase().includes('sign up')) return;
            
            const jobKeywords = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'specialist', 'lead', 'senior', 'junior'];
            const hasJobKeyword = jobKeywords.some(keyword => text.toLowerCase().includes(keyword));
            
            if (hasJobKeyword) {
              console.log(`🔍 Potential job link found: "${text}" (${href})`);
              
              jobs.push({
                id: `remoteyeah-link-${index}`,
                title: text,
                company: 'RemoteYeah Company',
                location: 'Remote',
                salary: '',
                posted_at: new Date(),
                apply_url: href ? (href.startsWith('http') ? href : `${this.baseUrl}${href}`) : '',
                description: '',
                tags: []
              });
              foundJobs++;
            }
          } catch (error) {
            console.error('Error parsing link:', error.message);
          }
        });
      }

      console.log(`📝 Total jobs found: ${foundJobs}`);
      return jobs;
    } catch (error) {
      console.error(`❌ Error searching RemoteYeah:`, error.message);
      return [];
    }
  }

  async getJobDetails(jobUrl) {
    try {
      const html = await this.makeRequest(jobUrl);
      const $ = cheerio.load(html);

      const description = $('.job-description, .description, .content').text().trim() ||
                         $('.job-details').text().trim();

      const tags = [];
      $('.skills .skill, .tags .tag, .technologies .tech').each((index, element) => {
        const tag = $(element).text().trim();
        if (tag) tags.push(tag);
      });

      return {
        description: description || '',
        tags: tags
      };
    } catch (error) {
      console.error(`Error fetching job details for ${jobUrl}:`, error.message);
      return { description: '', tags: [] };
    }
  }

  parseDate(dateString) {
    if (!dateString) return new Date();
    
    // Clean up the date string
    const cleanDateString = dateString.trim().toLowerCase();
    
    // Handle "X hours ago", "X minutes ago", etc.
    if (cleanDateString.includes('ago')) {
      const timeMatch = cleanDateString.match(/(\d+)\s*(minute|hour|day|week|month)s?\s*ago/i);
      if (timeMatch) {
        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        
        const date = new Date();
        switch (unit) {
          case 'minute':
            date.setMinutes(date.getMinutes() - amount);
            break;
          case 'hour':
            date.setHours(date.getHours() - amount);
            break;
          case 'day':
            date.setDate(date.getDate() - amount);
            break;
          case 'week':
            date.setDate(date.getDate() - (amount * 7));
            break;
          case 'month':
            date.setMonth(date.getMonth() - amount);
            break;
        }
        return date;
      }
    }
    
    // Handle ISO date strings
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    // Handle relative time formats like "2h ago", "1d ago"
    const relativeMatch = cleanDateString.match(/(\d+)([hmdw])\s*ago?/i);
    if (relativeMatch) {
      const amount = parseInt(relativeMatch[1]);
      const unit = relativeMatch[2].toLowerCase();
      
      const date = new Date();
      switch (unit) {
        case 'h': // hours
          date.setHours(date.getHours() - amount);
          break;
        case 'm': // minutes
          date.setMinutes(date.getMinutes() - amount);
          break;
        case 'd': // days
          date.setDate(date.getDate() - amount);
          break;
        case 'w': // weeks
          date.setDate(date.getDate() - (amount * 7));
          break;
      }
      return date;
    }
    
    // If we can't parse it, return current date
    console.log(`⚠️ Could not parse date: "${dateString}"`);
    return new Date();
  }

  async scrape() {
    try {
      console.log(`🔍 Starting to scrape ${this.sourceName}...`);
      
      const sourceId = await this.getSourceId();
      if (!sourceId) {
        throw new Error('Source ID not found for RemoteYeah');
      }

      const allJobs = [];
      
      try {
        console.log(`🔍 Scraping RemoteYeah jobs...`);
        const jobs = await this.searchJobs();
        
        if (jobs.length === 0) {
          console.log(`📝 No jobs found on RemoteYeah`);
        } else {
          allJobs.push(...jobs);
          console.log(`📝 Found ${jobs.length} jobs on RemoteYeah`);
        }
        
      } catch (error) {
        console.error(`❌ Error scraping RemoteYeah:`, error.message);
      }

      const uniqueJobs = allJobs.filter((job, index, self) => 
        index === self.findIndex(j => j.id === job.id)
      );

      console.log(`📝 Found ${uniqueJobs.length} unique jobs, fetching details...`);

      const normalizedJobs = [];
      for (const job of uniqueJobs.slice(0, 100)) {
        try {
          if (job.apply_url) {
            const details = await this.getJobDetails(job.apply_url);
            const normalizedJob = {
              ...this.normalizeJob({
                ...job,
                description: details.description,
                tags: [...job.tags, ...details.tags]
              }),
              source_id: sourceId
            };
            normalizedJobs.push(normalizedJob);
          } else {
            const normalizedJob = {
              ...this.normalizeJob(job),
              source_id: sourceId
            };
            normalizedJobs.push(normalizedJob);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Error processing job ${job.id}:`, error.message);
        }
      }

      const savedJobs = await this.saveJobs(normalizedJobs);
      
      await this.updateSourceLastFetched(sourceId);
      
      console.log(`✅ Successfully scraped ${savedJobs.length} jobs from ${this.sourceName}`);
      return savedJobs;
      
    } catch (error) {
      console.error(`❌ Error scraping ${this.sourceName}:`, error.message);
      return [];
    }
  }
}

module.exports = RemoteYeahScraper; 