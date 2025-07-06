const axios = require('axios');
const cheerio = require('cheerio');

async function debugRemoteYeah() {
  try {
    console.log('🔍 Debugging RemoteYeah HTML structure...');
    
    const url = 'https://remoteyeah.com';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 30000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    console.log('✅ Successfully fetched RemoteYeah HTML');
    console.log(`📄 HTML length: ${html.length} characters`);
    
    // Look for common job-related elements
    const jobElements = $('[class*="job"], [class*="position"], [class*="listing"], [class*="card"]');
    console.log(`🔍 Found ${jobElements.length} potential job elements`);
    
    // Look for links that might contain job URLs
    const jobLinks = $('a[href*="job"], a[href*="position"], a[href*="career"]');
    console.log(`🔗 Found ${jobLinks.length} potential job links`);
    
    // Look for company names
    const companyElements = $('[class*="company"], [class*="employer"]');
    console.log(`🏢 Found ${companyElements.length} potential company elements`);
    
    // Look for titles
    const titleElements = $('h1, h2, h3, h4, [class*="title"]');
    console.log(`📝 Found ${titleElements.length} potential title elements`);
    
    // Show first few elements of each type
    console.log('\n📋 Sample job elements:');
    jobElements.slice(0, 3).each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')} - ${$(el).text().substring(0, 100)}...`);
    });
    
    console.log('\n🔗 Sample job links:');
    jobLinks.slice(0, 3).each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('href')} - ${$(el).text().substring(0, 100)}...`);
    });
    
    console.log('\n🏢 Sample company elements:');
    companyElements.slice(0, 3).each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')} - ${$(el).text().substring(0, 100)}...`);
    });
    
    console.log('\n📝 Sample title elements:');
    titleElements.slice(0, 3).each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).attr('class')} - ${$(el).text().substring(0, 100)}...`);
    });
    
    // Look for any divs with job-related content
    const allDivs = $('div');
    console.log(`\n📦 Total divs: ${allDivs.length}`);
    
    // Check for any text that looks like job titles
    const allText = $('body').text();
    const jobKeywords = ['engineer', 'developer', 'designer', 'manager', 'analyst'];
    jobKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = allText.match(regex);
      if (matches) {
        console.log(`🔍 Found ${matches.length} occurrences of "${keyword}"`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error debugging RemoteYeah:', error.message);
  }
}

debugRemoteYeah(); 