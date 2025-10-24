const pool = require('../config/database');
const { exec } = require('child_process');

const startJob = async (jobName, command) => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const runningJob = await pool.query(
        'SELECT * FROM execution_history WHERE target_table = $1 AND status = $2 AND start_time > $3',
        [jobName, 'RUNNING', tenMinutesAgo]
    );

    if (runningJob.rows.length > 0) {
        return { message: 'Job is already running', job: runningJob.rows[0] };
    }

    const startTime = new Date();
    const result = await pool.query(
        'INSERT INTO execution_history (target_table, start_time, status) VALUES ($1, $2, $3) RETURNING *',
        [jobName, startTime, 'RUNNING']
    );
    const executionId = result.rows[0].execution_id;

    exec(command, (error, stdout, stderr) => {
        const endTime = new Date();
        if (error) {
            pool.query(
                'UPDATE execution_history SET end_time = $1, status = $2, error_message = $3 WHERE execution_id = $4',
                [endTime, 'FAILED', stderr, executionId]
            );
        } else {
            pool.query(
                'UPDATE execution_history SET end_time = $1, status = $2 WHERE execution_id = $3',
                [endTime, 'COMPLETED', executionId]
            );
        }
    });

    return result.rows[0];
};

const getJobStatus = async (jobName) => {
    const result = await pool.query(
        'SELECT * FROM execution_history WHERE target_table = $1 ORDER BY start_time DESC LIMIT 1',
        [jobName]
    );
    return result.rows[0];
};

const getJobResult = async (tableName) => {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows;
};

const getLTVByPetProfile = async () => {
    const result = await pool.query('SELECT pet_profile, ltv FROM ltv_by_pet_profile');
    return result.rows;
    };

module.exports = {
    startJob,
    getJobStatus,
    getJobResult,
    getLTVByPetProfile
};
