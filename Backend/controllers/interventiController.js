const Intervento = require('../models/interventiModel');

exports.creaIntervento = async (req, res) => {
  try {
    const cliente_id = req.user.id; 
    const { descrizione, luogo, priorita, data_proposta_cliente } = req.body;

    if (!descrizione || !luogo || !priorita) {
      return res.status(400).json({ message: 'Compila tutti i campi obbligatori.' });
    }

    const data_richiesta = new Date().toISOString().split('T')[0];

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
    const interventi = await Intervento.findByClienteId(req.user.id);
    return res.json(interventi);
  } catch (error) {
    return res.status(500).json({ message: 'Errore lettura interventi.' });
  }
};

exports.getInterventiAdmin = async (req, res) => {
  try {
    const interventi = await Intervento.findAllForAdmin();
    return res.json(interventi);
  } catch (error) {
    return res.status(500).json({ message: 'Errore lettura interventi admin.' });
  }
};

exports.getInterventoById = async (req, res) => {
  try {
    const intervento = await Intervento.findById(req.params.id);
    if (!intervento) return res.status(404).json({ message: 'Non trovato.' });
    return res.json(intervento);
  } catch (error) {
    return res.status(500).json({ message: 'Errore lettura dettaglio.' });
  }
};