const cheerio = require('cheerio');

function parseHTML(html) {
    const $ = cheerio.load(html);
    const listings = [];

    const rows = $("tr#rowsold_dataTable");

    // For debugging: console.log(`[🔎 Found ${rows.length} listing rows]`);

    rows.each((i, row) => {
        const title = $(row).find("td.word-break a").first().text().trim();
        const rawPrice =
            $(row).find("span.bidLink").first().text().trim() ||
            $(row).find("span[style*='line-through']").first().text().trim();

        // Convert price string to float
        const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return; // Skip the listing if price is not a number

        const date = $(row)
            .find("span.date-break")
            .text()
            .replace("Sale Date:", "")
            .trim();
        // Extract ebayID for Best Offer listings only. 
        const bestOfferDiv = $(row).find("div.ebayBestOfferAccepted");
        const hasBestOffer = bestOfferDiv.length > 0;

        let ebayID = null;
        if (hasBestOffer) {
            const link = $(row).find("td.word-break a").attr("href") || "";
            ebayID = link.match(/\/itm\/(\d+)/)?.[1] || null;
        }


        listings.push({
            title,
            price: numericPrice,
            date,
            hasBestOffer,
            ebayID
        });
    });

    return listings;
}

module.exports = parseHTML;
