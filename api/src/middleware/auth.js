const organizationRepository = require('../repositories/postgres/organization.repository');

const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'API Key is required.' });
    }

    try {
        const organization = await organizationRepository.getOrganizationByApiKey(apiKey);
        if (!organization) {
            return res.status(403).json({ message: 'Invalid API Key.' });
        }

        if (organization.links && organization.links.length > 0) {
            const referer = req.headers.referer || req.headers.origin;
            if (!referer || !organization.links.some(link => referer.startsWith(link))) {
                return res.status(403).json({ message: 'Referer not allowed.' });
            }
        }

        req.organization_id = organization.organization_id;
        
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authenticateApiKey };
