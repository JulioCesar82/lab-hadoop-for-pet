const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Petshop API',
      version: '1.0.0',
      description: 'API para o laboratório de Hadoop com um petshop. Antes de mais nada, é necessário criar uma organização através do convite fornecido previamente, após a criação da organização você receberá uma chave de API (ApiKey) para autenticar suas solicitações. O acesso à API é protegido pela chave de API (ApiKey), garantindo que apenas usuários autorizados possam interagir com os recursos do sistema.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desenvolvimento - v1',
      },
      {
        url: 'https://julio471-inf332-hackaton-petshop.hf.space/api/v1',
        description: 'Servidor de Produção - v1',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    },
    security: [{
      ApiKeyAuth: []
    }]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos que contêm as anotações da API
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
