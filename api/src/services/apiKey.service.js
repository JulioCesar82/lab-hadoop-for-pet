const apiKeyRepository = require('../repository/postgres/apiKey.repository');

module.exports = {
    createApiKey: (organizationId) => apiKeyRepository.createApiKey(organizationId),
    getApiKeysByOrganizationId: (organizationId) => apiKeyRepository.getApiKeysByOrganizationId(organizationId),
    deleteApiKey: (organizationId, apiKey) => apiKeyRepository.deleteApiKey(organizationId, apiKey),
    getOrganizationByApiKey: (apiKey) => apiKeyRepository.getOrganizationByApiKey(apiKey),
};
