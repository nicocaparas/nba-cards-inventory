// routes/ebay.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get access IDs from .env 
const APP_ID = process.env.EBAY_APP_ID;
const CERT_ID = process.env.EBAY_CERT_ID;

// Create a cache for access token 
let tokenCache = null;

async function getEbayAccessToken() {
    if (tokenCache) return tokenCache;

    // Create credentials using APP_ID and CERT_ID 
    const credentials = Buffer.from(`${APP_ID}:${CERT_ID}`).toString('base64');

    // Makes a POST request to eBay’s OAuth token endpoint - a special server endpoint 
    // dedicated to handling access token requests.
    const response = await axios.post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        // new URLSearchParams({...}) - Creates a URL-encoded string from an object
        new URLSearchParams({
            // grant_type - How you want to authenticate (e.g. client_credentials)
            grant_type: 'client_credentials',
            // scope - What parts of the API your app wants permission to access
            scope: 'https://api.ebay.com/oauth/api_scope'
        }),
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    );

    tokenCache = response.data.access_token;
    // Token usually lasts for 2 hours — you could add expiration logic later
    return tokenCache;
}

router.get('/search', async (req, res) => {
    // Gets the search query from the request
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing query param ?q=' });

    try {
        const token = await getEbayAccessToken();
        const encodedQuery = encodeURIComponent(query);
        // limit=5 means only 5 listings will be returned 
        const response = await axios.get(
            `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodedQuery}&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Tells eBay you’re targeting the US marketplace 
                    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                },
            }
        );

        res.json(response.data.itemSummaries || []);
    } catch (error) {
        console.error('eBay API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch from eBay' });
    }
});

module.exports = router;
