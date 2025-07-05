#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up SLVFX Job Board...\n');

// Check if Node.js version is sufficient
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Check if PostgreSQL is installed
try {
  execSync('psql --version', { stdio: 'ignore' });
  console.log('✅ PostgreSQL is installed');
} catch (error) {
  console.error('❌ PostgreSQL is not installed or not in PATH');
  console.log('📦 Please install PostgreSQL: https://www.postgresql.org/download/');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
  } else {
    console.error('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  // Install root dependencies
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');

  // Install backend dependencies
  if (fs.existsSync(path.join(__dirname, '..', 'backend'))) {
    execSync('npm install', { 
      cwd: path.join(__dirname, '..', 'backend'),
      stdio: 'inherit' 
    });
    console.log('✅ Backend dependencies installed');
  }

  // Install frontend dependencies
  if (fs.existsSync(path.join(__dirname, '..', 'frontend'))) {
    execSync('npm install', { 
      cwd: path.join(__dirname, '..', 'frontend'),
      stdio: 'inherit' 
    });
    console.log('✅ Frontend dependencies installed');
  }

} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Database setup instructions
console.log('\n📊 Database Setup:');
console.log('1. Create a PostgreSQL database:');
console.log('   CREATE DATABASE slvfx_job_board;');
console.log('\n2. Update your .env file with database credentials');
console.log('\n3. Run the database setup:');
console.log('   npm run setup:db');

// Next steps
console.log('\n🎯 Next Steps:');
console.log('1. Configure your .env file with database credentials');
console.log('2. Run: npm run setup:db');
console.log('3. Start the development servers: npm run dev');
console.log('4. Run initial job scraping: npm run scrape');

console.log('\n✅ Setup complete! 🎉');
console.log('\n📚 For more information, see README.md'); 