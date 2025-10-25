const petSpecificRepository = require('../repository/postgres/pet.specific.repository');

module.exports = {
    uploadImage: (petId, file, organizationId) => petSpecificRepository.uploadImage(petId, file, organizationId),
    updateRecommendation: (petId, ignore, organizationId) => petSpecificRepository.updateRecommendation(petId, ignore, organizationId),
    findPetsByCriteria: (criteria, organizationId) => petSpecificRepository.findPetsByCriteria(criteria, organizationId),
    getBookingRecommendations: (petId, organizationId) => petSpecificRepository.getBookingRecommendations(petId, organizationId),
    getVaccineRecommendations: (petId, organizationId) => petSpecificRepository.getVaccineRecommendations(petId, organizationId),
    disableBookingRecommendation: (petId, organizationId) => petSpecificRepository.disableBookingRecommendation(petId, organizationId),
    disableVaccineRecommendation: (petId, vaccineName, organizationId) => petSpecificRepository.disableVaccineRecommendation(petId, vaccineName, organizationId),
};
