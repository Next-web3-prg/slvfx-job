const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

async function addRemoteYeahSource() {
  console.log('🔧 Adding RemoteYeah to job sources...');

  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'slvfx_job_board'}`,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful');

    // Check if RemoteYeah already exists
    const checkResult = await client.query('SELECT id FROM job_sources WHERE name = $1', ['RemoteYeah']);
    
    if (checkResult.rows.length === 0) {
      // Add RemoteYeah to job sources
      await client.query(`
        INSERT INTO job_sources (name, base_url, api_endpoint) VALUES
          ('RemoteYeah', 'https://remoteyeah.com', NULL)
      `);
      console.log('✅ RemoteYeah added to job sources');
    } else {
      console.log('ℹ️ RemoteYeah already exists in job sources');
    }

    client.release();
    console.log('✅ Operation completed successfully!');

  } catch (error) {
    console.error('❌ Failed to add RemoteYeah:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addRemoteYeahSource();
}

module.exports = { addRemoteYeahSource }; 