const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batch.controller');

// Vaccine Recommendation
router.post('/vaccine-recommendation', batchController.startVaccineRecommendationJob);
router.get('/vaccine-recommendation/status', batchController.getVaccineRecommendationJobStatus);
router.get('/vaccine-recommendation/result', batchController.getVaccineRecommendationJobResult);

// Booking Reference
router.post('/booking-reference', batchController.startBookingReferenceJob);
router.get('/booking-reference/status', batchController.getBookingReferenceJobStatus);
router.get('/booking-reference/result', batchController.getBookingReferenceJobResult);

// Booking Recommendation
router.post('/booking-recommendation', batchController.startBookingRecommendationJob);
router.get('/booking-recommendation/status', batchController.getBookingRecommendationJobStatus);
router.get('/booking-recommendation/result', batchController.getBookingRecommendationJobResult);

// LTV by Pet Profile
router.post('/ltv-by-pet-profile', batchController.startLtvByPetProfileJob);
router.get('/ltv-by-pet-profile/status', batchController.getLtvByPetProfileJobStatus);
router.get('/ltv-by-pet-profile/result', batchController.getLtvByPetProfileJobResult);
router.get('/ltv-by-pet-profile', batchController.getLTVByPetProfile);

module.exports = router;
