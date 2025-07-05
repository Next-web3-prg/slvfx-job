const BaseScraper = require('./base-scraper');
const cheerio = require('cheerio');
const { query } = require('../../db/connection');

class WeWorkRemotelyScraper extends BaseScraper {
  constructor() {
    super('WeWorkRemotely');
    this.baseUrl = 'https://weworkremotely.com';
  }

  async getSourceId() {
    const result = await query('SELECT id FROM job_sources WHERE name = $1', ['WeWorkRemotely']);
    return result.rows[0]?.id;
  }

  normalizeJob(jobData) {
    return {
      title: jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || 'Remote',
      description: jobData.description || '',
      tags: jobData.tags || [],
      source_job_id: jobData.id || '',
      apply_url: jobData.applyUrl || '',
      salary_min: jobData.salaryMin || null,
      salary_max: jobData.salaryMax || null,
      salary_currency: 'USD',
      job_type: this.determineJobType(jobData),
      remote_type: 'remote',
      experience_level: this.determineExperienceLevel(jobData),
      posted_at: jobData.postedAt || new Date()
    };
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
    
    return 'full-time';
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
    if (title.includes('junior') || description.includes('junior')) {
      return 'junior';
    }
    if (title.includes('entry') || description.includes('entry')) {
      return 'entry';
    }
    
    return 'mid';
  }

  async scrapeJobsFromCategory(categoryUrl) {
    try {
      const html = await this.makeRequest(categoryUrl);
      const $ = cheerio.load(html);
      const jobs = [];

      // WeWorkRemotely job listings are in sections
      $('section.jobs').each((sectionIndex, section) => {
        const category = $(section).find('h2').text().trim();
        
        $(section).find('li').each((jobIndex, jobElement) => {
          const $job = $(jobElement);
          
          const title = $job.find('.title').text().trim();
          const company = $job.find('.company').text().trim();
          const location = $job.find('.region').text().trim();
          const jobUrl = $job.find('a').attr('href');
          
          if (title && company) {
            jobs.push({
              title,
              company,
              location: location || 'Remote',
              category,
              applyUrl: jobUrl ? `${this.baseUrl}${jobUrl}` : '',
              id: jobUrl ? jobUrl.split('/').pop() : '',
              postedAt: new Date()
            });
          }
        });
      });

      return jobs;
    } catch (error) {
      console.error(`❌ Error scraping category ${categoryUrl}:`, error.message);
      return [];
    }
  }

  async scrapeJobDetails(jobUrl) {
    try {
      const html = await this.makeRequest(jobUrl);
      const $ = cheerio.load(html);
      
      const description = $('.listing-container .content').text().trim();
      const tags = [];
      
      // Extract tags from the job posting
      $('.listing-container .tags span').each((index, element) => {
        const tag = $(element).text().trim();
        if (tag) tags.push(tag);
      });

      return { description, tags };
    } catch (error) {
      console.error(`❌ Error scraping job details ${jobUrl}:`, error.message);
      return { description: '', tags: [] };
    }
  }

  async scrape() {
    try {
      console.log(`🔍 Starting to scrape ${this.sourceName}...`);
      
      const sourceId = await this.getSourceId();
      if (!sourceId) {
        throw new Error('Source ID not found for WeWorkRemotely');
      }

      // WeWorkRemotely has different categories
      const categories = [
        '/remote-jobs/all',
        '/remote-jobs/programming',
        '/remote-jobs/design',
        '/remote-jobs/product',
        '/remote-jobs/sales',
        '/remote-jobs/marketing',
        '/remote-jobs/customer-support',
        '/remote-jobs/management',
        '/remote-jobs/quality-assurance',
        '/remote-jobs/writing',
        '/remote-jobs/legal',
        '/remote-jobs/accounting',
        '/remote-jobs/recruiting',
        '/remote-jobs/teaching',
        '/remote-jobs/healthcare',
        '/remote-jobs/operations',
        '/remote-jobs/security',
        '/remote-jobs/consulting',
        '/remote-jobs/engineering',
        '/remote-jobs/executive',
        '/remote-jobs/administration',
        '/remote-jobs/architecture',
        '/remote-jobs/art',
        '/remote-jobs/business',
        '/remote-jobs/content',
        '/remote-jobs/data',
        '/remote-jobs/devops',
        '/remote-jobs/finance',
        '/remote-jobs/game-development',
        '/remote-jobs/human-resources',
        '/remote-jobs/information-technology',
        '/remote-jobs/journalism',
        '/remote-jobs/legal',
        '/remote-jobs/logistics',
        '/remote-jobs/medical',
        '/remote-jobs/mobile',
        '/remote-jobs/operations',
        '/remote-jobs/other',
        '/remote-jobs/people',
        '/remote-jobs/plumbing',
        '/remote-jobs/quality-assurance',
        '/remote-jobs/recruiting',
        '/remote-jobs/sales',
        '/remote-jobs/security',
        '/remote-jobs/social-media',
        '/remote-jobs/teaching',
        '/remote-jobs/technical-support',
        '/remote-jobs/ux',
        '/remote-jobs/writing'
      ];

      let allJobs = [];
      
      // Scrape jobs from each category
      for (const category of categories) {
        console.log(`📂 Scraping category: ${category}`);
        const categoryJobs = await this.scrapeJobsFromCategory(`${this.baseUrl}${category}`);
        allJobs = allJobs.concat(categoryJobs);
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Remove duplicates based on job ID
      const uniqueJobs = allJobs.filter((job, index, self) => 
        index === self.findIndex(j => j.id === job.id)
      );

      // Enrich jobs with details (limited to avoid too many requests)
      const enrichedJobs = [];
      for (let i = 0; i < Math.min(uniqueJobs.length, 50); i++) {
        const job = uniqueJobs[i];
        if (job.applyUrl) {
          const details = await this.scrapeJobDetails(job.applyUrl);
          enrichedJobs.push({
            ...job,
            description: details.description,
            tags: details.tags
          });
          
          // Add delay between requests
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          enrichedJobs.push(job);
        }
      }

      // Normalize and save jobs
      const normalizedJobs = enrichedJobs.map(job => ({
        ...this.normalizeJob(job),
        source_id: sourceId
      }));

      const savedJobs = await this.saveJobs(normalizedJobs);
      
      // Update last fetched timestamp
      await this.updateSourceLastFetched(sourceId);
      
      console.log(`✅ Successfully scraped ${savedJobs.length} jobs from ${this.sourceName}`);
      return savedJobs;
      
    } catch (error) {
      console.error(`❌ Error scraping ${this.sourceName}:`, error.message);
      throw error;
    }
  }
}

module.exports = WeWorkRemotelyScraper; 