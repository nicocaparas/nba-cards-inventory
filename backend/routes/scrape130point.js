const express = require('express');
const router = express.Router();
const scrape130Point = require('../scraper/scrape130point');

router.get('/', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing ?q=' });

    const listings = await scrape130Point(query);
    res.json(listings);
});

module.exports = router;
