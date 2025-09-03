const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Tarefas',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de gestão de tarefas',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API de Gestão de Tarefas está no ar! Acesse /api-docs para ver a documentação.');
});

// Iniciar o servidor apenas se o arquivo for executado diretamente
if (!module.parent) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app; // Exporta o app para ser usado nos testes
