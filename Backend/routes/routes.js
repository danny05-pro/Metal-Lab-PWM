const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, 'allegato-' + uniqueName + ext);
  }
});

const upload = multer({ storage: storage });

const authController = require('../controllers/authController');
const dipendentiController = require('../controllers/dipendentiController');
const interventiController = require('../controllers/interventiController');
const preventiviController = require('../controllers/preventiviController');
const catalogoController = require('../controllers/catalogoController');

const middleware = require('../middlewares/middleware');

const router = express.Router();

// AREA AUTENTICAZIONE
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', middleware.verifyToken, authController.profile);

// AREA CLIENTI
router.post(
  '/interventi',
  middleware.verifyToken,
  middleware.isCliente,
  interventiController.creaIntervento
);

router.get(
  '/interventi',
  middleware.verifyToken,
  middleware.isCliente,
  interventiController.getInterventiCliente
);

router.post(
  '/preventivi',
  middleware.verifyToken,
  middleware.isCliente,
  upload.array('allegati', 5),
  preventiviController.creaPreventivo
);

router.get(
  '/preventivi/:id',
  middleware.verifyToken,
  middleware.isCliente,
  preventiviController.getPreventivoClienteById
);

router.patch(
  '/preventivi/:id/risposta',
  middleware.verifyToken,
  middleware.isCliente,
  preventiviController.clienteRispondePreventivo
);

router.get(
  '/preventivi',
  middleware.verifyToken,
  middleware.isCliente,
  preventiviController.getPreventiviCliente
);

// AREA ADMIN: GESTIONE DIPENDENTI
router.get('/gestione-dipendenti', middleware.verifyToken, middleware.isAdmin, dipendentiController.getAll);
router.post('/gestione-dipendenti', middleware.verifyToken, middleware.isAdmin, dipendentiController.create);
router.put('/gestione-dipendenti/:id', middleware.verifyToken, middleware.isAdmin, dipendentiController.update);
router.delete('/gestione-dipendenti/:id', middleware.verifyToken, middleware.isAdmin, dipendentiController.delete);


// AREA ADMIN: GESTIONE INTERVENTI E PREVENTIVI
router.get(
  '/admin/preventivi',
  middleware.verifyToken,
  middleware.isAdmin,
  preventiviController.getPreventiviAdmin
);

// AREA ADMIN: GESTIONE CATALOGO
router.get('/catalogo', catalogoController.getAll);
router.post('/admin/catalogo', middleware.verifyToken, middleware.isAdmin, upload.single('immagine'), catalogoController.createItem);
router.put('/admin/catalogo/:id', middleware.verifyToken, middleware.isAdmin, upload.single('immagine'), catalogoController.updateItem);
router.delete('/admin/catalogo/:id', middleware.verifyToken, middleware.isAdmin, catalogoController.deleteItem);

// AREA PREFERITI CATALOGO (Solo utenti loggati)
router.get('/preferiti', middleware.verifyToken, catalogoController.getPreferiti);
router.post('/preferiti/:id', middleware.verifyToken, catalogoController.addPreferito);
router.delete('/preferiti/:id', middleware.verifyToken, catalogoController.removePreferito);
router.get(
  '/admin/preventivi/:id',
  middleware.verifyToken,
  middleware.isAdmin,
  preventiviController.getPreventivoAdminById
);

router.patch(
  '/admin/preventivi/:id/proponi-prezzo',
  middleware.verifyToken,
  middleware.isAdmin,
  preventiviController.adminProponePrezzo
);

router.patch(
  '/admin/preventivi/:id/rifiuta',
  middleware.verifyToken,
  middleware.isAdmin,
  preventiviController.adminRifiutaPreventivo
);

router.get(
  '/admin/interventi',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.getInterventiAdmin
);

router.get(
  '/admin/interventi/:id',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.getInterventoById
);
router.patch(
  '/admin/interventi/:id/proponi-data',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.adminProponeData
);

router.patch(
  '/admin/interventi/:id/rifiuta',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.adminRifiutaIntervento
);

router.patch(
  '/interventi/:id/risposta-cliente',
  middleware.verifyToken,
  middleware.isCliente,
  interventiController.clienteRispondeData
);



router.get(
  '/interventi/:id',
  middleware.verifyToken,
  middleware.isCliente,
  interventiController.getInterventoClienteById
);

router.post(
  '/admin/interventi/:id/dipendenti',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.assegnaDipendente
);
router.put(
  '/admin/interventi/:id/dipendenti',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.aggiornaDipendentiAssegnati
);
router.get(
  '/admin/interventi/:id/dipendenti',
  middleware.verifyToken,
  middleware.isAdmin,
  interventiController.getDipendentiAssegnati
);

// ==========================================
// AREA DIPENDENTE: INTERVENTI ASSEGNATI
// ==========================================

router.get(
  '/dipendente/interventi',
  middleware.verifyToken,
  middleware.isDipendente,
  interventiController.getInterventiDipendente
);

router.get(
  '/dipendente/interventi/:id',
  middleware.verifyToken,
  middleware.isDipendente,
  interventiController.getInterventoDipendenteById
);

router.patch(
  '/dipendente/interventi/:id/stato',
  middleware.verifyToken,
  middleware.isDipendente,
  interventiController.aggiornaStatoLavorazioneDipendente
);
module.exports = router;
