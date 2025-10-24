const { body, validationResult } = require('express-validator');

const validateTutor = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('address').isString().optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateTutor,
};
