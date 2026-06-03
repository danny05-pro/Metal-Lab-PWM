const express = require('express');

// Controllers
const authController = require('../controllers/authController');
const dipendentiController = require('../controllers/dipendentiController');
// 1. IMPORTIAMO IL NUOVO CONTROLLER
const interventiController = require('../controllers/interventiController'); 
const preventiviController = require('../controllers/preventiviController');
// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ==========================================
// AREA AUTENTICAZIONE
// ==========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authMiddleware.verifyToken, authController.profile);

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

router.post(
  '/preventivi', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  preventiviController.creaPreventivo
);

// Aggiungi questa rotta sotto la POST /preventivi
router.get(
  '/preventivi', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  preventiviController.getPreventiviCliente
);

// ==========================================
// AREA ADMIN: GESTIONE DIPENDENTI
// ==========================================
router.get('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.getAll);
router.post('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.create);
router.put('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.update);
router.delete('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.delete);
// ==========================================
// AREA ADMIN: GESTIONE INTERVENTI
// ==========================================

router.get(
  '/admin/interventi',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.getInterventiAdmin
);

router.get(
  '/admin/interventi/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.getInterventoById
);


// ==========================================
// AREA ADMIN: GESTIONE INTERVENTI E PREVENTIVI
// ==========================================



// NUOVA ROTTA: Recupera tutti i preventivi per l'admin
router.get(
  '/admin/preventivi',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  preventiviController.getPreventiviAdmin
);

module.exports = router;