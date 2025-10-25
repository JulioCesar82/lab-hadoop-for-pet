const organizationService = require('../services/organization.service');

const create = async (req, res) => {
    try {
        const { invite_code, ...organizationData } = req.body;
        if (!invite_code) {
            return res.status(400).json({ message: 'Invite code is required.' });
        }
        const newOrganization = await organizationService.createOrganization(organizationData, invite_code);
        res.status(201).json(newOrganization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req, res) => {
    try {
        const organization = await organizationService.getOrganizationById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found.' });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    findOne,
};
