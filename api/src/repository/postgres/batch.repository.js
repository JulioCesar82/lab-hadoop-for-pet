const { pool } = require('../../config/database');
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

const getJobStatus = async (id) => {
    const result = await pool.query(
        'SELECT * FROM execution_history WHERE execution_id = $1',
        [id]
    );
    return result.rows[0];
};

const getJobResult = async (id) => {
    const jobResult = await pool.query(
        'SELECT target_table FROM execution_history WHERE execution_id = $1',
        [id]
    );
    const tableName = jobResult.rows[0].target_table;
    
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE nenabled = TRUE`);
    return result.rows;
};

const getLTVByPetProfile = async () => {
    const result = await pool.query('SELECT species, animal_type, fur_type, total_value FROM ltv_by_pet_profile WHERE nenabled = TRUE');
    return result.rows;
    };

module.exports = {
    startJob,
    getJobStatus,
    getJobResult,
    getLTVByPetProfile
};
