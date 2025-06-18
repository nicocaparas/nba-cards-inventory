const scrape130Point = require('./scrape130point');

const query = "tyrese maxey prizm silver psa 10"

async function testScraper() {
    const listings = await scrape130Point(query);
    // console.log(listings.slice(0, 2)); // just a preview
}

testScraper();
