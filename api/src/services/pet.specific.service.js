const pool = require('../config/database');

const createWithList = async (pets) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const createdPets = [];
        for (const pet of pets) {
            const { tutor_id, name, image_path, birth_date, species, animal_type, fur_type } = pet;
            const result = await client.query(
                'INSERT INTO pet (tutor_id, name, image_path, birth_date, species, animal_type, fur_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [tutor_id, name, image_path, birth_date, species, animal_type, fur_type]
            );
            createdPets.push(result.rows[0]);
        }
        await client.query('COMMIT');
        return createdPets;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateWithList = async (pets) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updatedPets = [];
        for (const pet of pets) {
            const { pet_id, name, image_path, birth_date, species, animal_type, fur_type } = pet;
            const result = await client.query(
                'UPDATE pet SET name = $1, image_path = $2, birth_date = $3, species = $4, animal_type = $5, fur_type = $6 WHERE pet_id = $7 RETURNING *',
                [name, image_path, birth_date, species, animal_type, fur_type, pet_id]
            );
            updatedPets.push(result.rows[0]);
        }
        await client.query('COMMIT');
        return updatedPets;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteWithList = async (petIds) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deletedPets = [];
        for (const petId of petIds) {
            const result = await client.query('DELETE FROM pet WHERE pet_id = $1 RETURNING *', [petId]);
            deletedPets.push(result.rows[0]);
        }
        await client.query('COMMIT');
        return deletedPets;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

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

module.exports = {
    createWithList,
    updateWithList,
    deleteWithList,
    uploadImage,
    updateRecommendation,
    findPetsByCriteria,
};
