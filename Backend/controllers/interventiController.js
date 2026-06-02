const Intervento = require('../models/interventiModel');

exports.creaIntervento = async (req, res) => {
  try {
    const cliente_id = req.user.id; 
    const { descrizione, luogo, priorita, data_proposta_cliente } = req.body;

    if (!descrizione || !luogo || !priorita) {
      return res.status(400).json({ message: 'Compila tutti i campi obbligatori.' });
    }

    const data_richiesta = new Date().toISOString().split('T')[0];

    // Chiamiamo il Model e aspettiamo (await) che finisca di parlare col database
    const nuovoIntervento = await Intervento.create({
      cliente_id,
      descrizione,
      luogo,
      priorita,
      data_richiesta,
      data_proposta_cliente
    });

    res.status(201).json({ 
      message: 'Richiesta di intervento inviata con successo!',
      intervento: nuovoIntervento 
    });

  } catch (error) {
    console.error('Errore durante la creazione dell\'intervento:', error);
    res.status(500).json({ message: 'Errore durante l\'invio della richiesta.' });
  }
};


exports.getInterventiCliente = async (req, res) => {
  try {
    // req.user.id esiste grazie al middleware verifyToken
    const cliente_id = req.user.id;
    
    const interventi = await Intervento.findByClienteId(cliente_id);
    
    return res.json(interventi);
    
  } catch (error) {
    console.error('Errore nel recupero degli interventi:', error);
    return res.status(500).json({ message: 'Errore durante la lettura degli interventi.' });
  }
};

exports.getInterventiAdmin = async (req, res) => {
  try {
    const interventi = await Intervento.findAllForAdmin();

    return res.json(interventi);

  } catch (error) {
    console.error('Errore nel recupero interventi admin:', error);

    return res.status(500).json({
      message: 'Errore durante la lettura degli interventi admin.'
    });
  }
};

exports.getInterventoById = async (req, res) => {
  try {
    const { id } = req.params;

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    return res.json(intervento);

  } catch (error) {
    console.error('Errore nel recupero dettaglio intervento:', error);

    return res.status(500).json({
      message: 'Errore durante la lettura del dettaglio intervento.'
    });
  }
};