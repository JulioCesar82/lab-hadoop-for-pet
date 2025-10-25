const createCrudService = require('./crud.service');
const tutorRepository = require('../repository/postgres/tutor.repository');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudService = createCrudService('tutor', 'tutor_id', tutorFields);

module.exports = {
    ...tutorCrudService,
    getBookingRecommendations: (tutorId, organizationId) => tutorRepository.getBookingRecommendations(tutorId, organizationId),
    getVaccineRecommendations: (tutorId, organizationId) => tutorRepository.getVaccineRecommendations(tutorId, organizationId),
    updateRecommendation: (tutorId, ignore, organizationId) => tutorRepository.updateRecommendation(tutorId, ignore, organizationId),
    notifyAllTutors: (organizationId) => tutorRepository.notifyAllTutors(organizationId),
};
