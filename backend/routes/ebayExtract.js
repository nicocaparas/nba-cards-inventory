const express = require('express');
const router = express.Router();

//const processListings = require('../ebayAPI/processListings');

router.get('/analyze', async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: 'Missing query parameter.' });
        }

        // Call scrape130point

        // Call processListings

        const result = {
            averagePrice: averagePrice,
            sampleCount: listings.length,
            usedListings: listings,
          };

        // res.json(result);

    } catch (error) {// 
        
        // Call your mocked function
        const listings = 
        console.error(error);
        res.status(500).json({ error: 'Failed to extract listings. Please try again later.' });
    }
});

module.exports = router;
