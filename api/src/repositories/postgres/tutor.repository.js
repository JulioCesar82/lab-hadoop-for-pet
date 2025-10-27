const crudRepository = require('./crud.repository');
const petRepository = require('./pet.repository');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudRepository = crudRepository('tutor', 'tutor_id', tutorFields);
const { default_page, max_page_size } = require('../../config/database');

const getBookingRecommendationsAsync = async (tutorId, organizationId, page, pageSize) => {
    const paginatedPets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId, page, pageSize);
    const recommendations = [];

    for (const pet of paginatedPets.data) {
        const petRecommendations = await petRepository.getBookingRecommendationsAsync(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return {
        data: recommendations,
        pagination: paginatedPets.pagination
    };
};

const getVaccineRecommendationsAsync = async (tutorId, organizationId, page, pageSize) => {
    const paginatedPets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId, page, pageSize);
    const recommendations = [];

    for (const pet of paginatedPets.data) {
        const petRecommendations = await petRepository.getVaccineRecommendationsAsync(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }

    return {
        data: recommendations,
        pagination: paginatedPets.pagination
    };
};

const updateRecommendationAsync = async (tutorId, ignore, organizationId) => {
    const pets = await petRepository.findAsync({ tutor_id: tutorId }, organizationId, default_page, max_page_size);

    if (!pets || pets.length === 0) {
        return null;
    }

    const updatedPets = [];
    for (const pet of pets.data) {
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
