const express = require('express');
const router = express.Router();

const getEbayData = require('../ebayAPI/getEbayData');
const processListings = require('../ebayAPI/processListings');

router.get('/analyze', async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: 'Missing query parameter.' });
        }

        // Call your mocked function
        const listings = await getEbayData(query);
        const processed = processListings(listings);

        const result = {
            averagePrice: processed.averagePrice,
            sampleCount: processed.sampleCount,
            usedListings: processed.usedListings,
          };

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router;
