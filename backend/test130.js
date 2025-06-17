const axios = require('axios');
const cheerio = require('cheerio');

// Mimic the real browser using the following headers
const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'dnt': '1',
    'origin': 'https://130point.com',
    'priority': 'u=1, i',
    'referer': 'https://130point.com/',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
};

const data = 'query=anthony%2Bedwards%2Bprizm%2Bsilver%2Bpsa%2B10&type=2&subcat=-1';

axios.post('https://back.130point.com/sales/', data, { headers })
    .then(response => {
        console.log('[✅ Response Length]', response.data.length);
        require('fs').writeFileSync('response.html', response.data);

        const listings = parseHTML(response.data);

        console.log('[🧾 Listings Preview]', listings.slice(0, 3)); // Show first 3
    })
    .catch(err => {
        console.error('[❌ Error]', err.message);
    });

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
      

