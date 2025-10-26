const inMemoryDb = {};

const organizationTables = [
    'tutor', 'pet', 'product', 'purchase', 'booking',
    'vaccination_record', 'vaccine_recommendation', 'booking_recommendation'
];

const find = (tableName) => async (filters, organizationId) => {
    if (!inMemoryDb[tableName]) {
        return [];
    }

    let results = inMemoryDb[tableName];

    if (organizationTables.includes(tableName) && organizationId) {
        results = results.filter(item => item.organization_id === organizationId);
    }

    return results.filter(item => {
        return Object.keys(filters).every(key => item[key] === filters[key]);
    });
};

const getById = (tableName, idField) => async (id, organizationId) => {
    const items = await find(tableName)({ [idField]: id }, organizationId);
    return items[0];
};

const create = (tableName, fields) => async (data, organizationId) => {
    if (!inMemoryDb[tableName]) {
        inMemoryDb[tableName] = [];
    }
    
    const newItem = { ...data };
    if (organizationTables.includes(tableName) && organizationId) {
        newItem.organization_id = organizationId;
    }

    inMemoryDb[tableName].push(newItem);

    return newItem;
};

const update = (tableName, idField, fields) => async (id, data, organizationId) => {
    const items = await find(tableName)({ [idField]: id }, organizationId);

    if (items.length === 0) {
        return null;
    }

    const itemToUpdate = items[0];
    fields.forEach(field => {
        if (data[field] !== undefined) {
            itemToUpdate[field] = data[field];
        }
    });

    return itemToUpdate;
};

const remove = (tableName, idField) => async (id, organizationId) => {
    const items = await find(tableName)({ [idField]: id }, organizationId);

    if (items.length === 0) {
        return null;
    }

    const itemToRemove = items[0];
    itemToRemove.nenabled = false;

    return itemToRemove;
};

const createWithList = (tableName, fields) => async (items, organizationId) => {
    const createdItems = [];
    for (const item of items) {
        const createdItem = await create(tableName, fields)(item, organizationId);
        createdItems.push(createdItem);
    }

    return createdItems;
};

const updateWithList = (tableName, idField, fields) => async (items, organizationId) => {
    const updatedItems = [];

    for (const item of items) {
        const updatedItem = await update(tableName, idField, fields)(item[idField], item, organizationId);
        updatedItems.push(updatedItem);
    }

    return updatedItems;
};

const deleteWithList = (tableName, idField) => async (ids, organizationId) => {
    const deletedItems = [];
    
    for (const id of ids) {
        const deletedItem = await remove(tableName, idField)(id, organizationId);
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
