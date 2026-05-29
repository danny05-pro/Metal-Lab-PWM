const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Quando ricevi una richiesta POST su /login, esegui la funzione nel controller
router.post('/login', authController.login);

module.exports = router;