const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

require('./database/database');

const routes = require('./routes/routes');
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();

const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Server Metal Lab attivo');
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
