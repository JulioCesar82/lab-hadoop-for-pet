const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// POST (Creates list of pets with given input array): /pet/createWithList
router.post('/createWithList', petController.createWithList);

// POST (Add a new pet): /pet
router.post('/', petController.addPet);

// PUT (uploads an image): /pet/{petId}/uploadImage
router.put('/:petId/uploadImage', upload.single('image'), petController.uploadImage);

// PUT (Update an existing pet): /pet/{petId}
router.put('/:petId', petController.updatePet);

// PUT (Updates list of pets with given input array): /pet/updateWithList
router.put('/updateWithList', petController.updateWithList);

// PUT (Update recommendation of pet): /pet/notification
router.put('/notification', petController.updateRecommendation);

// DELETE (Delete an pet): /pet/{petId}
router.delete('/:petId', petController.deletePet);

// DELETE (Deletes list of pets with given input array): /pet/deleteWithList
router.delete('/deleteWithList', petController.deleteWithList);

// GET (Finds Pets by id): /pet?id={petId}
router.get('/', petController.findPetById);

// GET (Finds Pets by species, animal_type or fur_type): /pet?type={type}&animal_type={animal_type}&fur_type={fur_type}
// This will be handled by the same controller as findPetById, with logic to check query params
router.get('/', petController.findPetsByCriteria);


module.exports = router;
