const pool = require('../config/database');

const getAll = (tableName) => async () => {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows;
};

const getById = (tableName, idField) => async (id) => {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE ${idField} = $1`, [id]);
    return result.rows[0];
};

const create = (tableName, fields) => async (data) => {
    const columns = fields.join(', ');
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const values = fields.map(field => data[field]);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const update = (tableName, idField, fields) => async (id, data) => {
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = fields.map(field => data[field]);
    values.push(id);

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const remove = (tableName, idField) => async (id) => {
    const result = await pool.query(`DELETE FROM ${tableName} WHERE ${idField} = $1 RETURNING *`, [id]);
    return result.rows[0];
};

const createWithList = (tableName, fields) => async (items) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const createdItems = [];
        const columns = fields.join(', ');
        const placeholders = fields.map((_, i) => `${i + 1}`).join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        for (const item of items) {
            const values = fields.map(field => item[field]);
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

const updateWithList = (tableName, idField, fields) => async (items) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updatedItems = [];
        const setClause = fields.map((field, i) => `${field} = ${i + 1}`).join(', ');
        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ${fields.length + 1} RETURNING *`;

        for (const item of items) {
            const values = fields.map(field => item[field]);
            values.push(item[idField]);
            const result = await client.query(query, values);
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

const deleteWithList = (tableName, idField) => async (ids) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deletedItems = [];
        const query = `DELETE FROM ${tableName} WHERE ${idField} = $1 RETURNING *`;

        for (const id of ids) {
            const result = await client.query(query, [id]);
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
