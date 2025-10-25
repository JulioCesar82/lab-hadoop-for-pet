const { dbConfig } = require('../config/database');
const batchService = require('../services/batch.service');

exports.startVaccineRecommendationJob = async (req, res) => {
    try {
        const command = `bash resources/scripts/run_vaccine_pipeline.sh ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
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
        const command = `bash resources/scripts/run_booking_reference_pipeline.sh ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
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
        const command = `bash resources/scripts/run_booking_recommendation_pipeline.sh ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
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
        const command = `bash resources/scripts/run_ltv_by_pet_profile_pipeline.sh ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
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
