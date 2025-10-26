const apiKeyRepository = require('../repositories/postgres/apiKey.repository');
const catchAsync = require('../utils/catchAsync');
const { statusCodes } = require('../config/general');

const create = catchAsync(async (req, res) => {
    const newApiKey = await apiKeyRepository.createApiKey(req.organization_id);
    
    res.status(statusCodes.CREATED).json(newApiKey);
});

const findAll = catchAsync(async (req, res) => {
    const apiKeys = await apiKeyRepository.getApiKeysByOrganizationId(req.organization_id);

    res.status(statusCodes.OK).json(apiKeys);
});

const remove = catchAsync(async (req, res) => {
    const { api_key } = req.params;
    const deletedApiKey = await apiKeyRepository.deleteApiKey(req.organization_id, api_key);

    if (!deletedApiKey) {
        return res.status(statusCodes.NOT_FOUND).json({ message: 'API key not found.' });
    }

    res.status(statusCodes.NO_CONTENT).send();
});

module.exports = {
    create,
    findAll,
    remove,
};
