const axios = require('axios');
const { query } = require('../../db/connection');

class BaseScraper {
  constructor(sourceName) {
    this.sourceName = sourceName;
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
  }

  async getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async makeRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'User-Agent': await this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 30000,
      ...options
    };

    try {
      const response = await axios.get(url, defaultOptions);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error.message);
      throw error;
    }
  }

  async saveJobs(jobs) {
    if (!jobs || jobs.length === 0) {
      console.log(`📝 No jobs to save for ${this.sourceName}`);
      return [];
    }

    const savedJobs = [];
    
    for (const job of jobs) {
      try {
        const result = await query(
          `INSERT INTO jobs (
            title, company, location, description, tags, 
            source_id, source_job_id, apply_url, salary_min, 
            salary_max, salary_currency, job_type, remote_type, 
            experience_level, posted_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (source_id, source_job_id) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            location = EXCLUDED.location,
            description = EXCLUDED.description,
            tags = EXCLUDED.tags,
            apply_url = EXCLUDED.apply_url,
            salary_min = EXCLUDED.salary_min,
            salary_max = EXCLUDED.salary_max,
            salary_currency = EXCLUDED.salary_currency,
            job_type = EXCLUDED.job_type,
            remote_type = EXCLUDED.remote_type,
            experience_level = EXCLUDED.experience_level,
            posted_at = EXCLUDED.posted_at,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id`,
          [
            job.title,
            job.company,
            job.location,
            job.description,
            job.tags,
            job.source_id,
            job.source_job_id,
            job.apply_url,
            job.salary_min,
            job.salary_max,
            job.salary_currency,
            job.job_type,
            job.remote_type,
            job.experience_level,
            job.posted_at
          ]
        );

        if (result.rows[0]) {
          savedJobs.push(result.rows[0].id);
        }
      } catch (error) {
        console.error(`❌ Error saving job ${job.title}:`, error.message);
      }
    }

    console.log(`✅ Saved ${savedJobs.length} jobs from ${this.sourceName}`);
    return savedJobs;
  }

  async updateSourceLastFetched(sourceId) {
    try {
      await query(
        'UPDATE job_sources SET last_fetched = CURRENT_TIMESTAMP WHERE id = $1',
        [sourceId]
      );
    } catch (error) {
      console.error(`❌ Error updating source last_fetched:`, error.message);
    }
  }

  normalizeJob(jobData) {
    // This method should be overridden by child classes
    throw new Error('normalizeJob method must be implemented by child class');
  }

  async scrape() {
    // This method should be overridden by child classes
    throw new Error('scrape method must be implemented by child class');
  }
}

module.exports = BaseScraper; 