const createCrudService = require('./crud.service');
const petService = require('./pet.service');
const notificationService = require('./notification.service');

const tutorFields = ['name', 'email', 'phone'];
const tutorCrudService = createCrudService('tutor', 'tutor_id', tutorFields);

const getBookingRecommendations = async (tutorId) => {
    const pets = await petService.find({ tutor_id: tutorId });
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getBookingRecommendations(pet.pet_id);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const getVaccineRecommendations = async (tutorId) => {
    const pets = await petService.find({ tutor_id: tutorId });
    const recommendations = [];
    for (const pet of pets) {
        const petRecommendations = await petService.getVaccineRecommendations(pet.pet_id);
        recommendations.push(...petRecommendations);
    }
    return recommendations;
};

const updateRecommendation = async (tutorId, ignore) => {
    const pets = await petService.find({ tutor_id: tutorId });
    if (!pets || pets.length === 0) {
        return null;
    }
    const updatedPets = [];
    for (const pet of pets) {
        const updatedPet = await petService.updateRecommendation(pet.pet_id, ignore);
        updatedPets.push(updatedPet);
    }
    return updatedPets;
};

const notifyAllTutors = async () => {
    // 1. Busca todos os tutores
    const allTutors = await tutorCrudService.find({});

    // 2. Itera sobre cada tutor para verificar e enviar notificações
    for (const tutor of allTutors) {
        // Busca recomendações de agendamento e vacinas
        const bookingRecommendations = await getBookingRecommendations(tutor.tutor_id);
        const vaccineRecommendations = await getVaccineRecommendations(tutor.tutor_id);
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