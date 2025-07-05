const BaseScraper = require('./base-scraper');
const { query } = require('../../db/connection');

class RemoteOKScraper extends BaseScraper {
  constructor() {
    super('RemoteOK');
    this.apiUrl = 'https://remoteok.io/api';
  }

  async getSourceId() {
    const result = await query('SELECT id FROM job_sources WHERE name = $1', ['RemoteOK']);
    return result.rows[0]?.id;
  }

  normalizeJob(jobData) {
    return {
      title: jobData.position || jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || 'Remote',
      description: jobData.description || '',
      tags: jobData.tags || [],
      source_job_id: jobData.id?.toString() || '',
      apply_url: jobData.url || jobData.apply_url || '',
      salary_min: this.extractSalary(jobData.salary, 'min'),
      salary_max: this.extractSalary(jobData.salary, 'max'),
      salary_currency: 'USD',
      job_type: this.determineJobType(jobData),
      remote_type: 'remote',
      experience_level: this.determineExperienceLevel(jobData),
      posted_at: jobData.date ? new Date(jobData.date) : new Date()
    };
  }

  extractSalary(salary, type) {
    if (!salary) return null;
    
    // Handle different salary formats
    if (typeof salary === 'string') {
      const numbers = salary.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return type === 'min' ? parseInt(numbers[0]) : parseInt(numbers[1]);
      }
    }
    
    if (typeof salary === 'object') {
      return type === 'min' ? salary.min : salary.max;
    }
    
    return null;
  }

  determineJobType(jobData) {
    const title = (jobData.position || '').toLowerCase();
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
    const title = (jobData.position || '').toLowerCase();
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

  async scrape() {
    try {
      console.log(`🔍 Starting to scrape ${this.sourceName}...`);
      
      const sourceId = await this.getSourceId();
      if (!sourceId) {
        throw new Error('Source ID not found for RemoteOK');
      }

      // Fetch jobs from RemoteOK API
      const response = await this.makeRequest(this.apiUrl);
      
      if (!response || !Array.isArray(response)) {
        console.log(`📝 No jobs found from ${this.sourceName}`);
        return [];
      }

      // Filter out non-job entries and normalize
      const jobs = response
        .filter(job => job && job.position) // Filter out non-job entries
        .map(job => ({
          ...this.normalizeJob(job),
          source_id: sourceId
        }));

      // Save jobs to database
      const savedJobs = await this.saveJobs(jobs);
      
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

module.exports = RemoteOKScraper; 