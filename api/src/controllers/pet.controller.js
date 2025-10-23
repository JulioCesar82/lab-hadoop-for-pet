const createCrudController = require('./crud.controller');
const petService = require('../services/pet.service');

const petCrudController = createCrudController(petService);

const findPetsByCriteria = async (req, res) => {
    if (req.query.id) {
        return petCrudController.getById(req, res);
    }
    try {
        const pets = await petService.findPetsByCriteria(req.query);
        res.send(pets);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const petId = req.params.petId;
        const imagePath = req.file.path;
        const pet = await petService.uploadImage(petId, imagePath);
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
        const pet = await petService.updateRecommendation(petId, ignore);
        if (pet) {
            res.send(pet);
        } else {
            res.status(404).send({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const createWithList = async (req, res) => {
    try {
        const pets = await petService.createWithList(req.body);
        res.status(201).send(pets);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateWithList = async (req, res) => {
    try {
        const pets = await petService.updateWithList(req.body);
        res.send(pets);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const deleteWithList = async (req, res) => {
    try {
        const pets = await petService.deleteWithList(req.body);
        res.send({ message: 'Pets deleted successfully', deletedPets: pets });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

module.exports = {
    ...petCrudController,
    findPetsByCriteria,
    uploadImage,
    updateRecommendation,
    createWithList,
    updateWithList,
    deleteWithList,
};
