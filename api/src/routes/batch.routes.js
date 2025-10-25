const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
router.use(authenticateApiKey);
const batchController = require('../controllers/batch.controller');

/**
 * @swagger
 * tags:
 *   name: Batch
 *   description: The batch processing API
 */

/**
 * @swagger
 * /batch/vaccine-recommendation:
 *   post:
 *     summary: Start vaccine recommendation job
 *     tags: [Batch]
 *     responses:
 *       202:
 *         description: Job started
 *       500:
 *         description: Some server error
 */
router.post('/vaccine-recommendation', batchController.startVaccineRecommendationJob);

/**
 * @swagger
 * /batch/vaccine-recommendation/status:
 *   get:
 *     summary: Get vaccine recommendation job status
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job status
 *       500:
 *         description: Some server error
 */
router.get('/vaccine-recommendation/status', batchController.getVaccineRecommendationJobStatus);

/**
 * @swagger
 * /batch/vaccine-recommendation/result:
 *   get:
 *     summary: Get vaccine recommendation job result
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job result
 *       500:
 *         description: Some server error
 */
router.get('/vaccine-recommendation/result', batchController.getVaccineRecommendationJobResult);

/**
 * @swagger
 * /batch/booking-reference:
 *   post:
 *     summary: Start booking reference job
 *     tags: [Batch]
 *     responses:
 *       202:
 *         description: Job started
 *       500:
 *         description: Some server error
 */
router.post('/booking-reference', batchController.startBookingReferenceJob);

/**
 * @swagger
 * /batch/booking-reference/status:
 *   get:
 *     summary: Get booking reference job status
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job status
 *       500:
 *         description: Some server error
 */
router.get('/booking-reference/status', batchController.getBookingReferenceJobStatus);

/**
 * @swagger
 * /batch/booking-reference/result:
 *   get:
 *     summary: Get booking reference job result
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job result
 *       500:
 *         description: Some server error
 */
router.get('/booking-reference/result', batchController.getBookingReferenceJobResult);

/**
 * @swagger
 * /batch/booking-recommendation:
 *   post:
 *     summary: Start booking recommendation job
 *     tags: [Batch]
 *     responses:
 *       202:
 *         description: Job started
 *       500:
 *         description: Some server error
 */
router.post('/booking-recommendation', batchController.startBookingRecommendationJob);

/**
 * @swagger
 * /batch/booking-recommendation/status:
 *   get:
 *     summary: Get booking recommendation job status
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job status
 *       500:
 *         description: Some server error
 */
router.get('/booking-recommendation/status', batchController.getBookingRecommendationJobStatus);

/**
 * @swagger
 * /batch/booking-recommendation/result:
 *   get:
 *     summary: Get booking recommendation job result
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job result
 *       500:
 *         description: Some server error
 */
router.get('/booking-recommendation/result', batchController.getBookingRecommendationJobResult);

/**
 * @swagger
 * /batch/ltv-by-pet-profile:
 *   post:
 *     summary: Start LTV by pet profile job
 *     tags: [Batch]
 *     responses:
 *       202:
 *         description: Job started
 *       500:
 *         description: Some server error
 */
router.post('/ltv-by-pet-profile', batchController.startLtvByPetProfileJob);

/**
 * @swagger
 * /batch/ltv-by-pet-profile/status:
 *   get:
 *     summary: Get LTV by pet profile job status
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job status
 *       500:
 *         description: Some server error
 */
router.get('/ltv-by-pet-profile/status', batchController.getLtvByPetProfileJobStatus);

/**
 * @swagger
 * /batch/ltv-by-pet-profile/result:
 *   get:
 *     summary: Get LTV by pet profile job result
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: Job result
 *       500:
 *         description: Some server error
 */
router.get('/ltv-by-pet-profile/result', batchController.getLtvByPetProfileJobResult);

/**
 * @swagger
 * /batch/ltv-by-pet-profile:
 *   get:
 *     summary: Get LTV by pet profile
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: LTV by pet profile
 *       500:
 *         description: Some server error
 */
router.get('/ltv-by-pet-profile', batchController.getLTVByPetProfile);

module.exports = router;
