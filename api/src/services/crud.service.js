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

module.exports = (tableName, idField, fields) => ({
    getAll: getAll(tableName),
    getById: getById(tableName, idField),
    create: create(tableName, fields),
    update: update(tableName, idField, fields),
    remove: remove(tableName, idField),
});
