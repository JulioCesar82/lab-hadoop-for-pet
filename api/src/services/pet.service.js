const crudRepository = require('../repositories/postgres/crud.repository');

const { pool } = require('../config/database');
const upload = require('../config/upload-multipart-form-data');

const petCrud = crudRepository('pet', 'pet_id', ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type', 'ignore_recommendation']);

const uploadImage = async (petId, file, organizationId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const imagePath = file.path;
        const pet = await petCrud.update(petId, { image_path: imagePath }, organizationId, client);

        if (pet) {
            await client.query('COMMIT');
            return pet;
        } else {
            await client.query('ROLLBACK');
            return null;
        }
    } catch (error) {
        await client.query('ROLLBACK');
        // If there is an error, we need to delete the image from upload
        
        if (file) {
            upload.uploader.destroy(file.filename);
        }

        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    uploadImage,
};