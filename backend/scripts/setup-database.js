const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🗄️ Setting up database...');

  // Create connection pool
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'slvfx_job_board',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing database schema...');
    await client.query(schema);
    console.log('✅ Database schema created successfully');

    // Insert initial data
    console.log('📝 Inserting initial data...');
    
    // Check if job sources already exist
    const sourcesResult = await client.query('SELECT COUNT(*) FROM job_sources');
    if (parseInt(sourcesResult.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO job_sources (name, base_url, api_endpoint) VALUES
          ('RemoteOK', 'https://remoteok.io', 'https://remoteok.io/api'),
          ('WeWorkRemotely', 'https://weworkremotely.com', NULL),
          ('Wellfound', 'https://wellfound.com', NULL),
          ('Indeed', 'https://indeed.com', NULL)
      `);
      console.log('✅ Job sources inserted');
    } else {
      console.log('ℹ️ Job sources already exist');
    }

    client.release();
    console.log('✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure PostgreSQL is running');
      console.log('2. Check your database credentials in .env');
      console.log('3. Ensure the database exists: CREATE DATABASE slvfx_job_board;');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 