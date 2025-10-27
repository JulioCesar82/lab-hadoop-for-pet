const crudController = require('./crud.controller');
const tutorRepository = require('../repositories/postgres/tutor.repository');
const tutorService = require('../services/tutor.service');
const catchAsync = require('../utils/catchAsync');
const { statusCodes } = require('../config/general');

const tutorCrudController = crudController(tutorRepository);

const getBookingRecommendationsAsync = catchAsync(async (req, res) => {
    const { id } = req.params;
    const recommendations = await tutorRepository.getBookingRecommendationsAsync(id, req.organization_id);

    res.status(statusCodes.OK).send(recommendations);
});

const getVaccineRecommendationsAsync = catchAsync(async (req, res) => {
    const { id } = req.params;
    const recommendations = await tutorRepository.getVaccineRecommendationsAsync(id, req.organization_id);

    res.status(statusCodes.OK).send(recommendations);
});

const updateRecommendationAsync = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { ignore } = req.body;

    const result = await tutorRepository.updateRecommendationAsync(id, ignore, req.organization_id);

    if (result) {
        res.status(statusCodes.OK).send(result);
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Tutor not found or no pets to update.' });
    }
});

const notifyAllTutorsAsync = catchAsync(async (req, res) => {
    // A notificação é um processo assíncrono que pode demorar.
    // Respondemos imediatamente e deixamos o processo rodando em background.
    tutorService.notifyAllTutorsAsync(req.organization_id);

    res.status(statusCodes.ACCEPTED).send({ message: "Processo de notificação para todos os tutores foi iniciado." });
});

module.exports = {
    ...tutorCrudController,
    getBookingRecommendationsAsync,
    getVaccineRecommendationsAsync,
    updateRecommendationAsync,
    notifyAllTutorsAsync
};
