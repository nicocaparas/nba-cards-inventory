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

// Heuristic: Checks if title includes variant terms not found in the query
function isLikelyVariant(title, query) {
    const titleWords = title.toLowerCase().split(/\s+/);
    const queryWords = query.toLowerCase().split(/\s+/);

    const variantKeywords = ['auto', 'autograph', 'signed','patch', 'refractor', 'mojo', 'green', 'jersey', 'relic', 'fast', 'break'];

    return variantKeywords.some(
        keyword => titleWords.includes(keyword) && !queryWords.includes(keyword)
    );
  }

// Utility: Filters out listings with prices that are statistical outliers based on deviation from the median.
function removeOutliers(listings, threshold = 0.5) {
    const prices = listings.map(l => l.price).sort((a, b) => a - b);

    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 === 0
        ? (prices[mid - 1] + prices[mid]) / 2
        : prices[mid];

    return listings.filter(l =>
        Math.abs(l.price - median) / median <= threshold
    );
  }

/**
 * Filters and analyzes a list of marketplace listings to calculate average price.
 *
 * @param {Array<Object>} listings - List of listings, each with `title`, `price`, and `date`.
 * @param {string} query - Search query to match against each listing title.
 * @returns {Object} - Contains `averagePrice` (float or null), `sampleCount` (int), and `usedListings` (array).
 */
async function processListings(listings, query) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const cutoffStart = new Date(now);
    cutoffStart.setDate(now.getDate() - 7);

    const cutoffEnd = new Date(now);
    cutoffEnd.setDate(now.getDate() - 1);

    // Step 1: Validate, match query, and exclude variants
    const filteredListings = listings.filter(l =>
        isValidListing(l, cutoffStart, cutoffEnd) &&
        isRelevant(l.title, query) &&
        !isLikelyVariant(l.title, query)
    );

    // Step 2: Replace price with accepted offer if applicable
    for (const l of filteredListings) {
        if (l.hasBestOffer) {
            await new Promise(r => setTimeout(r, 1500)); // avoid getting blocked
            const accepted = await getAcceptedBestOffer(l.ebayID);
            if (accepted) {
                l.price = parseFloat(accepted.replace(/[^\d.]/g, ''));
            }
        }
    }

    // Step 3: Remove outliers
    const cleanedListings = filteredListings.length >= 3
        ? removeOutliers(filteredListings)
        : filteredListings;

    // Step 4: Compute average
    const finalPrices = cleanedListings.map(l => l.price);
    const averagePrice = finalPrices.length
        ? finalPrices.reduce((sum, p) => sum + p, 0) / finalPrices.length
        : null;

    return {
        averagePrice,
        sampleCount: finalPrices.length,
        usedListings: cleanedListings
    };
}

module.exports = processListings;

// ✅ Only run this block if the file is run directly (not imported)
if (require.main === module) {
    const result = processListings(sampleListings, query);

    console.log('✅ processListings Debug Result:');
    console.log(JSON.stringify(result, null, 2));
}