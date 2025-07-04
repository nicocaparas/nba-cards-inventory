const mockEbayResponse = require('./mocks/mockEbayResponse');

async function getEbayData(query) {
    if (query !== "Apple iPhone 8 64GB") {
        throw new Error("Only 'Apple iPhone 8 64GB' is supported in the mock API.");
    }      

    // Check if the query from the frontend was recieved - for debugging
    //console.log('Received query:', query);

    await new Promise(res => setTimeout(res, 100)); // simulate latency

    // Extract and return only the required fields
    // NOTE: USING MOCKED EBAY API 
    const simplifiedListings = mockEbayResponse.itemSales.map(item => ({
        title: item.title,
        price: item.lastSoldPrice?.value ? parseFloat(item.lastSoldPrice.value) : null,
        date: item.lastSoldDate?.split('T')[0] || null
    }));

    return simplifiedListings;
}

// For debugging
// getEbayData("Test").then(listings => {
//     console.log('[📦 Listings]', listings);
// });

module.exports = getEbayData;