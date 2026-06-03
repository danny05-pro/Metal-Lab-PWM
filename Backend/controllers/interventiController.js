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
exports.getInterventoClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    if (Number(intervento.cliente_id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: 'Non puoi visualizzare un intervento non tuo.'
      });
    }

    return res.json(intervento);

  } catch (error) {
    console.error('Errore recupero dettaglio intervento cliente:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero del dettaglio intervento cliente.'
    });
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

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    await Intervento.adminRifiutaIntervento(id);

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

   if (Number(intervento.cliente_id) !== Number(req.user.id)) {
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
    nuova_data
  );
}else if (azione === 'annulla_intervento') {
  await Intervento.clienteAnnullaIntervento(
    id
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
    console.error('Errore recupero dettaglio intervento admin:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero del dettaglio intervento.'
    });
  }
};

exports.assegnaDipendente = async (req, res) => {
  try {
    const { id } = req.params;
    const { dipendente_id } = req.body;

    if (!dipendente_id) {
      return res.status(400).json({
        message: 'Dipendente obbligatorio.'
      });
    }

    const intervento = await Intervento.findById(id);

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato.'
      });
    }

    await Intervento.assegnaDipendente(id, dipendente_id);

    const dipendenti = await Intervento.findDipendentiAssegnati(id);

    return res.json({
      message: 'Dipendente assegnato correttamente.',
      dipendenti
    });

  } catch (error) {
    console.error('Errore assegnazione dipendente:', error);

    return res.status(500).json({
      message: 'Errore durante l’assegnazione del dipendente.'
    });
  }
};

exports.getDipendentiAssegnati = async (req, res) => {
  try {
    const { id } = req.params;

    const dipendenti = await Intervento.findDipendentiAssegnati(id);

    return res.json(dipendenti);

  } catch (error) {
    console.error('Errore recupero dipendenti assegnati:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero dei dipendenti assegnati.'
    });
  }
};

exports.getInterventiDipendente = async (req, res) => {
  try {
    const dipendente_id = req.user.id;

    const interventi = await Intervento.findByDipendenteId(dipendente_id);

    return res.json(interventi);

  } catch (error) {
    console.error('Errore recupero interventi dipendente:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero degli interventi assegnati.'
    });
  }
};

exports.getInterventoDipendenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const dipendente_id = req.user.id;

    const intervento = await Intervento.findByIdForDipendente(
      id,
      dipendente_id
    );

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato o non assegnato a questo dipendente.'
      });
    }

    return res.json(intervento);

  } catch (error) {
    console.error('Errore recupero dettaglio intervento dipendente:', error);

    return res.status(500).json({
      message: 'Errore durante il recupero del dettaglio intervento dipendente.'
    });
  }
};

exports.aggiornaStatoLavorazioneDipendente = async (req, res) => {
  try {
    const { id } = req.params;
    const dipendente_id = req.user.id;

    const { stato_lavorazione } = req.body;

    const statiConsentiti = [
      'Programmato',
      'In lavorazione',
      'Terminato'
    ];

    if (!stato_lavorazione || !statiConsentiti.includes(stato_lavorazione)) {
      return res.status(400).json({
        message: 'Stato lavorazione non valido.'
      });
    }

    const intervento = await Intervento.findByIdForDipendente(
      id,
      dipendente_id
    );

    if (!intervento) {
      return res.status(404).json({
        message: 'Intervento non trovato o non assegnato a questo dipendente.'
      });
    }

    await Intervento.updateStatoLavorazioneForDipendente(
      id,
      dipendente_id,
      stato_lavorazione
    );

    const interventoAggiornato = await Intervento.findByIdForDipendente(
      id,
      dipendente_id
    );

    return res.json({
      message: 'Stato intervento aggiornato correttamente.',
      intervento: interventoAggiornato
    });

  } catch (error) {
    console.error('Errore aggiornamento stato lavorazione:', error);

    return res.status(500).json({
      message: 'Errore durante l’aggiornamento dello stato lavorazione.'
    });
  }
};