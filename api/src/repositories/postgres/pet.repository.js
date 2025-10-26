const crudRepository = require('./crud.repository');

const petFields = ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type'];
const petCrudRepository = crudRepository('pet', 'pet_id', petFields);

const petCrud = crudRepository('pet', 'pet_id', ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type', 'ignore_recommendation']);
const bookingRecCrud = crudRepository('booking_recommendation', 'booking_recommendation_id', ['ignore_recommendation']);
const vaccineRecCrud = crudRepository('vaccine_recommendation', 'vaccine_recommendation_id', ['ignore_recommendation']);

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
    ...petCrudRepository,
    updateRecommendation,
    findPetsByCriteria,
    getBookingRecommendations,
    getVaccineRecommendations,
    disableBookingRecommendation,
    disableVaccineRecommendation
};
