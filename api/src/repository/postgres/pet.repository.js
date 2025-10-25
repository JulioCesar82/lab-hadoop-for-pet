const createCrudService = require('./crud.repository');
const petSpecificService = require('./pet.specific.repository');

const petFields = ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type'];
const petCrudService = createCrudService('pet', 'pet_id', petFields);

module.exports = {
    ...petCrudService,
    ...petSpecificService,
};
