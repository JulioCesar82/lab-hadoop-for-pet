const getAll = (service) => async (req, res) => {
    try {
        const items = await service.getAll();
        res.send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getById = (service) => async (req, res) => {
    try {
        const item = await service.getById(req.params.id);
        if (item) {
            res.send(item);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const create = (service) => async (req, res) => {
    try {
        const item = await service.create(req.body);
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const update = (service) => async (req, res) => {
    try {
        const item = await service.update(req.params.id, req.body);
        if (item) {
            res.send(item);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const remove = (service) => async (req, res) => {
    try {
        const item = await service.remove(req.params.id);
        if (item) {
            res.send({ message: 'Item deleted successfully' });
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const createWithList = (service) => async (req, res) => {
    try {
        const items = await service.createWithList(req.body);
        res.status(201).send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateWithList = (service) => async (req, res) => {
    try {
        const items = await service.updateWithList(req.body);
        res.send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const deleteWithList = (service) => async (req, res) => {
    try {
        const items = await service.deleteWithList(req.body);
        res.send({ message: 'Items deleted successfully', deletedItems: items });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

module.exports = (service) => ({
    getAll: getAll(service),
    getById: getById(service),
    create: create(service),
    update: update(service),
    remove: remove(service),
    createWithList: createWithList(service),
    updateWithList: updateWithList(service),
    deleteWithList: deleteWithList(service),
});
