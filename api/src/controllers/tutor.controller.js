const createCrudController = require('./crud.controller');
const tutorService = require('../services/tutor.service');

const tutorCrudController = createCrudController(tutorService);

// TODO: Add list operations and other specific logic if needed

module.exports = {
    ...tutorCrudController,
};
