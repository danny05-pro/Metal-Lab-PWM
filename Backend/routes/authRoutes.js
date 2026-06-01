const express = require('express');

// Controllers
const authController = require('../controllers/authController');
const dipendentiController = require('../controllers/dipendentiController');

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
// AREA ADMIN: GESTIONE DIPENDENTI
// ==========================================
router.get('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.getAll);

router.post('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.create);
//quando modifico o elimino un account mi servirà il suo id per riconoscerlo
router.put('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.update);

router.delete('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.delete);

module.exports = router;