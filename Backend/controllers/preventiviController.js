const Preventivo = require('../models/preventiviModel');

exports.creaPreventivo = async (req, res) => {
  try {
    // req.user è iniettato dal middleware authMiddleware.verifyToken
    const cliente_id = req.user.id; 
    
    const { descrizione, servizio, materiale, dimensioni, finitura, allegato } = req.body;

    // Controllo campi obbligatori
    if (!descrizione || !servizio || !materiale || !dimensioni) {
      return res.status(400).json({ message: 'Compila tutti i campi obbligatori.' });
    }

    const nuovoPreventivo = await Preventivo.create({
      cliente_id,
      descrizione,
      servizio,
      materiale,
      dimensioni,
      finitura: finitura || null,
      allegato: allegato || null
    });

    res.status(201).json({ 
      message: 'Preventivo inviato con successo!',
      preventivo: nuovoPreventivo 
    });

  } catch (error) {
    console.error('Errore durante la creazione del preventivo:', error);
    res.status(500).json({ message: 'Errore durante l\'invio della richiesta.' });
  }
};

exports.getPreventiviCliente = async (req, res) => {
  try {
    const preventivi = await Preventivo.findByClienteId(req.user.id);
    res.json(preventivi);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero preventivi.' });
  }
};



exports.getPreventiviAdmin = async (req, res) => {
  try {
    const preventivi = await Preventivo.findAllForAdmin();
    return res.json(preventivi);
  } catch (error) {
    console.error('Errore nel recupero preventivi per admin:', error);
    return res.status(500).json({ message: 'Errore nel caricamento dei dati.' });
  }
};