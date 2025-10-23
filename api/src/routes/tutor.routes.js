const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutor.controller');

router.get('/', tutorController.getAll);
router.get('/:id', tutorController.getById);
router.post('/', tutorController.create);
router.put('/:id', tutorController.update);
router.delete('/:id', tutorController.remove);

// TODO: Add list operations and other specific logic if needed

module.exports = router;
