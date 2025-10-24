const createCrudService = require('./crud.service');
const petService = require('./pet.service');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudService = createCrudService('tutor', 'tutor_id', tutorFields);

const getBookingRecommendations = async (tutorId) => {
    const pets = await petService.find({ tutor_id: tutorId });
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getBookingRecommendations(pet.pet_id);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const getVaccineRecommendations = async (tutorId) => {
    const pets = await petService.find({ tutor_id: tutorId });
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getVaccineRecommendations(pet.pet_id);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const updateRecommendation = async (tutorId, ignore) => {
    const pets = await petService.find({ tutor_id: tutorId });
    if (!pets || pets.length === 0) {
        return null;
    }
    const updatedPets = [];
    for (const pet of pets) {
        const updatedPet = await petService.updateRecommendation(pet.pet_id, ignore);
        updatedPets.push(updatedPet);
    }
    return updatedPets;
};


module.exports = {
    ...tutorCrudService,
    getBookingRecommendations,
    getVaccineRecommendations,
    updateRecommendation,
};