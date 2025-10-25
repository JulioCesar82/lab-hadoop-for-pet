const createCrudService = require('./crud.repository');
const petService = require('./pet.repository');
const notificationService = require('../../services/notification.service');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudService = createCrudService('tutor', 'tutor_id', tutorFields);

const getBookingRecommendations = async (tutorId, organizationId) => {
    const pets = await petService.find({ tutor_id: tutorId }, organizationId);
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getBookingRecommendations(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const getVaccineRecommendations = async (tutorId, organizationId) => {
    const pets = await petService.find({ tutor_id: tutorId }, organizationId);
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getVaccineRecommendations(pet.pet_id, organizationId);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const updateRecommendation = async (tutorId, ignore, organizationId) => {
    const pets = await petService.find({ tutor_id: tutorId }, organizationId);
    if (!pets || pets.length === 0) {
        return null;
    }
    const updatedPets = [];
    for (const pet of pets) {
        const updatedPet = await petService.updateRecommendation(pet.pet_id, ignore, organizationId);
        updatedPets.push(updatedPet);
    }
    return updatedPets;
};

const notifyAllTutors = async (organizationId) => {
    // 1. Busca todos os tutores
    const allTutors = await tutorCrudService.find({}, organizationId);

    // 2. Itera sobre cada tutor para verificar e enviar notificações
    for (const tutor of allTutors) {
        // Busca recomendações de agendamento e vacinas
        const bookingRecommendations = await getBookingRecommendations(tutor.tutor_id, organizationId);
        const vaccineRecommendations = await getVaccineRecommendations(tutor.tutor_id, organizationId);
        const allRecommendations = [...bookingRecommendations, ...vaccineRecommendations];

        // 3. Se houver recomendações, notifica o tutor
        if (allRecommendations.length > 0) {
            console.log(`Tutor ${tutor.name} (ID: ${tutor.tutor_id}) tem ${allRecommendations.length} recomendações. Enviando notificações...`);
            notificationService.notifyTutor(tutor, allRecommendations);
        }
    }
};

module.exports = {
    ...tutorCrudService,
    getBookingRecommendations,
    getVaccineRecommendations,
    updateRecommendation,
    notifyAllTutors,
};
