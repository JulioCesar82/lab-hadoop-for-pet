const pool = require('../config/database');
const crypto = require('crypto');

const createApiKey = async (organizationId) => {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const result = await pool.query(
        'INSERT INTO organization_apikey (organization_id, api_key) VALUES ($1, $2) RETURNING *',
        [organizationId, apiKey]
    );
    return result.rows[0];
};

const getApiKeysByOrganizationId = async (organizationId) => {
    const result = await pool.query('SELECT * FROM organization_apikey WHERE organization_id = $1 AND nenabled = TRUE', [organizationId]);
    return result.rows;
};

const deleteApiKey = async (organizationId, apiKey) => {
    const result = await pool.query(
        'UPDATE organization_apikey SET nenabled = FALSE WHERE organization_id = $1 AND api_key = $2 RETURNING *',
        [organizationId, apiKey]
    );
    return result.rows[0];
};

const getOrganizationByApiKey = async (apiKey) => {
    const result = await pool.query('SELECT organization_id FROM organization_apikey WHERE api_key = $1 AND nenabled = TRUE', [apiKey]);
    return result.rows[0];
};

module.exports = {
    createApiKey,
    getApiKeysByOrganizationId,
    deleteApiKey,
    getOrganizationByApiKey,
};
