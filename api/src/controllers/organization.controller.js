const organizationRepository = require('../repositories/postgres/organization.repository');
const catchAsync = require('../utils/catchAsync');
const { statusCodes } = require('../config/general');

const create = catchAsync(async (req, res) => {
    const { invite_code, ...organizationData } = req.body;

    if (!invite_code) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: 'Invite code is required.' });
    }

    const newOrganization = await organizationRepository.createOrganization(organizationData, invite_code);

    res.status(statusCodes.CREATED).json(newOrganization);
});

const findOne = catchAsync(async (req, res) => {
    const organization = await organizationRepository.getOrganizationById(req.organization_id);

    if (!organization) {
        return res.status(statusCodes.NOT_FOUND).json({ message: 'Organization not found.' });
    }

    res.status(statusCodes.OK).json(organization);
});

const disable = catchAsync(async (req, res) => {
    const disabledOrganization = await organizationRepository.disableOrganization(req.organization_id);
    
    if (!disabledOrganization) {
        return res.status(statusCodes.NOT_FOUND).json({ message: 'Organization not found or already disabled.' });
    }

    res.status(statusCodes.OK).json(disabledOrganization);
});

module.exports = {
    create,
    findOne,
    disable,
};
