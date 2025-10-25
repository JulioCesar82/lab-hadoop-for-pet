const inMemoryDb = {};

const find = (tableName) => async (filters) => {
    if (!inMemoryDb[tableName]) {
        return [];
    }
    return inMemoryDb[tableName].filter(item => {
        return Object.keys(filters).every(key => item[key] === filters[key]);
    });
};

const getById = (tableName, idField) => async (id) => {
    const items = await find(tableName)({ [idField]: id });
    return items[0];
};

const create = (tableName, fields) => async (data) => {
    if (!inMemoryDb[tableName]) {
        inMemoryDb[tableName] = [];
    }
    const newItem = { ...data };
    inMemoryDb[tableName].push(newItem);
    return newItem;
};

const update = (tableName, idField, fields) => async (id, data) => {
    const items = await find(tableName)({ [idField]: id });
    if (items.length === 0) {
        return null;
    }
    const itemToUpdate = items[0];
    fields.forEach(field => {
        itemToUpdate[field] = data[field];
    });
    return itemToUpdate;
};

const remove = (tableName, idField) => async (id) => {
    const items = await find(tableName)({ [idField]: id });
    if (items.length === 0) {
        return null;
    }
    const itemToRemove = items[0];
    itemToRemove.nenabled = false;
    return itemToRemove;
};

const createWithList = (tableName, fields) => async (items) => {
    const createdItems = [];
    for (const item of items) {
        const createdItem = await create(tableName, fields)(item);
        createdItems.push(createdItem);
    }
    return createdItems;
};

const updateWithList = (tableName, idField, fields) => async (items) => {
    const updatedItems = [];
    for (const item of items) {
        const updatedItem = await update(tableName, idField, fields)(item[idField], item);
        updatedItems.push(updatedItem);
    }
    return updatedItems;
};

const deleteWithList = (tableName, idField) => async (ids) => {
    const deletedItems = [];
    for (const id of ids) {
        const deletedItem = await remove(tableName, idField)(id);
        deletedItems.push(deletedItem);
    }
    return deletedItems;
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
