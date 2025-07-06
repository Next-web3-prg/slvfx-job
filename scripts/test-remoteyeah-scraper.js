const RemoteYeahScraper = require('../api/scrapers/remoteyeah-scraper');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function testRemoteYeahScraper() {
  try {
    console.log('🧪 Testing RemoteYeah scraper...');
    
    const scraper = new RemoteYeahScraper();
    const results = await scraper.scrape();
    
    console.log(`✅ Test completed! Scraped ${results.length} jobs from RemoteYeah`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testRemoteYeahScraper(); 