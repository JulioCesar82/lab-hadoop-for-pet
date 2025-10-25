const { body, param } = require('express-validator');

const createOrganizationValidator = [
    body('name').isString().notEmpty(),
    body('social_name').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('identification_code').isString().notEmpty(),
    body('invite_code').isString().notEmpty(),
];

const getOrganizationValidator = [
    param('id').isInt(),
];

module.exports = {
    createOrganizationValidator,
    getOrganizationValidator,
};
