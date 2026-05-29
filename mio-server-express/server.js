const express = require('express');
const cors = require('cors'); // Permette la comunicazione con Angular
const app = express();
const PORT = 3000;
const db = require('./database');

// Importiamo le rotte che abbiamo creato
const authRoutes = require('./routes/authRoutes');

// --- MIDDLEWARES GLOBALI ---
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server attivo e operativo! 🚀');
});

// API ENDPOINTS
// Tutte le rotte di authRoutes risponderanno sotto il prefisso /api/auth
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});