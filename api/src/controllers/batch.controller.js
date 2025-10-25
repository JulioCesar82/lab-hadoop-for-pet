const { dbConfig } = require('../config/database');
const { resourcesPath } = require('../config/general');
const batchService = require('../services/batch.service');

const entityScriptMapping = {
    'vaccine-recommendation': 'run_vaccine_pipeline.sh',
    'booking-reference': 'run_booking_reference_pipeline.sh',
    'booking-recommendation': 'run_booking_recommendation_pipeline.sh',
    'ltv-by-pet-profile': 'run_ltv_by_pet_profile_pipeline.sh',
};

exports.startJob = async (req, res) => {
    try {
        const { entity } = req.params;
        const script = entityScriptMapping[entity];
        if (!script) {
            return res.status(400).send({ message: 'Invalid entity.' });
        }
        const command = `bash ${resourcesPath}/${script} ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
        const result = await batchService.startJob(entity, command);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await batchService.getJobStatus(id);
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getJobResult = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await batchService.getJobResult(id);
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
