const crudController = require('./crud.controller');
const petRepository = require('../repositories/postgres/pet.repository');
const petService = require('../services/pet.service');
const catchAsync = require('../utils/catchAsync');
const { statusCodes } = require('../config/general');

const petCrudController = crudController(petRepository);

const findPetsByCriteria = catchAsync(async (req, res) => {
    if (req.query.id) {
        return petCrudController.getById(req, res);
    }

    const pets = await petRepository.findPetsByCriteria(req.query, req.organization_id);

    res.status(statusCodes.OK).send(pets);
});

const uploadImage = catchAsync(async (req, res) => {
    const id = req.params.id;
    const pet = await petService.uploadImage(id, req.file, req.organization_id);

    if (pet) {
        res.status(statusCodes.OK).send(pet);
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Pet not found' });
    }
});

const updateRecommendation = catchAsync(async (req, res) => {
    const { id, ignore } = req.body;
    const pet = await petRepository.updateRecommendation(id, ignore, req.organization_id);

    if (pet) {
        res.status(statusCodes.OK).send(pet);
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Pet not found' });
    }
});

const getBookingRecommendations = catchAsync(async (req, res) => {
    const { id } = req.params;
    const recommendations = await petRepository.getBookingRecommendations(id, req.organization_id);

    res.status(statusCodes.OK).send(recommendations);
});

const getVaccineRecommendations = catchAsync(async (req, res) => {
    const { id } = req.params;
    const recommendations = await petRepository.getVaccineRecommendations(id, req.organization_id);

    res.status(statusCodes.OK).send(recommendations);
});

const disableBookingRecommendation = catchAsync(async (req, res) => {
    const { id } = req.params;
    await petRepository.disableBookingRecommendation(id, req.organization_id);

    res.status(statusCodes.NO_CONTENT).send();
});

const disableVaccineRecommendation = catchAsync(async (req, res) => {
    const { id, vaccineName } = req.params;
    await petRepository.disableVaccineRecommendation(id, vaccineName, req.organization_id);

    res.status(statusCodes.NO_CONTENT).send();
});

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
