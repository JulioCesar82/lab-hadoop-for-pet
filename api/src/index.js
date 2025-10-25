const express = require('express');
require('dotenv').config();

const { apiPort } = require('./config/general');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { swaggerUi, specs } = require('./config/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const routes = require('./routes');
app.use('/api', routes);

const createDDL = require('./config/ddl');

app.listen(apiPort, async () => {
  await createDDL();
  console.log(`Server is running on port ${apiPort}`);
});
