const express = require('express');
const cors = require('cors');

require('./database/database');

const routes = require('./routes/routes');

const app = express();

const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Metal Lab attivo');
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});