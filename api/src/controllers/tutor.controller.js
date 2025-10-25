const createCrudController = require('./crud.controller');
const tutorService = require('../services/tutor.service');

const tutorCrudController = createCrudController(tutorService);

const getBookingRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await tutorService.getBookingRecommendations(id, req.organization.organization_id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getVaccineRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const recommendations = await tutorService.getVaccineRecommendations(id, req.organization.organization_id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRecommendation = async (req, res) => {
    try {
        const { id: tutorId } = req.params;
        const { ignore } = req.body;
        const result = await tutorService.updateRecommendation(tutorId, ignore, req.organization.organization_id);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'Tutor not found or no pets to update.' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const notifyAllTutors = async (req, res) => {
    try {
        // A notificação é um processo assíncrono que pode demorar.
        // Respondemos imediatamente e deixamos o processo rodando em background.
        tutorService.notifyAllTutors(req.organization.organization_id);
        res.status(202).send({ message: "Processo de notificação para todos os tutores foi iniciado." });
    } catch (error) {
        res.status(500).send({ message: `Falha ao iniciar o processo de notificação: ${error.message}` });
    }
};

module.exports = {
    ...tutorCrudController,
    getBookingRecommendations,
    getVaccineRecommendations,
    updateRecommendation,
    notifyAllTutors,
};