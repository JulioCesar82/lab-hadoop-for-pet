const organizationRepository = require('../repositories/postgres/organization.repository');

const create = async (req, res) => {
    try {
        const { invite_code, ...organizationData } = req.body;

        if (!invite_code) {
            return res.status(400).json({ message: 'Invite code is required.' });
        }

        const newOrganization = await organizationRepository.createOrganization(organizationData, invite_code);

        res.status(201).json(newOrganization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req, res) => {
    try {
        const organization = await organizationRepository.getOrganizationById(req.organization_id);

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const disable = async (req, res) => {
    try {
        const disabledOrganization = await organizationRepository.disableOrganization(req.organization_id);
        
        if (!disabledOrganization) {
            return res.status(404).json({ message: 'Organization not found or already disabled.' });
        }

        res.status(200).json(disabledOrganization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    findOne,
    disable,
};
