const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API for Petshop Hadoop Lab is running!');
});

const routes = require('./routes');
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
