const pool = require('../config/database');


const uploadImage = async (petId, imagePath) => {
    const result = await pool.query(
        'UPDATE pet SET image_path = $1 WHERE pet_id = $2 RETURNING *',
        [imagePath, petId]
    );
    return result.rows[0];
};

const updateRecommendation = async (petId, ignore) => {
    const result = await pool.query(
        'UPDATE pet SET ignore_recommendation = $1 WHERE pet_id = $2 RETURNING *',
        [ignore, petId]
    );
    return result.rows[0];
};

const disableBookingRecommendation = async (petId) => {
    await pool.query(
        'UPDATE booking_recommendation SET ignore_recommendation = true WHERE pet_id = $1',
        [petId]
    );
};

const disableVaccineRecommendation = async (petId, vaccineName) => {
    await pool.query(
        'UPDATE vaccine_recommendation SET ignore_recommendation = true WHERE pet_id = $1 AND vaccine_name = $2',
        [petId, vaccineName]
    );
};

const findPetsByCriteria = async (criteria) => {
    const { species, animal_type, fur_type } = criteria;
    let query = 'SELECT * FROM pet WHERE 1=1';
    const params = [];

    if (species) {
        params.push(species);
        query += ` AND species = $${params.length}`;
    }
    if (animal_type) {
        params.push(animal_type);
        query += ` AND animal_type = $${params.length}`;
    }
    if (fur_type) {
        params.push(fur_type);
        query += ` AND fur_type = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return result.rows;
};

const getBookingRecommendations = async (petId) => {
    const result = await pool.query(
        'SELECT * FROM booking_recommendation WHERE pet_id = $1 AND ignore_recommendation = false',
        [petId]
    );
    return result.rows;
};

const getVaccineRecommendations = async (petId) => {
    const result = await pool.query(
        'SELECT * FROM vaccine_recommendation WHERE pet_id = $1 AND ignore_recommendation = false',
        [petId]
    );
    return result.rows;
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
