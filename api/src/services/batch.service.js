const batchRepository = require('../repository/postgres/batch.repository');

module.exports = {
    startJob: (jobName, command) => batchRepository.startJob(jobName, command),
    getJobStatus: (id) => batchRepository.getJobStatus(id),
    getJobResult: (id) => batchRepository.getJobResult(id),
    getLTVByPetProfile: () => batchRepository.getLTVByPetProfile(),
};
