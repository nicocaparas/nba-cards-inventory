const fs = require('fs');
const scrape130Point = require('../scraper/scrape130point.js');
const processListings = require('./processListingsCron.js');

const query = "2018 trae young prizm silver psa 10 78";
const cardNum = "78"; // Extracted directly from the query or DB in cron

(async () => {
    try {
        console.log('🕵️ Scraping listings...');
        const sampleListings = await scrape130Point(query);
        fs.writeFileSync('scrapedListings.json', JSON.stringify(sampleListings, null, 2));
        console.log('[✅ sampleListings written to scrapedListings.json]');

        console.log('⚙️ Processing listings for accuracy...');
        const processListingsResult = await processListings(sampleListings, query, cardNum);
        fs.writeFileSync('processedResult.json', JSON.stringify(processListingsResult, null, 2));
        console.log('[✅ Processed results written to processedResult.json]');

    } catch (err) {
        console.error('❌ Error during test cron processing:', err.message);
    }
})();
