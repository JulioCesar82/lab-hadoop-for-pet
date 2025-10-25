const pool = require('../config/database');

// Lista de tabelas que são escopadas por organização
const organizationTables = [
    'tutor', 'pet', 'product', 'purchase', 'booking',
    'vaccination_record', 'vaccine_recommendation', 'booking_recommendation'
];

// Função auxiliar para adicionar filtros de organização e nenabled
const applyFilters = (query, params, tableName, organizationId) => {
    let newQuery = query;
    const newParams = [...params];
    let whereClauseAdded = query.toUpperCase().includes(' WHERE ');

    if (!whereClauseAdded) {
        newQuery += ' WHERE ';
    } else {
        newQuery += ' AND ';
    }
    newQuery += `nenabled = TRUE`;

    if (organizationTables.includes(tableName) && organizationId) {
        newQuery += ` AND organization_id = $${newParams.length + 1}`;
        newParams.push(organizationId);
    }
    return { query: newQuery, params: newParams };
};

const getAll = (tableName) => async (organizationId) => {
    const { query, params } = applyFilters(`SELECT * FROM ${tableName}`, [], tableName, organizationId);
    const result = await pool.query(query, params);
    return result.rows;
};

const getById = (tableName, idField) => async (id, organizationId) => {
    const initialQuery = `SELECT * FROM ${tableName} WHERE ${idField} = $1`;
    const { query, params } = applyFilters(initialQuery, [id], tableName, organizationId);
    const result = await pool.query(query, params);
    return result.rows[0];
};

const create = (tableName, fields) => async (data, organizationId) => {
    const allFields = [...fields];
    const dataWithOrg = { ...data };

    if (organizationTables.includes(tableName) && organizationId) {
        if (!allFields.includes('organization_id')) {
            allFields.push('organization_id');
        }
        dataWithOrg.organization_id = organizationId;
    }

    const columns = allFields.map(f => `${f}`).join(', ');
    const placeholders = allFields.map((_, i) => `$${i + 1}`).join(', ');
    const values = allFields.map(field => dataWithOrg[field]);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const update = (tableName, idField, fields) => async (id, data, organizationId) => {
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const values = fields.map(field => data[field]);
    
    let query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = $1`;
    let params = [id, ...values];

    if (organizationTables.includes(tableName) && organizationId) {
        query += ` AND organization_id = $${params.length + 1}`;
        params.push(organizationId);
    }
    query += ' RETURNING *';

    const result = await pool.query(query, params);
    return result.rows[0];
};

const remove = (tableName, idField) => async (id, organizationId) => {
    let query = `UPDATE ${tableName} SET nenabled = FALSE WHERE ${idField} = $1`;
    let params = [id];

    if (organizationTables.includes(tableName) && organizationId) {
        query += ` AND organization_id = $2`;
        params.push(organizationId);
    }
    query += ' RETURNING *';
    
    const result = await pool.query(query, params);
    return result.rows[0];
};

const createWithList = (tableName, fields) => async (items, organizationId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const createdItems = [];
        
        const allFields = [...fields];
        if (organizationTables.includes(tableName) && organizationId) {
            if (!allFields.includes('organization_id')) {
                allFields.push('organization_id');
            }
        }
        
        const columns = allFields.map(f => `${f}`).join(', ');
        const placeholders = allFields.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        for (const item of items) {
            const dataWithOrg = { ...item };
            if (organizationTables.includes(tableName) && organizationId) {
                dataWithOrg.organization_id = organizationId;
            }
            const values = allFields.map(field => dataWithOrg[field]);
            const result = await client.query(query, values);
            createdItems.push(result.rows[0]);
        }

        await client.query('COMMIT');
        return createdItems;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateWithList = (tableName, idField, fields) => async (items, organizationId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updatedItems = [];
        
        const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
        let baseQuery = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = $1`;
        if (organizationTables.includes(tableName) && organizationId) {
            baseQuery += ` AND organization_id = $${fields.length + 2}`;
        }
        baseQuery += ' RETURNING *';

        for (const item of items) {
            const values = fields.map(field => item[field]);
            const params = [item[idField], ...values];
            if (organizationTables.includes(tableName) && organizationId) {
                params.push(organizationId);
            }
            const result = await client.query(baseQuery, params);
            updatedItems.push(result.rows[0]);
        }

        await client.query('COMMIT');
        return updatedItems;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteWithList = (tableName, idField) => async (ids, organizationId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deletedItems = [];
        
        let query = `UPDATE ${tableName} SET nenabled = FALSE WHERE ${idField} = $1`;
        if (organizationTables.includes(tableName) && organizationId) {
            query += ` AND organization_id = $2`;
        }
        query += ' RETURNING *';

        for (const id of ids) {
            const params = [id];
            if (organizationTables.includes(tableName) && organizationId) {
                params.push(organizationId);
            }
            const result = await client.query(query, params);
            deletedItems.push(result.rows[0]);
        }

        await client.query('COMMIT');
        return deletedItems;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


module.exports = (tableName, idField, fields) => ({
    getAll: getAll(tableName),
    getById: getById(tableName, idField),
    create: create(tableName, fields),
    update: update(tableName, idField, fields),
    remove: remove(tableName, idField),
    createWithList: createWithList(tableName, fields),
    updateWithList: updateWithList(tableName, idField, fields),
    deleteWithList: deleteWithList(tableName, idField),
});
