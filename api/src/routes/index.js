const express = require('express');
const router = express.Router();

const petRoutes = require('./pet.routes');
const tutorRoutes = require('./tutor.routes');
const batchRoutes = require('./batch.routes');

const v1Router = express.Router();

v1Router.use('/pet', petRoutes);
v1Router.use('/tutor', tutorRoutes);
v1Router.use('/batch', batchRoutes);

router.use('/v1', v1Router);

module.exports = router;
