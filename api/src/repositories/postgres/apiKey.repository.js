const crypto = require('crypto');

const crudRepository = require('./crud.repository');

const apiKeyFields = ['organization_id', 'api_key'];
const apiKeyCrudRepository = crudRepository('organization_apikey', 'api_key', apiKeyFields);

const createApiKeyAsync = async (organizationId) => {
    const apiKey = crypto.randomBytes(32).toString('hex');
    return await apiKeyCrudRepository.createAsync({ organization_id: organizationId, api_key: apiKey });
};

const getApiKeysByOrganizationIdAsync = async (organizationId) => {
    return await apiKeyCrudRepository.findAsync({ organization_id: organizationId, nenabled: true });
};

const deleteApiKeyAsync = async (organizationId, apiKey) => {
    const { pool } = require('../../config/database');

    const client = await pool.connect();

    const result = await client.query(
        'UPDATE organization_apikey SET nenabled = FALSE WHERE organization_id = $1 AND api_key = $2 RETURNING *',
        [organizationId, apiKey]
    );

    return result.rows[0];
};

const getOrganizationByApiKeyAsync = async (apiKey) => {
    const results = await apiKeyCrudRepository.findAsync({ api_key: apiKey, nenabled: true });
    return results[0];
};

module.exports = {
    createApiKeyAsync,
    getApiKeysByOrganizationIdAsync,
    deleteApiKeyAsync,
    getOrganizationByApiKeyAsync
};
