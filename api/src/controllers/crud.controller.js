const getAll = (repository) => async (req, res) => {
    try {
        const items = await repository.getAll(req.organization.organization_id);

        res.send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const getById = (repository) => async (req, res) => {
    try {
        const item = await repository.getById(req.params.id, req.organization.organization_id);

        if (item) {
            res.send(item);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const create = (repository) => async (req, res) => {
    try {
        const item = await repository.create(req.body, req.organization.organization_id);

        res.status(201).send(item);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const update = (repository) => async (req, res) => {
    try {
        const item = await repository.update(req.params.id, req.body, req.organization.organization_id);

        if (item) {
            res.send(item);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const remove = (repository) => async (req, res) => {
    try {
        const item = await repository.remove(req.params.id, req.organization.organization_id);

        if (item) {
            res.send({ message: 'Item deleted successfully' });
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const createWithList = (repository) => async (req, res) => {
    try {
        const items = await repository.createWithList(req.body, req.organization.organization_id);

        res.status(201).send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const updateWithList = (repository) => async (req, res) => {
    try {
        const items = await repository.updateWithList(req.body, req.organization.organization_id);

        res.send(items);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const deleteWithList = (repository) => async (req, res) => {
    try {
        const items = await repository.deleteWithList(req.body, req.organization.organization_id);
        
        res.send({ message: 'Items deleted successfully', deletedItems: items });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

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
