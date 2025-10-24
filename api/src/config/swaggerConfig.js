const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Petshop API',
      version: '1.0.0',
      description: 'API para o laboratório de Hadoop com um petshop.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desenvolvimento - v1',
      },
      {
        url: 'https://julio471-inf332-hackaton.hf.space/api/v1',
        description: 'Servidor de Produção - v1',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos que contêm as anotações da API
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
