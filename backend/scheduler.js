const cron = require('node-cron');
const RemoteOKScraper = require('./api/scrapers/remoteok-scraper');
const WeWorkRemotelyScraper = require('./api/scrapers/weworkremotely-scraper');
const RemoteYeahScraper = require('./api/scrapers/remoteyeah-scraper');
const { connectDB } = require('./db/connection');

class JobScheduler {
  constructor() {
    this.scrapers = [
      new RemoteOKScraper(),
      new WeWorkRemotelyScraper(),
      new RemoteYeahScraper()
    ];
  }

  async runScrapers() {
    console.log('🔄 Starting scheduled job scraping...');
    
    try {
      await connectDB();
      
      for (const scraper of this.scrapers) {
        try {
          console.log(`🔍 Running ${scraper.sourceName} scraper...`);
          await scraper.scrape();
          
          // Add delay between scrapers to be respectful
          await new Promise(resolve => setTimeout(resolve, 5000));
          
        } catch (error) {
          console.error(`❌ Error running ${scraper.sourceName} scraper:`, error.message);
        }
      }
      
      console.log('✅ Scheduled job scraping completed');
      
    } catch (error) {
      console.error('❌ Error in scheduled scraping:', error);
    }
  }

  start() {
    console.log('🚀 Starting job scheduler...');
    
    // Run scrapers every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      this.runScrapers();
    });
    
    // Also run once on startup
    this.runScrapers();
    
    console.log('✅ Job scheduler started - running every 30 minutes');
  }

  stop() {
    console.log('🛑 Stopping job scheduler...');
    // cron will automatically stop when the process exits
  }
}

// Export for use in other files
module.exports = JobScheduler;

// If this file is run directly, start the scheduler
if (require.main === module) {
  const scheduler = new JobScheduler();
  scheduler.start();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    scheduler.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    scheduler.stop();
    process.exit(0);
  });
} 