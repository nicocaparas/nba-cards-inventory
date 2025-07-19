const getAcceptedBestOffer = require('./getBestOfferPrice');

// Example eBay ID — this should come from a real Best Offer listing
const ebayID = '357157158030';

async function testGetBestOffer() {
    const price = await getAcceptedBestOffer(ebayID);
    if (price) {
        console.log(`[✅ Accepted Offer for ${ebayID}]`, price);
    } else {
        console.log(`[❌ No accepted offer price found for ${ebayID}]`);
    }
}

testGetBestOffer();
