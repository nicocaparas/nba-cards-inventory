const express = require('express');
const router = express.Router();

const scrape130Point = require('../scraper/scrape130point.js');
const processListings = require('../scraper/processListings');

router.get('/analyze', async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: 'Missing query parameter.' });
        }

        // Step 1: Scrape listings from 130point
        const listings = await scrape130Point(query);
        
        // Step 2: Process the listings (remove outliers and valid accuracy of data)
        const result = await processListings(listings, query);

        // Step 3: Return the result to the frontend
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to extract listings. Please try again later.' });
    }
});

module.exports = router;
