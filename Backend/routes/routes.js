const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const authController = require('../controllers/authController');
const dipendentiController = require('../controllers/dipendentiController');
const interventiController = require('../controllers/interventiController'); 
const preventiviController = require('../controllers/preventiviController');
const catalogoController = require('../controllers/catalogoController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// AREA AUTENTICAZIONE
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authMiddleware.verifyToken, authController.profile);

// AREA CLIENTI
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

router.get(
  '/preventivi/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  preventiviController.getPreventivoClienteById
);

router.put(
  '/preventivi/:id/risposta', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  preventiviController.clienteRispondePreventivo
);

// Aggiungi questa rotta sotto la POST /preventivi
router.get(
  '/preventivi', 
  authMiddleware.verifyToken, 
  authMiddleware.isCliente, 
  preventiviController.getPreventiviCliente
);

// AREA ADMIN: GESTIONE DIPENDENTI
router.get('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.getAll);
router.post('/gestione-dipendenti', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.create);
router.put('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.update);
router.delete('/gestione-dipendenti/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, dipendentiController.delete);


// AREA ADMIN: GESTIONE INTERVENTI E PREVENTIVI
router.get(
  '/admin/preventivi',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  preventiviController.getPreventiviAdmin
);

// AREA ADMIN: GESTIONE CATALOGO
router.get('/catalogo', catalogoController.getAll);
router.post('/admin/catalogo', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('immagine'), catalogoController.createItem);
router.put('/admin/catalogo/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('immagine'), catalogoController.updateItem);
router.delete('/admin/catalogo/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, catalogoController.deleteItem);

// AREA PREFERITI CATALOGO (Solo utenti loggati)
router.get('/preferiti', authMiddleware.verifyToken, catalogoController.getPreferiti);
router.post('/preferiti/:id', authMiddleware.verifyToken, catalogoController.addPreferito);
router.delete('/preferiti/:id', authMiddleware.verifyToken, catalogoController.removePreferito);
router.get(
  '/admin/preventivi/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  preventiviController.getPreventivoAdminById
);

router.put(
  '/admin/preventivi/:id/proponi-prezzo',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  preventiviController.adminProponePrezzo
);

router.put(
  '/admin/preventivi/:id/rifiuta',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  preventiviController.adminRifiutaPreventivo
);

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
router.put(
  '/admin/interventi/:id/proponi-data',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.adminProponeData
);

router.put(
  '/admin/interventi/:id/rifiuta',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.adminRifiutaIntervento
);

router.put(
  '/interventi/:id/risposta-cliente',
  authMiddleware.verifyToken,
  authMiddleware.isCliente,
  interventiController.clienteRispondeData
);



router.get(
  '/interventi/:id',
  authMiddleware.verifyToken,
  authMiddleware.isCliente,
  interventiController.getInterventoClienteById
);

router.post(
  '/admin/interventi/:id/dipendenti',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.assegnaDipendente
);

router.get(
  '/admin/interventi/:id/dipendenti',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  interventiController.getDipendentiAssegnati
);

// ==========================================
// AREA DIPENDENTE: INTERVENTI ASSEGNATI
// ==========================================

router.get(
  '/dipendente/interventi',
  authMiddleware.verifyToken,
  authMiddleware.isDipendente,
  interventiController.getInterventiDipendente
);

router.get(
  '/dipendente/interventi/:id',
  authMiddleware.verifyToken,
  authMiddleware.isDipendente,
  interventiController.getInterventoDipendenteById
);

router.put(
  '/dipendente/interventi/:id/stato',
  authMiddleware.verifyToken,
  authMiddleware.isDipendente,
  interventiController.aggiornaStatoLavorazioneDipendente
);
module.exports = router;