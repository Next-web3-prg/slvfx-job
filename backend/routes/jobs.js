const express = require('express');
const { query } = require('../db/connection');
const router = express.Router();

// Get all jobs with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      location = '',
      remote_type = '',
      job_type = '',
      experience_level = '',
      tags = '',
      company = '',
      sort = 'relevance',
      sort_by = 'posted_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereConditions = ['j.is_active = true'];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(
        j.title ILIKE $${paramIndex} OR 
        j.company ILIKE $${paramIndex} OR 
        j.description ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (location) {
      whereConditions.push(`j.location ILIKE $${paramIndex}`);
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (remote_type) {
      whereConditions.push(`j.remote_type = $${paramIndex}`);
      params.push(remote_type);
      paramIndex++;
    }

    if (job_type) {
      whereConditions.push(`j.job_type = $${paramIndex}`);
      params.push(job_type);
      paramIndex++;
    }

    if (experience_level) {
      whereConditions.push(`j.experience_level = $${paramIndex}`);
      params.push(experience_level);
      paramIndex++;
    }

    if (company) {
      whereConditions.push(`j.company ILIKE $${paramIndex}`);
      params.push(`%${company}%`);
      paramIndex++;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      whereConditions.push(`j.tags && $${paramIndex}`);
      params.push(tagArray);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Handle sorting
    let sortField = 'posted_at';
    let sortOrder = 'DESC';
    
    if (sort === 'date') {
      sortField = 'posted_at';
      sortOrder = 'DESC';
    } else if (sort === 'relevance') {
      // For relevance, we'll use a combination of factors
      // If there's a search term, prioritize jobs that match better
      if (search) {
        // Use a more complex ordering for relevance
        sortField = 'posted_at';
        sortOrder = 'DESC';
      } else {
        sortField = 'posted_at';
        sortOrder = 'DESC';
      }
    }
    
    // Fallback to explicit sort parameters if provided
    const allowedSortFields = ['posted_at', 'title', 'company', 'location', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (sort_by && allowedSortFields.includes(sort_by)) {
      sortField = sort_by;
    }
    if (sort_order && allowedSortOrders.includes(sort_order.toUpperCase())) {
      sortOrder = sort_order.toUpperCase();
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs j
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get jobs
    const jobsQuery = `
      SELECT 
        j.id,
        j.title,
        j.company,
        j.location,
        j.description,
        j.tags,
        j.apply_url,
        j.salary_min,
        j.salary_max,
        j.salary_currency,
        j.job_type,
        j.remote_type,
        j.experience_level,
        j.posted_at,
        j.created_at,
        js.name as source_name
      FROM jobs j
      LEFT JOIN job_sources js ON j.source_id = js.id
      ${whereClause}
      ORDER BY j.${sortField} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const jobsResult = await query(jobsQuery, [...params, limit, offset]);
    const jobs = jobsResult.rows;

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      jobs,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
        items_per_page: parseInt(limit),
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage
      }
    });

  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        j.*,
        js.name as source_name
      FROM jobs j
      LEFT JOIN job_sources js ON j.source_id = js.id
      WHERE j.id = $1 AND j.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Get job statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(DISTINCT company) as total_companies,
        COUNT(DISTINCT location) as total_locations,
        COUNT(CASE WHEN remote_type = 'remote' THEN 1 END) as remote_jobs,
        COUNT(CASE WHEN job_type = 'full-time' THEN 1 END) as full_time_jobs,
        COUNT(CASE WHEN experience_level = 'senior' THEN 1 END) as senior_jobs,
        COUNT(CASE WHEN experience_level = 'junior' THEN 1 END) as junior_jobs
      FROM jobs 
      WHERE is_active = true
    `);

    const topCompanies = await query(`
      SELECT company, COUNT(*) as job_count
      FROM jobs 
      WHERE is_active = true
      GROUP BY company 
      ORDER BY job_count DESC 
      LIMIT 10
    `);

    const topLocations = await query(`
      SELECT location, COUNT(*) as job_count
      FROM jobs 
      WHERE is_active = true AND location IS NOT NULL
      GROUP BY location 
      ORDER BY job_count DESC 
      LIMIT 10
    `);

    const topTags = await query(`
      SELECT unnest(tags) as tag, COUNT(*) as job_count
      FROM jobs 
      WHERE is_active = true AND tags IS NOT NULL
      GROUP BY tag 
      ORDER BY job_count DESC 
      LIMIT 20
    `);

    res.json({
      overview: stats.rows[0],
      top_companies: topCompanies.rows,
      top_locations: topLocations.rows,
      top_tags: topTags.rows
    });

  } catch (error) {
    console.error('❌ Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job statistics' });
  }
});

// Get filter options
router.get('/filters/options', async (req, res) => {
  try {
    const locations = await query(`
      SELECT DISTINCT location 
      FROM jobs 
      WHERE is_active = true AND location IS NOT NULL
      ORDER BY location
    `);

    const companies = await query(`
      SELECT DISTINCT company 
      FROM jobs 
      WHERE is_active = true
      ORDER BY company
    `);

    const tags = await query(`
      SELECT DISTINCT unnest(tags) as tag
      FROM jobs 
      WHERE is_active = true AND tags IS NOT NULL
      ORDER BY tag
    `);

    const jobTypes = await query(`
      SELECT DISTINCT job_type 
      FROM jobs 
      WHERE is_active = true AND job_type IS NOT NULL
      ORDER BY job_type
    `);

    const remoteTypes = await query(`
      SELECT DISTINCT remote_type 
      FROM jobs 
      WHERE is_active = true AND remote_type IS NOT NULL
      ORDER BY remote_type
    `);

    const experienceLevels = await query(`
      SELECT DISTINCT experience_level 
      FROM jobs 
      WHERE is_active = true AND experience_level IS NOT NULL
      ORDER BY experience_level
    `);

    res.json({
      locations: locations.rows.map(row => row.location),
      companies: companies.rows.map(row => row.company),
      tags: tags.rows.map(row => row.tag),
      job_types: jobTypes.rows.map(row => row.job_type),
      remote_types: remoteTypes.rows.map(row => row.remote_type),
      experience_levels: experienceLevels.rows.map(row => row.experience_level)
    });

  } catch (error) {
    console.error('❌ Error fetching filter options:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

module.exports = router; 