const createCrudService = require('./crud.service');

const petCrud = createCrudService('pet', 'pet_id', ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type', 'ignore_recommendation']);
const bookingRecCrud = createCrudService('booking_recommendation', 'booking_recommendation_id', ['ignore_recommendation']);
const vaccineRecCrud = createCrudService('vaccine_recommendation', 'vaccine_recommendation_id', ['ignore_recommendation']);

const uploadImage = async (petId, imagePath, organizationId) => {
    return await petCrud.update(petId, { image_path: imagePath }, organizationId);
};

const updateRecommendation = async (petId, ignore, organizationId) => {
    return await petCrud.update(petId, { ignore_recommendation: ignore }, organizationId);
};

const disableBookingRecommendation = async (petId, organizationId) => {
    const recommendations = await bookingRecCrud.find({ pet_id: petId }, organizationId);
    for (const rec of recommendations) {
        await bookingRecCrud.update(rec.booking_recommendation_id, { ignore_recommendation: true }, organizationId);
    }
};

const disableVaccineRecommendation = async (petId, vaccineName, organizationId) => {
    const recommendations = await vaccineRecCrud.find({ pet_id: petId, vaccine_name: vaccineName }, organizationId);
    for (const rec of recommendations) {
        await vaccineRecCrud.update(rec.vaccine_recommendation_id, { ignore_recommendation: true }, organizationId);
    }
};

const findPetsByCriteria = async (criteria, organizationId) => {
    return await petCrud.find(criteria, organizationId);
};

const getBookingRecommendations = async (petId, organizationId) => {
    return await bookingRecCrud.find({ pet_id: petId, ignore_recommendation: false }, organizationId);
};

const getVaccineRecommendations = async (petId, organizationId) => {
    return await vaccineRecCrud.find({ pet_id: petId, ignore_recommendation: false }, organizationId);
};

module.exports = {
    uploadImage,
    updateRecommendation,
    findPetsByCriteria,
    getBookingRecommendations,
    getVaccineRecommendations,
    disableBookingRecommendation,
    disableVaccineRecommendation
};
