const express = require('express');
const router = express.Router();

const petRoutes = require('./pet.routes');
const batchRoutes = require('./batch.routes');

router.use('/pet', petRoutes);
router.use('/batch', batchRoutes);

module.exports = router;
