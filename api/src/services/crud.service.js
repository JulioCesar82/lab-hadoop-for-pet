const pool = require('../config/database');

const organizationTables = [
    'tutor', 'pet', 'product', 'purchase', 'booking',
    'vaccination_record', 'vaccine_recommendation', 'booking_recommendation'
];

const tableRelationships = {
    pet: { joinTable: 'tutor', joinColumn: 'tutor_id' },
    purchase: { joinTable: 'tutor', joinColumn: 'tutor_id' },
    booking: { joinTable: 'pet', joinColumn: 'pet_id' },
    vaccination_record: { joinTable: 'pet', joinColumn: 'pet_id' },
    vaccine_recommendation: { joinTable: 'pet', joinColumn: 'pet_id' },
    booking_recommendation: { joinTable: 'pet', joinColumn: 'pet_id' },
};

const applyOrganizationFilter = (query, params, tableName, organizationId) => {
    let newQuery = query;
    const newParams = [...params];

    if (organizationTables.includes(tableName) && organizationId) {
        const relationship = tableRelationships[tableName];
        if (relationship) {
            const { joinTable, joinColumn } = relationship;
            const joinAlias = `${tableName}_join`;
            if (tableRelationships[joinTable]) {
                const nestedRelationship = tableRelationships[joinTable];
                const nestedJoinAlias = `${joinTable}_join`;
                newQuery = newQuery.replace(
                    `FROM ${tableName}`,
                    `FROM ${tableName} 
                     JOIN ${joinTable} ${joinAlias} ON ${tableName}.${joinColumn} = ${joinAlias}.${joinColumn}
                     JOIN ${nestedRelationship.joinTable} ${nestedJoinAlias} ON ${joinAlias}.${nestedRelationship.joinColumn} = ${nestedJoinAlias}.${nestedRelationship.joinColumn}`
                );
                const whereClause = ` ${nestedJoinAlias}.organization_id = ${newParams.length + 1}`;
                newQuery += newQuery.toUpperCase().includes(' WHERE ') ? ` AND ${whereClause}` : ` WHERE ${whereClause}`;
                newParams.push(organizationId);
            } else {
                newQuery = newQuery.replace(
                    `FROM ${tableName}`,
                    `FROM ${tableName} JOIN ${joinTable} ${joinAlias} ON ${tableName}.${joinColumn} = ${joinAlias}.${joinColumn}`
                );
                const whereClause = ` ${joinAlias}.organization_id = ${newParams.length + 1}`;
                newQuery += newQuery.toUpperCase().includes(' WHERE ') ? ` AND ${whereClause}` : ` WHERE ${whereClause}`;
                newParams.push(organizationId);
            }
        } else {
            const whereClause = ` ${tableName}.organization_id = ${newParams.length + 1}`;
            newQuery += newQuery.toUpperCase().includes(' WHERE ') ? ` AND ${whereClause}` : ` WHERE ${whereClause}`;
            newParams.push(organizationId);
        }
    }

    return { query: newQuery, params: newParams };
};

const find = (tableName) => async (filters, organizationId) => {
    let query = `SELECT * FROM ${tableName}`;
    const params = [];
    
    const filterKeys = Object.keys(filters);
    if (filterKeys.length > 0) {
        const whereClauses = filterKeys.map((key, i) => `${key} = ${i + 1}`);
        query += ` WHERE ${whereClauses.join(' AND ')}`;
        params.push(...Object.values(filters));
    }

    const { query: filteredQuery, params: finalParams } = applyOrganizationFilter(query, params, tableName, organizationId);
    
    const result = await pool.query(filteredQuery, finalParams);
    return result.rows;
};

const getById = (tableName, idField) => async (id, organizationId) => {
    const rows = await find(tableName)({ [idField]: id }, organizationId);
    return rows[0];
};

const create = (tableName, fields) => async (data, organizationId) => {
    const allFields = [...fields];
    const dataWithOrg = { ...data };

    if (organizationTables.includes(tableName) && organizationId && !tableRelationships[tableName]) {
        if (!allFields.includes('organization_id')) {
            allFields.push('organization_id');
        }
        dataWithOrg.organization_id = organizationId;
    }

    const columns = allFields.map(f => `${f}`).join(', ');
    const placeholders = allFields.map((_, i) => `${i + 1}`).join(', ');
    const values = allFields.map(field => dataWithOrg[field]);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const update = (tableName, idField, fields) => async (id, data, organizationId) => {
    const setClause = fields.map((field, i) => `${field} = ${i + 2}`).join(', ');
    const values = fields.map(field => data[field]);
    
    let query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = $1`;
    let params = [id, ...values];

    const { query: filteredQuery, params: finalParams } = applyOrganizationFilter(query, params, tableName, organizationId);
    
    const result = await pool.query(filteredQuery, finalParams);
    return result.rows[0];
};

const remove = (tableName, idField) => async (id, organizationId) => {
    let query = `UPDATE ${tableName} SET nenabled = FALSE WHERE ${idField} = $1`;
    let params = [id];

    const { query: filteredQuery, params: finalParams } = applyOrganizationFilter(query, params, tableName, organizationId);
    
    const result = await pool.query(filteredQuery, finalParams);
return result.rows[0];
};
const createWithList = (tableName, fields) => async (items, organizationId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const createdItems = [];

        for (const item of items) {
            const createdItem = await create(tableName, fields)(item, organizationId);
            createdItems.push(createdItem);
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

        for (const item of items) {
            const updatedItem = await update(tableName, idField, fields)(item[idField], item, organizationId);
            updatedItems.push(updatedItem);
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

        for (const id of ids) {
            const deletedItem = await remove(tableName, idField)(id, organizationId);
            deletedItems.push(deletedItem);
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
    find: find(tableName),
    getById: getById(tableName, idField),
    create: create(tableName, fields),
    update: update(tableName, idField, fields),
    remove: remove(tableName, idField),
    createWithList: createWithList(tableName, fields),
    updateWithList: updateWithList(tableName, idField, fields),
    deleteWithList: deleteWithList(tableName, idField),
});
