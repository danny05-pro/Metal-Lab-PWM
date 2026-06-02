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
    console.error('Errore recupero interventi admin:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero degli interventi admin.'
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
    console.error('Errore recupero dettaglio intervento:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero del dettaglio intervento.'
    });
  }
};

exports.adminProponeData = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      data_proposta_admin,
      usa_data_cliente
    } = req.body;

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    if (usa_data_cliente) {
      if (!intervento.data_proposta_cliente) {
        return res.status(400).json({
          message: 'Il cliente non ha proposto nessuna data.'
        });
      }

      await Intervento.adminAccettaDataCliente(id);

    } else {
      if (!data_proposta_admin) {
        return res.status(400).json({
          message: 'La data proposta dall’admin è obbligatoria.'
        });
      }

      await Intervento.adminProponeData(id, data_proposta_admin);
    }

    const interventoAggiornato = await Intervento.findById(id);

    return res.json({
      message: 'Data proposta correttamente.',
      intervento: interventoAggiornato
    });

  } catch (error) {
    console.error('Errore proposta data admin:', error);

    return res.status(500).json({
      message: 'Errore durante la proposta della data.'
    });
  }
};

exports.adminRifiutaIntervento = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rifiuto_admin } = req.body;

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    await Intervento.adminRifiutaIntervento(
      id,
      motivo_rifiuto_admin || null
    );

    const interventoAggiornato = await Intervento.findById(id);

    return res.json({
      message: 'Intervento rifiutato correttamente.',
      intervento: interventoAggiornato
    });

  } catch (error) {
    console.error('Errore rifiuto intervento admin:', error);

    return res.status(500).json({
      message: 'Errore durante il rifiuto dell’intervento.'
    });
  }
};

exports.clienteRispondeData = async (req, res) => {
  try {
    const { id } = req.params;

    const {
  azione,
  nuova_data
} = req.body;

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    if (intervento.cliente_id !== req.user.id) {
      return res.status(403).json({
        message: 'Non puoi rispondere a un intervento non tuo.'
      });
    }

    if (azione === 'accetta_data') {
      if (!intervento.data_proposta_admin) {
        return res.status(400).json({
          message: 'Non esiste ancora una data proposta dall’admin.'
        });
      }

      await Intervento.clienteAccettaData(id);

    } else if (azione === 'proponi_nuova_data') {
  if (!nuova_data) {
    return res.status(400).json({
      message: 'La nuova data è obbligatoria.'
    });
  }

  await Intervento.clienteProponeNuovaData(
    id,
    nuova_data,
    null
  );
}else if (azione === 'annulla_intervento') {
  await Intervento.clienteAnnullaIntervento(
    id,
    null
  );
}else {
      return res.status(400).json({
        message: 'Azione non valida.'
      });
    }

    const interventoAggiornato = await Intervento.findById(id);

    return res.json({
      message: 'Risposta salvata correttamente.',
      intervento: interventoAggiornato
    });

  } catch (error) {
    console.error('Errore risposta cliente:', error);

    return res.status(500).json({
      message: 'Errore durante la risposta del cliente.'
    });
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