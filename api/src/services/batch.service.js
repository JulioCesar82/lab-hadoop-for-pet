const { exec } = require('child_process');

const { pool } = require('../config/database');
const { validateJobName, getAllowedCommand } = require('../utils/jobValidator');
const { batch_codes } = require('../config/general');

const startJobAsync = async (jobName) => {
    validateJobName(jobName);
    const command = getAllowedCommand(jobName);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const runningJob = await pool.query(
        'SELECT * FROM execution_history WHERE target_table = $1 AND status = $2 AND start_time > $3',
        [jobName, batch_codes.RUNNING, tenMinutesAgo]
    );

    if (runningJob.rows.length > 0) {
        return { message: 'Job is already running', job: runningJob.rows[0] };
    }

    const startTime = new Date();
    const result = await pool.query(
        'INSERT INTO execution_history (target_table, start_time, status) VALUES ($1, $2, $3) RETURNING *',
        [jobName, startTime, batch_codes.RUNNING]
    );
    const executionId = result.rows[0].execution_id;

    exec(command, (error, stdout, stderr) => {
        const endTime = new Date();
        if (error) {
            pool.query(
                'UPDATE execution_history SET end_time = $1, status = $2, error_message = $3 WHERE execution_id = $4',
                [endTime, batch_codes.FAILED, stderr, executionId]
            );
        } else {
            pool.query(
                'UPDATE execution_history SET end_time = $1, status = $2 WHERE execution_id = $3',
                [endTime, batch_codes.COMPLETED, executionId]
            );
        }
    });

    return result.rows[0];
};

module.exports = {
    startJobAsync
};
