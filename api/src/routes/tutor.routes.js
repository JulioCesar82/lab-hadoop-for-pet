const express = require('express');
const router = express.Router();

const tutorController = require('../controllers/tutor.controller');
const { validateTutor } = require('../validators/tutor.validator');
const { authenticateApiKeyAsync } = require('../middleware/auth');

router.use(authenticateApiKeyAsync);

/**
 * @swagger
 * components:
 *   schemas:
 *     Tutor:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the tutor.
 *         name:
 *           type: string
 *           description: The name of the tutor.
 *         email:
 *           type: string
 *           description: The email of the tutor.
 *         phone:
 *           type: string
 *           description: The phone number of the tutor.
 *         address:
 *           type: string
 *           description: The address of the tutor.
 *       example:
 *         name: "João da Silva"
 *         email: "joao.silva@example.com"
 *         phone: "11999999999"
 *         address: "Rua das Flores, 123"
 */

/**
 * @swagger
 * tags:
 *   name: Tutors
 *   description: The tutors managing API
 */

/**
 * @swagger
 * /tutor:
 *   get:
 *     summary: Returns the list of all the tutors
 *     tags: [Tutors]
 *     responses:
 *       200:
 *         description: The list of the tutors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutor'
 */
router.get('/', tutorController.getAllAsync);

/**
 * @swagger
 * /tutor/{id}:
 *   get:
 *     summary: Get the tutor by id
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     responses:
 *       200:
 *         description: The tutor description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutor'
 *       404:
 *         description: The tutor was not found
 */
router.get('/:id', tutorController.getByIdAsync);

/**
 * @swagger
 * /tutor:
 *   post:
 *     summary: Create a new tutor
 *     tags: [Tutors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       201:
 *         description: The tutor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutor'
 *       500:
 *         description: Some server error
 */
router.post('/', validateTutor, tutorController.createAsync);

/**
 * @swagger
 * /tutor/{id}:
 *   put:
 *     summary: Update the tutor by the id
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       200:
 *         description: The tutor was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutor'
 *       404:
 *         description: The tutor was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', validateTutor, tutorController.updateAsync);

/**
 * @swagger
 * /tutor/{id}:
 *   delete:
 *     summary: Remove the tutor by id
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     responses:
 *       204:
 *         description: The tutor was deleted
 *       404:
 *         description: The tutor was not found
 */
router.delete('/:id', tutorController.removeAsync);

/**
 * @swagger
 * /tutor/notify-all:
 *   post:
 *     summary: Notifica todos os tutores sobre as recomendações pendentes de seus pets
 *     tags: [Tutors]
 *     description: Inicia um processo em background para enviar notificações (Email, SMS, Push) para todos os tutores que possuem recomendações ativas para seus pets.
 *     responses:
 *       202:
 *         description: Processo de notificação iniciado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Processo de notificação para todos os tutores foi iniciado."
 */
router.post('/notify-all', tutorController.notifyAllTutorsAsync);

/**
 * @swagger
 * /tutor/{id}/booking-recommendations:
 *   get:
 *     summary: Get booking recommendations for all pets of a tutor
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     responses:
 *       200:
 *         description: A list of booking recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request
 */
router.get('/:id/booking-recommendations', tutorController.getBookingRecommendationsAsync);

/**
 * @swagger
 * /tutor/{id}/vaccine-recommendations:
 *   get:
 *     summary: Get vaccine recommendations for all pets of a tutor
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     responses:
 *       200:
 *         description: A list of vaccine recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request
 */
router.get('/:id/vaccine-recommendations', tutorController.getVaccineRecommendationsAsync);

/**
 * @swagger
 * /tutor/{id}/update-recommendation:
 *   post:
 *     summary: Update recommendations for all pets of a tutor
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tutor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ignore:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The pets were updated
 *       404:
 *         description: Tutor not found or no pets to update.
 *       400:
 *         description: Bad request
 */
router.post('/:id/update-recommendation', tutorController.updateRecommendationAsync);

module.exports = router;
