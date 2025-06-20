// Utility: validates basic structure of listing
function isValidListing(listing, oneWeekAgo) {
    if (!listing.title || !listing.price || !listing.date) return false;
    if (typeof listing.price !== 'number' || isNaN(listing.price)) return false;

    const soldDate = new Date(listing.date);
    if (isNaN(soldDate)) return false;

    return soldDate >= oneWeekAgo;
  }

// Utility: checks if listing title contains all query keywords
function isRelevant(title, query) {
    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lowerTitle = title?.toLowerCase() || "";
    return keywords.every(keyword => lowerTitle.includes(keyword));
  }

/**
 * Filters and analyzes a list of marketplace listings to calculate average price.
 *
 * @param {Array<Object>} listings - List of listings, each with `title`, `price`, and `date`.
 * @param {string} query - Search query to match against each listing title.
 * @returns {Object} - Contains `averagePrice` (float or null), `sampleCount` (int), and `usedListings` (array).
 */
function processListings(listings, query) {
    // Compute the cutoff date (1 week ago - the last time listings were retrieved)
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    // Filter listings that are valid (non-null, numeric, recent) and relevant (title matches query)
    const filteredListings = listings.filter(l =>
        isValidListing(l, oneWeekAgo) && isRelevant(l.title, query)
    );

    // Extract the prices from the filtered listings and calculate average 
    const prices = filteredListings.map(l => l.price);

    const averagePrice = prices.length
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : null;

    return {
        averagePrice,
        sampleCount: prices.length,
        usedListings: filteredListings
    };
}

module.exports = processListings;