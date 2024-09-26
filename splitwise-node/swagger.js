const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Splitwise APIs',
      version: '1.0.0',
      description: 'Splitwise API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'API server'
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Expense: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the expense',
            },
            description: {
              type: 'string',
              description: 'The description of the expense',
            },
            amount: {
              type: 'number',
              description: 'The amount of the expense',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'The date of the created expense',
            }
          }
        }
      }
    },
    security: [],
  },
  apis: ['./Routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};