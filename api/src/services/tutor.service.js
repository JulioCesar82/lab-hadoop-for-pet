const createCrudService = require('./crud.service');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudService = createCrudService('tutor', 'tutor_id', tutorFields);

// TODO: Add list operations and other specific logic if needed

module.exports = {
    ...tutorCrudService,
};
