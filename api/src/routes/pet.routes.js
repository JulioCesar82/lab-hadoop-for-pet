const express = require('express');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - species
 *         - animal_type
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the pet.
 *         name:
 *           type: string
 *           description: The name of your pet.
 *         species:
 *           type: string
 *           description: The species of your pet.
 *         animal_type:
 *           type: string
 *           description: The type of your pet.
 *         fur_type:
 *           type: string
 *           description: The fur type of your pet.
 *         birth_date:
 *           type: string
 *           format: date
 *           description: The birth date of your pet.
 *         tutor_id:
 *           type: integer
 *           description: The id of the tutor of the pet.
 *       example:
 *         name: "Bolinha"
 *         species: "Cachorro"
 *         animal_type: "Pug"
 *         fur_type: "Curto"
 *         birth_date: "2022-01-15"
 *         tutor_id: 1
 */

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: The pets managing API
 */

const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

router.use(authenticateApiKey);
const petController = require('../controllers/pet.controller');
const { validatePet, validatePetList, validateDeletePetList } = require('../validators/pet.validator');
const upload = require('../config/upload-multipart-form-data');

// POST (Creates list of pets with given input array): /pet/createWithList
/**
 * @swagger
 * /pet/createWithList:
 *   post:
 *     summary: Creates list of pets with given input array
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: The list of pets was successfully created.
 *       500:
 *         description: Some server error
 */
router.post('/createWithList', validatePetList, petController.createWithList);

// POST (Add a new pet): /pet
/**
 * @swagger
 * /pet:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: The pet was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Some server error
 */
router.post('/', validatePet, petController.create);

// PUT (uploads an image): /pet/{id}/uploadImage
/**
 * @swagger
 * /pet/{id}/uploadImage:
 *   put:
 *     summary: Uploads an image to a pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.put('/:id/uploadImage', upload.single('image'), petController.uploadImage);

// PUT (Update an existing pet): /pet/{id}
/**
 * @swagger
 * /pet/{id}:
 *   put:
 *     summary: Update an existing pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: The pet was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.put('/:id', validatePet, petController.update);

// PUT (Updates list of pets with given input array): /pet/updateWithList
/**
 * @swagger
 * /pet/updateWithList:
 *   put:
 *     summary: Updates list of pets with given input array
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: The list of pets was successfully updated.
 *       500:
 *         description: Some server error
 */
router.put('/updateWithList', validatePetList, petController.updateWithList);

// DELETE (Delete an pet): /pet/{id}
/**
 * @swagger
 * /pet/{id}:
 *   delete:
 *     summary: Deletes a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       204:
 *         description: The pet was successfully deleted.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.delete('/:id', petController.remove);

// DELETE (Deletes list of pets with given input array): /pet/deleteWithList
/**
 * @swagger
 * /pet/deleteWithList:
 *   delete:
 *     summary: Deletes a list of pets
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               ids: [1, 2, 3]
 *     responses:
 *       204:
 *         description: The pets were successfully deleted.
 *       500:
 *         description: Some server error
 */
router.delete('/deleteWithList', validateDeletePetList, petController.deleteWithList);

// GET (Finds Pets by id): /pet?id={id}
/**
 * @swagger
 * /pet/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       200:
 *         description: The pet description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: The pet was not found
 */
router.get('/:id', petController.getById);

// GET (Finds Pets by species, animal_type or fur_type): /pet?type={type}&animal_type={animal_type}&fur_type={fur_type}
/**
 * @swagger
 * /pet:
 *   get:
 *     summary: Finds Pets by species, animal_type or fur_type
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: The species of the pet
 *       - in: query
 *         name: animal_type
 *         schema:
 *           type: string
 *         description: The animal type of the pet
 *       - in: query
 *         name: fur_type
 *         schema:
 *           type: string
 *         description: The fur type of the pet
 *     responses:
 *       200:
 *         description: A list of pets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Some server error
 */
router.get('/', petController.findPetsByCriteria);


// PUT (Ignore all recommendations for a pet): /pet/{id}/recommendations/ignore-all
/**
 * @swagger
 * /pet/{id}/recommendations/ignore-all:
 *   put:
 *     summary: Ignore all recommendations for a pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       200:
 *         description: All recommendations ignored.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.put('/:id/recommendations/ignore-all', petController.updateRecommendation);

// GET (Finds booking recommendations by id): /pet/{id}/recommendations/booking
/**
 * @swagger
 * /pet/{id}/recommendations/booking:
 *   get:
 *     summary: Finds booking recommendations by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       200:
 *         description: A list of booking recommendations.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.get('/:id/recommendations/booking', petController.getBookingRecommendations);

// GET (Finds vaccine recommendations by id): /pet/{id}/recommendations/vaccine
/**
 * @swagger
 * /pet/{id}/recommendations/vaccine:
 *   get:
 *     summary: Finds vaccine recommendations by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       200:
 *         description: A list of vaccine recommendations.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.get('/:id/recommendations/vaccine', petController.getVaccineRecommendations);

// DELETE (Disables a booking recommendation for a pet): /pet/{id}/recommendations/booking
/**
 * @swagger
 * /pet/{id}/recommendations/booking:
 *   delete:
 *     summary: Disables a booking recommendation for a pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *     responses:
 *       204:
 *         description: The booking recommendation was successfully disabled.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.delete('/:id/recommendations/booking', petController.disableBookingRecommendation);

// DELETE (Disables a specific vaccine recommendation for a pet): /pet/{id}/recommendations/vaccine/{vaccineName}
/**
 * @swagger
 * /pet/{id}/recommendations/vaccine/{vaccineName}:
 *   delete:
 *     summary: Disables a specific vaccine recommendation for a pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The pet id
 *       - in: path
 *         name: vaccineName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the vaccine
 *     responses:
 *       204:
 *         description: The vaccine recommendation was successfully disabled.
 *       404:
 *         description: The pet was not found.
 *       500:
 *         description: Some server error
 */
router.delete('/:id/recommendations/vaccine/:vaccineName', petController.disableVaccineRecommendation);


module.exports = router;
