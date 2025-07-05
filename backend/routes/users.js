const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db/connection');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, avatar_url, preferences, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar_url, preferences } = req.body;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           avatar_url = COALESCE($2, avatar_url), 
           preferences = COALESCE($3, preferences),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, name, avatar_url, preferences, created_at`,
      [name, avatar_url, preferences, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get saved jobs
router.get('/saved-jobs', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
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
        sj.saved_at,
        sj.notes,
        js.name as source_name
       FROM saved_jobs sj
       JOIN jobs j ON sj.job_id = j.id
       LEFT JOIN job_sources js ON j.source_id = js.id
       WHERE sj.user_id = $1 AND j.is_active = true
       ORDER BY sj.saved_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM saved_jobs sj JOIN jobs j ON sj.job_id = j.id WHERE sj.user_id = $1 AND j.is_active = true',
      [req.user.id]
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      saved_jobs: result.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching saved jobs:', error);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

// Save a job
router.post('/saved-jobs', authenticateToken, async (req, res) => {
  try {
    const { job_id, notes } = req.body;

    if (!job_id) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const jobResult = await query(
      'SELECT id FROM jobs WHERE id = $1 AND is_active = true',
      [job_id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already saved
    const existingResult = await query(
      'SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [req.user.id, job_id]
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: 'Job already saved' });
    }

    // Save the job
    const result = await query(
      'INSERT INTO saved_jobs (user_id, job_id, notes) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, job_id, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error saving job:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
});

// Update saved job notes
router.put('/saved-jobs/:job_id', authenticateToken, async (req, res) => {
  try {
    const { job_id } = req.params;
    const { notes } = req.body;

    const result = await query(
      'UPDATE saved_jobs SET notes = $1 WHERE user_id = $2 AND job_id = $3 RETURNING *',
      [notes, req.user.id, job_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating saved job:', error);
    res.status(500).json({ error: 'Failed to update saved job' });
  }
});

// Remove saved job
router.delete('/saved-jobs/:job_id', authenticateToken, async (req, res) => {
  try {
    const { job_id } = req.params;

    const result = await query(
      'DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2 RETURNING *',
      [req.user.id, job_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved job not found' });
    }

    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    console.error('❌ Error removing saved job:', error);
    res.status(500).json({ error: 'Failed to remove saved job' });
  }
});

// Get job alerts
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM job_alerts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching job alerts:', error);
    res.status(500).json({ error: 'Failed to fetch job alerts' });
  }
});

// Create job alert
router.post('/alerts', authenticateToken, async (req, res) => {
  try {
    const { name, keywords, locations, job_types, remote_types } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Alert name is required' });
    }

    const result = await query(
      `INSERT INTO job_alerts (user_id, name, keywords, locations, job_types, remote_types)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, name, keywords, locations, job_types, remote_types]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error creating job alert:', error);
    res.status(500).json({ error: 'Failed to create job alert' });
  }
});

// Update job alert
router.put('/alerts/:alert_id', authenticateToken, async (req, res) => {
  try {
    const { alert_id } = req.params;
    const { name, keywords, locations, job_types, remote_types, is_active } = req.body;

    const result = await query(
      `UPDATE job_alerts 
       SET name = COALESCE($1, name),
           keywords = COALESCE($2, keywords),
           locations = COALESCE($3, locations),
           job_types = COALESCE($4, job_types),
           remote_types = COALESCE($5, remote_types),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [name, keywords, locations, job_types, remote_types, is_active, alert_id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job alert not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating job alert:', error);
    res.status(500).json({ error: 'Failed to update job alert' });
  }
});

// Delete job alert
router.delete('/alerts/:alert_id', authenticateToken, async (req, res) => {
  try {
    const { alert_id } = req.params;

    const result = await query(
      'DELETE FROM job_alerts WHERE id = $1 AND user_id = $2 RETURNING *',
      [alert_id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job alert not found' });
    }

    res.json({ message: 'Job alert deleted' });
  } catch (error) {
    console.error('❌ Error deleting job alert:', error);
    res.status(500).json({ error: 'Failed to delete job alert' });
  }
});

module.exports = router; 