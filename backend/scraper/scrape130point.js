const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

async function scrape130Point(query) {
    const formData = qs.stringify({
        query,
        type: 2,
        subcat: -1,
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://130point.com/',
        'Origin': 'https://130point.com',
        'User-Agent': 'Mozilla/5.0',
    };

    try {
        const response = await axios.post('https://back.130point.com/sales/', formData, { headers });
        return parseHTML(response.data);
    } catch (err) {
        console.error('[130Point Scrape Error]', err.message);
        return [];
    }
}

function parseHTML(html) {
    const $ = cheerio.load(html);
    const listings = [];

    const rows = $('tr#rowsold_dataTable');
    console.log(`[DEBUG] Found ${rows.length} listing rows`);

    rows.each((i, row) => {
        const title = $(row).find('td.word-break a').first().text().trim();
        const price = $(row).find('td.word-break span.bidLink').first().text().trim() ||
            $(row).find('td.word-break span[style*="line-through"]').first().text().trim();
        const date = $(row).find('td.word-break .date-break').text().replace('Sale Date:', '').trim();
        const image = $(row).find('td img').first().attr('src');

        console.log(`[DEBUG] Row ${i + 1}:`, { title, price, date, image });

        if (title && price && date) {
            listings.push({ title, price, date, image });
        }
    });

    return listings;
}
  
  

module.exports = scrape130Point;
