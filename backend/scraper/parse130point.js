const cheerio = require('cheerio');

function parseHTML(html) {
    const $ = cheerio.load(html);
    const listings = [];

    const rows = $("tr#rowsold_dataTable");

    console.log(`[🔎 Found ${rows.length} listing rows]`);

    rows.each((i, row) => {
        const title = $(row).find("td.word-break a").first().text().trim();
        const price =
            $(row).find("span.bidLink").first().text().trim() ||
            $(row).find("span[style*='line-through']").first().text().trim();
        const date = $(row)
            .find("span.date-break")
            .text()
            .replace("Sale Date:", "")
            .trim();
        const image = $(row).find("img").first().attr("src");

        listings.push({ title, price, date, image });
    });

    return listings;
}

module.exports = parseHTML;
