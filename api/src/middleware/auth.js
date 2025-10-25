const pool = require('../config/database');

const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'API Key is required.' });
    }

    try {
        const result = await pool.query('SELECT organization_id FROM organization_apikey WHERE api_key = $1 AND nenabled = TRUE', [apiKey]);
        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Invalid API Key.' });
        }

        req.organization_id = result.rows[0].organization_id;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authenticateApiKey };
