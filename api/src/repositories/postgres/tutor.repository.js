const crudRepository = require('./crud.repository');
const petRepository = require('./pet.repository');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudRepository = crudRepository('tutor', 'tutor_id', tutorFields);

const getBookingRecommendations = async (tutorId, organizationId) => {
    const pets = await petRepository.find({ tutor_id: tutorId }, organizationId);
    const recommendations = [];

    for (const pet of pets) {
        const petRecommendations = await petRepository.getBookingRecommendations(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return recommendations;
};

const getVaccineRecommendations = async (tutorId, organizationId) => {
    const pets = await petRepository.find({ tutor_id: tutorId }, organizationId);
    const recommendations = [];

    for (const pet of pets) {
        const petRecommendations = await petRepository.getVaccineRecommendations(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return recommendations;
};

const updateRecommendation = async (tutorId, ignore, organizationId) => {
    const pets = await petRepository.find({ tutor_id: tutorId }, organizationId);

    if (!pets || pets.length === 0) {
        return null;
    }

    const updatedPets = [];
    for (const pet of pets) {
        const updatedPet = await petRepository.updateRecommendation(pet.pet_id, ignore, organizationId);
        updatedPets.push(updatedPet);
    }
    
    return updatedPets;
};

module.exports = {
    ...tutorCrudRepository,
    getBookingRecommendations,
    getVaccineRecommendations,
    updateRecommendation
};
