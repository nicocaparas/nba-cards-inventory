const scrape130Point = require('./scrape130point');

// Do not use # for the query because 130point is not encoding it correctly. 

const query = "2018 Luka Doncic  Prizm  Silver PSA 10 280"

async function testScraper() {
    const listings = await scrape130Point(query);
    // console.log(listings.slice(0, 2)); // just a preview
    console.log('[🧾 Listings Preview]', listings.slice(0, 10));
}

testScraper();
