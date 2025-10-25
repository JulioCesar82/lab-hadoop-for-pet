const batchService = require('../services/batch.service');

exports.startVaccineRecommendationJob = async (req, res) => {
    try {
        // TODO: Preciso executar os passos obrigatório para o preenchimento da tabela 'vaccine_recommendation' conforme o 'lab4-pipeline-vacinacao-predicao.ipynb'
        const command = 'echo "Starting vaccine recommendation job..."'; // Placeholder
        const result = await batchService.startJob('vaccine_recommendation', command);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getVaccineRecommendationJobStatus = async (req, res) => {
    try {
        const result = await batchService.getJobStatus('vaccine_recommendation');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getVaccineRecommendationJobResult = async (req, res) => {
    try {
        const result = await batchService.getJobResult('vaccine_recommendation');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.startBookingReferenceJob = async (req, res) => {
    try {
        // TODO: Preciso executar os passos obrigatório para o preenchimento da tabela 'booking_reference' conforme o 'lab2.1-pipeline-banho-e-tosa-referencia.ipynb'
        const command = 'echo "Starting booking reference job..."'; // Placeholder
        const result = await batchService.startJob('booking_reference', command);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getBookingReferenceJobStatus = async (req, res) => {
    try {
        const result = await batchService.getJobStatus('booking_reference');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getBookingReferenceJobResult = async (req, res) => {
    try {
        const result = await batchService.getJobResult('booking_reference');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.startBookingRecommendationJob = async (req, res) => {
    try {
        // TODO: Preciso executar os passos obrigatório para o preenchimento da tabela 'booking_recommendation' conforme o 'lab2.2-pipeline-banho-e-tosa-predicao.ipynb'
        const command = 'echo "Starting booking recommendation job..."'; // Placeholder
        const result = await batchService.startJob('booking_recommendation', command);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getBookingRecommendationJobStatus = async (req, res) => {
    try {
        const result = await batchService.getJobStatus('booking_recommendation');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getBookingRecommendationJobResult = async (req, res) => {
    try {
        const result = await batchService.getJobResult('booking_recommendation');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.startLtvByPetProfileJob = async (req, res) => {
    try {
        // TODO: Preciso executar os passos obrigatório para o preenchimento da tabela 'ltv_by_pet_profile' conforme o 'lab3-pipeline-valor-por-perfil.ipynb'
        const command = 'echo "Starting LTV by pet profile job..."'; // Placeholder
        const result = await batchService.startJob('ltv_by_pet_profile', command);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getLtvByPetProfileJobStatus = async (req, res) => {
    try {
        const result = await batchService.getJobStatus('ltv_by_pet_profile');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getLtvByPetProfileJobResult = async (req, res) => {
    try {
        const result = await batchService.getJobResult('ltv_by_pet_profile');
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getLTVByPetProfile = async (req, res) => {
    try {
        const result = await batchService.getLTVByPetProfile();
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
