const createCrudRepository = require('../repository/postgres/crud.repository');

module.exports = (tableName, idField, fields) => {
    const crudRepository = createCrudRepository(tableName, idField, fields);
    return {
        find: (filters, organizationId) => crudRepository.find(filters, organizationId),
        getById: (id, organizationId) => crudRepository.getById(id, organizationId),
        create: (data, organizationId) => crudRepository.create(data, organizationId),
        update: (id, data, organizationId) => crudRepository.update(id, data, organizationId),
        remove: (id, organizationId) => crudRepository.remove(id, organizationId),
        createWithList: (items, organizationId) => crudRepository.createWithList(items, organizationId),
        updateWithList: (items, organizationId) => crudRepository.updateWithList(items, organizationId),
        deleteWithList: (ids, organizationId) => crudRepository.deleteWithList(ids, organizationId),
    };
};
