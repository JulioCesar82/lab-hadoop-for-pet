const createCrudService = require('./crud.service');
const petSpecificService = require('./pet.specific.service');

const petFields = ['tutor_id', 'name', 'image_path', 'birth_date', 'species', 'animal_type', 'fur_type'];
const petCrudService = createCrudService('pet', 'pet_id', petFields);

module.exports = {
    ...petCrudService,
    ...petSpecificService,
};
