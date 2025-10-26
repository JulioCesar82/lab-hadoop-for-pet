const crudController = require('./crud.controller');
const petRepository = require('../repositories/postgres/pet.repository');
const petService = require('../services/pet.service');

const petCrudController = crudController(petRepository);

const findPetsByCriteria = async (req, res) => {
    if (req.query.id) {
        return petCrudController.getById(req, res);
    }

    try {
        const pets = await petRepository.findPetsByCriteria(req.query, req.organization.organization_id);

        res.send(pets);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const petId = req.params.petId;
        const pet = await petService.uploadImage(petId, req.file, req.organization.organization_id);

        if (pet) {
            res.send(pet);
        } else {
            res.status(404).send({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateRecommendation = async (req, res) => {
    try {
        const { petId, ignore } = req.body;
        const pet = await petRepository.updateRecommendation(petId, ignore, req.organization.organization_id);

        if (pet) {
            res.send(pet);
        } else {
            res.status(404).send({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getBookingRecommendations = async (req, res) => {
    try {
        const { petId } = req.params;
        const recommendations = await petRepository.getBookingRecommendations(petId, req.organization.organization_id);

        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getVaccineRecommendations = async (req, res) => {
    try {
        const { petId } = req.params;
        const recommendations = await petRepository.getVaccineRecommendations(petId, req.organization.organization_id);

        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const disableBookingRecommendation = async (req, res) => {
    try {
        const { petId } = req.params;
        await petRepository.disableBookingRecommendation(petId, req.organization.organization_id);

        res.status(204).send();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const disableVaccineRecommendation = async (req, res) => {
    try {
        const { petId, vaccineName } = req.params;
        await petRepository.disableVaccineRecommendation(petId, vaccineName, req.organization.organization_id);

        res.status(204).send();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

module.exports = {
    ...petCrudController,
    findPetsByCriteria,
    uploadImage,
    updateRecommendation,
    getBookingRecommendations,
    getVaccineRecommendations,
    disableBookingRecommendation,
    disableVaccineRecommendation,
};