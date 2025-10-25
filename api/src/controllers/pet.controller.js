const createCrudController = require('./crud.controller');
const petService = require('../services/pet.service');

const petCrudController = createCrudController(petService);

const findPetsByCriteria = async (req, res) => {
    if (req.query.id) {
        return petCrudController.getById(req, res);
    }
    try {
        const pets = await petService.findPetsByCriteria(req.query, req.organization.organization_id);
        res.send(pets);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const petId = req.params.petId;
        //const imagePath = req.file.path;

        // TODO: Enviar imagem para o Cloudinary, salvar o caminho da imagem no banco e garantir o rollback caso algo dê errado


        const imagePath = null;
        const pet = await petService.uploadImage(petId, imagePath, req.organization.organization_id);
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
        const pet = await petService.updateRecommendation(petId, ignore, req.organization.organization_id);
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
        const recommendations = await petService.getBookingRecommendations(petId, req.organization.organization_id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getVaccineRecommendations = async (req, res) => {
    try {
        const { petId } = req.params;
        const recommendations = await petService.getVaccineRecommendations(petId, req.organization.organization_id);
        res.send(recommendations);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const disableBookingRecommendation = async (req, res) => {
    try {
        const { petId } = req.params;
        await petService.disableBookingRecommendation(petId, req.organization.organization_id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const disableVaccineRecommendation = async (req, res) => {
    try {
        const { petId, vaccineName } = req.params;
        await petService.disableVaccineRecommendation(petId, vaccineName, req.organization.organization_id);
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
