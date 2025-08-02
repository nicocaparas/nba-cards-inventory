const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

async function getAcceptedBestOffer(ebayID) {
    const url = 'https://back.130point.com/bestoffer/getBestOfferNew.php';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://130point.com',
        'Referer': 'https://130point.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    };

    // Construct the payload
    const payload = qs.stringify({
        ebayID,
        type: 'simple',
        auth: 'dc848953a13185261a89',
        price: '1,550.00'  // This value doesn’t affect result, just required
    });

    try {
        const response = await axios.post(url, payload, { headers });
        const $ = cheerio.load(response.data);

        // Extract value from submit button (e.g. "$1,312.50")
        const acceptedPrice = $("div.bestOfferSoldPrice input[type='submit']").val();

        // Future improvement: Adding a currency converter here for AUD, CAD, GBP since acceptedPrice contains the currency.

        return acceptedPrice;
    } catch (err) {
        console.error('❌ Failed to fetch accepted offer', err.message);
        return null;
    }
}

module.exports = getAcceptedBestOffer;
