const mockEbayResponse = require('./mocks/mockEbayResponse');

async function getEbayData(query) {
    // TO DO Create the necessary code to extract the needed data (title, price, and date sold only) 
    // from mockEbayResponse

    console.log(`[🧪 Mocked eBay API call for query]: ${query}`);
    await new Promise(res => setTimeout(res, 100)); // simulate latency

    // Extract and return only the required fields
    const simplifiedListings = mockEbayResponse.itemSales.map(item => ({
        title: item.title,
        price: item.lastSoldPrice?.value ? parseFloat(item.lastSoldPrice.value) : null,
        date: item.lastSoldDate?.split('T')[0] || null
    }));

    return simplifiedListings;
}

getEbayData("Test").then(listings => {
    console.log('[📦 Listings]', listings);
});

module.exports = getEbayData;