const Intervento = require('../models/interventiModel');

exports.creaIntervento = async (req, res) => {
  try {
    const cliente_id = req.user.id; 
    const { descrizione, luogo, priorita, data_preferita } = req.body;

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
      data_preferita
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