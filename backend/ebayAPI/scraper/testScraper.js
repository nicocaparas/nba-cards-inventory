const scrape130Point = require('./scrape130point');

const query = "2019 ja morant silver prizm #249 psa 10"

async function testScraper() {
    const listings = await scrape130Point(query);
    // console.log(listings.slice(0, 2)); // just a preview
    console.log('[🧾 Listings Preview]', listings.slice(0, 10));
}

testScraper();
