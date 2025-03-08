const express = require('express');
const router = express.Router();
const RoutingService = require('../services/RoutingService');

router.post('/fastest-route', async (req, res) => {
    try {
        const { fromBank, toBank } = req.body;
        if (!fromBank || !toBank) {
            return res.status(400).json({ error: 'Both fromBank and toBank are required' });
        }
        const result = await RoutingService.findFastestRoute(fromBank, toBank);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/cheapest-route', async (req, res) => {
    try {
        const { fromBank, toBank } = req.body;
        if (!fromBank || !toBank) {
            return res.status(400).json({ error: 'Both fromBank and toBank are required' });
        }
        const result = await RoutingService.findCheapestRoute(fromBank, toBank);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;