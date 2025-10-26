const catchAsync = require('../utils/catchAsync');
const { statusCodes } = require('../config/general');

const getAll = (repository) => catchAsync(async (req, res) => {
    const items = await repository.find(req.organization_id);

    res.status(statusCodes.OK).send(items);
});

const getById = (repository) => catchAsync(async (req, res) => {
    const { id } = req.params;
    const item = await repository.getById(id, req.organization_id);

    if (item) {
        res.status(statusCodes.OK).send(item);
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Item not found' });
    }
});

const create = (repository) => catchAsync(async (req, res) => {
    const item = await repository.create(req.body, req.organization_id);

    res.status(statusCodes.CREATED).send(item);
});

const update = (repository) => catchAsync(async (req, res) => {
    const { id } = req.params;
    const item = await repository.update(id, req.body, req.organization_id);

    if (item) {
        res.status(statusCodes.OK).send(item);
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Item not found' });
    }
});

const remove = (repository) => catchAsync(async (req, res) => {
    const { id } = req.params;
    const item = await repository.remove(id, req.organization_id);

    if (item) {
        res.status(statusCodes.OK).send({ message: 'Item deleted successfully' });
    } else {
        res.status(statusCodes.NOT_FOUND).send({ message: 'Item not found' });
    }
});

const createWithList = (repository) => catchAsync(async (req, res) => {
    const items = await repository.createWithList(req.body, req.organization_id);

    res.status(statusCodes.CREATED).send(items);
});

const updateWithList = (repository) => catchAsync(async (req, res) => {
    const items = await repository.updateWithList(req.body, req.organization_id);

    res.status(statusCodes.OK).send(items);
});

const deleteWithList = (repository) => catchAsync(async (req, res) => {
    const items = await repository.deleteWithList(req.body, req.organization_id);
    
    res.status(statusCodes.OK).send({ message: 'Items deleted successfully', deletedItems: items });
});

module.exports = (repository) => ({
    getAll: getAll(repository),
    getById: getById(repository),
    create: create(repository),
    update: update(repository),
    remove: remove(repository),
    createWithList: createWithList(repository),
    updateWithList: updateWithList(repository),
    deleteWithList: deleteWithList(repository),
});
