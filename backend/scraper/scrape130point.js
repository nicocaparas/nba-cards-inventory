const axios = require('axios');
const cheerio = require('cheerio');
const parseHTML = require('./parse130point');

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

async function scrape130Point(query) {
    // Replace spaces with '+' sign since 130point accepts this
    const queryString = query.trim().replace(/\s+/g, '+');
    // Construct query request 
    const data = `query=${encodeURIComponent(queryString)}&type=2&subcat=-1`;
    //console.log(data);

    // For debugging - // Sample data format accepted by 130point: 
    // const data = 'query=anthony%2Bedwards%2Bprizm%2Bsilver%2Bpsa%2B10&type=2&subcat=-1';

    try {
        const response = await axios.post('https://back.130point.com/sales/', data, { headers });

        const fs = require('fs');

        // Save HTML for debugging
        //fs.writeFileSync('130point_response.html', response.data);

        // For debugging - check if a response was returned
        //console.log('[✅ Response Length]', response.data.length);

        // Parse HTML response
        const listings = parseHTML(response.data);

        return listings;
    } catch (err) {
        console.error('[❌ Error]', err.message);
        return [];
    }
      }

module.exports = scrape130Point;
