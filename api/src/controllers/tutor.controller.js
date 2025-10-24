const createCrudController = require('./crud.controller');
const tutorService = require('../services/tutor.service');

const tutorCrudController = createCrudController(tutorService);

const getBookingRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await tutorService.getBookingRecommendations(id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getVaccineRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await tutorService.getVaccineRecommendations(id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRecommendation = async (req, res) => {
    try {
        const { id: tutorId } = req.params;
        const { ignore } = req.body;
        const result = await tutorService.updateRecommendation(tutorId, ignore);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'Tutor not found or no pets to update.' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};


module.exports = {
    ...tutorCrudController,
    getBookingRecommendations,
    getVaccineRecommendations,
    updateRecommendation,
};