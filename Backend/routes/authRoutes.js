const express = require('express');

// Controllers
const authController = require('../controllers/authController');
const dipendentiController = require('../controllers/dipendentiController');
// 1. IMPORTIAMO IL NUOVO CONTROLLER
const interventiController = require('../controllers/interventiController'); 

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ==========================================
// AREA AUTENTICAZIONE
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.verifyToken, authController.profile);

// ==========================================
// AREA CLIENTI
// ==========================================
// 2. LA NUOVA ROTTA PER LA RICHIESTA INTERVENTO
router.post(
  '/interventi', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  interventiController.creaIntervento
);

router.get(
  '/interventi', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  interventiController.getInterventiCliente
);

// ==========================================
// AREA ADMIN: GESTIONE DIPENDENTI
// ==========================================
router.get('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.getAll);
router.post('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.create);
router.put('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.update);
router.delete('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.delete);

module.exports = router;