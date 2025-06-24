// Utility: validates basic structure of listing
function isValidListing(listing, cutoffStart, cutoffEnd) {
    if (!listing.title || !listing.price || !listing.date) return false;
    if (typeof listing.price !== 'number' || isNaN(listing.price)) return false;
    if (listing.price <= 0) return false; 

    const soldDate = new Date(listing.date);
    if (isNaN(soldDate)) return false;
    soldDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00

    return soldDate >= cutoffStart && soldDate <= cutoffEnd;
  }

// Utility: checks if listing title contains all query keywords
function isRelevant(title, query) {
    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lowerTitle = title?.toLowerCase() || "";
    return keywords.every(keyword => lowerTitle.includes(keyword));
  }

// Utility: Filters out listings with prices that are statistical outliers based on deviation from the average.
function removeOutliers(prices, listings, threshold = 0.3) {
    const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;

    return listings.filter(l =>
        Math.abs(l.price - average) / average <= threshold
    );
}

/**
 * Filters and analyzes a list of marketplace listings to calculate average price.
 *
 * @param {Array<Object>} listings - List of listings, each with `title`, `price`, and `date`.
 * @param {string} query - Search query to match against each listing title.
 * @returns {Object} - Contains `averagePrice` (float or null), `sampleCount` (int), and `usedListings` (array).
 */
function processListings(listings, query) {
    // Compute the cutoff start (1 week ago) and cutoff end (1 day ago)
    // Normalize dates to midnight to avoid excluding same-day listings
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to midnight

    const cutoffStart = new Date(now); // Start = 7 days ago (inclusive)
    cutoffStart.setDate(now.getDate() - 7);

    const cutoffEnd = new Date(now); // End = yesterday (inclusive)
    cutoffEnd.setDate(now.getDate() - 1);

    // Filter listings that are valid (non-null, numeric, recent) and relevant (title matches query)
    const filteredListings = listings.filter(l =>
        isValidListing(l, cutoffStart, cutoffEnd) && isRelevant(l.title, query)
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