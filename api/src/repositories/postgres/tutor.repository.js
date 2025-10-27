const crudRepository = require('./crud.repository');
const petRepository = require('./pet.repository');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudRepository = crudRepository('tutor', 'tutor_id', tutorFields);

const getBookingRecommendationsAsync = async (tutorId, organizationId) => {
    const pets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId);
    const recommendations = [];

    for (const pet of pets) {
        const petRecommendations = await petRepository.getBookingRecommendationsAsync(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return recommendations;
};

const getVaccineRecommendationsAsync = async (tutorId, organizationId) => {
    const pets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId);
    const recommendations = [];

    for (const pet of pets) {
        const petRecommendations = await petRepository.getVaccineRecommendationsAsync(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return recommendations;
};

const updateRecommendationAsync = async (tutorId, ignore, organizationId) => {
    const pets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId);

    if (!pets || pets.length === 0) {
        return null;
    }

    const updatedPets = [];
    for (const pet of pets) {
        const updatedPet = await petRepository.updateRecommendationAsync(pet.pet_id, ignore, organizationId);
        updatedPets.push(updatedPet);
    }
    
    return updatedPets;
};

module.exports = {
    ...tutorCrudRepository,
    getBookingRecommendationsAsync,
    getVaccineRecommendationsAsync,
    updateRecommendationAsync
};
