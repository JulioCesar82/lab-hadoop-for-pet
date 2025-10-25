const organizationRepository = require('../repository/postgres/organization.repository');

module.exports = {
    createOrganization: (organizationData, inviteCode) => organizationRepository.createOrganization(organizationData, inviteCode),
    getOrganizationById: (id) => organizationRepository.getOrganizationById(id),
    disableOrganization: (id) => organizationRepository.disableOrganization(id),
    getOrganizationByApiKey: (apiKey) => organizationRepository.getOrganizationByApiKey(apiKey),
};
