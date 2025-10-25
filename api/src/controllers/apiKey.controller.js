const apiKeyService = require('../services/apiKey.service');

const create = async (req, res) => {
    try {
        const newApiKey = await apiKeyService.createApiKey(req.organization_id);
        res.status(201).json(newApiKey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findAll = async (req, res) => {
    try {
        const apiKeys = await apiKeyService.getApiKeysByOrganizationId(req.organization_id);
        res.status(200).json(apiKeys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { api_key } = req.params;
        const deletedApiKey = await apiKeyService.deleteApiKey(req.organization_id, api_key);
        if (!deletedApiKey) {
            return res.status(404).json({ message: 'API key not found.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    findAll,
    remove,
};
