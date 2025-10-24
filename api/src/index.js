const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { swaggerUi, specs } = require('./config/swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const routes = require('./routes');
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
