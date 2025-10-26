const crypto = require('crypto');

const pool = require('../../config/database');

const createOrganization = async (organizationData, inviteCode) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const inviteResult = await client.query(
            'SELECT * FROM organization_invite WHERE invite_code = $1 AND nenabled = TRUE AND (expiration_date IS NULL OR expiration_date > NOW())',
            [inviteCode]
        );

        if (inviteResult.rows.length === 0) {
            throw new Error('Invalid or expired invite code.');
        }

        const { name, social_name, description, identification_code, links } = organizationData;
        const orgResult = await client.query(
            'INSERT INTO organization (name, social_name, description, identification_code, links) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, social_name, description, identification_code, links]
        );
        const newOrganization = orgResult.rows[0];

        await client.query(
            'UPDATE organization_invite SET nenabled = FALSE WHERE invite_code = $1',
            [inviteCode]
        );

        const apiKey = crypto.randomBytes(32).toString('hex');
        await client.query(
            'INSERT INTO organization_apikey (organization_id, api_key) VALUES ($1, $2)',
            [newOrganization.organization_id, apiKey]
        );

        await client.query('COMMIT');

        return { ...newOrganization, apiKey };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getOrganizationById = async (id) => {
    const result = await pool.query('SELECT * FROM organization WHERE organization_id = $1 AND nenabled = TRUE', [id]);
    
    return result.rows[0];
};

const getOrganizationByApiKey = async (apiKey) => {
    const result = await pool.query(
        'SELECT o.* FROM organization o JOIN organization_apikey oa ON o.organization_id = oa.organization_id WHERE oa.api_key = $1 AND o.nenabled = TRUE AND oa.nenabled = TRUE',
        [apiKey]
    );

    return result.rows[0];
};

const disableOrganization = async (id) => {
    const result = await pool.query(
        'UPDATE organization SET nenabled = FALSE WHERE organization_id = $1 AND nenabled = TRUE RETURNING *',
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createOrganization,
    getOrganizationById,
    disableOrganization,
    getOrganizationByApiKey,
};
