const batchRepository = require('../repositories/postgres/batch.repository');
const batchService = require('../services/batch.service');
const catchAsync = require('../utils/catchAsync');
const { statusCodes, resourcesPath } = require('../config/general');

const entityScriptMapping = {
    'vaccine-recommendation': 'run_vaccine_pipeline.sh',
    'booking-reference': 'run_booking_reference_pipeline.sh',
    'booking-recommendation': 'run_booking_recommendation_pipeline.sh',
    'ltv-by-pet-profile': 'run_ltv_by_pet_profile_pipeline.sh',
};

exports.startJob = catchAsync(async (req, res) => {
    const { entity } = req.params;
    const script = entityScriptMapping[entity];

    if (!script) {
        return res.status(statusCodes.BAD_REQUEST).send({ message: 'Invalid entity.' });
    }

    const command = `bash ${resourcesPath}/${script} ${dbConfig.user} ${dbConfig.host} ${dbConfig.database} ${dbConfig.password} ${dbConfig.port}`;
    const result = await batchService.startJob(entity, command);

    res.status(statusCodes.OK).send(result);
});

exports.getJobStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await batchRepository.getJobStatus(id);
   
    res.status(statusCodes.OK).send(result);
});

exports.getJobResult = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await batchRepository.getJobResult(id);
   
    res.status(statusCodes.OK).send(result);
});

exports.getLTVByPetProfile = catchAsync(async (req, res) => {
    const result = await batchRepository.getLTVByPetProfile();
  
    res.status(statusCodes.OK).send(result);
});
