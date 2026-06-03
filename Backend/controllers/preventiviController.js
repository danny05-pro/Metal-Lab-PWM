const Preventivo = require('../models/preventiviModel');

exports.creaPreventivo = async (req, res) => {
  try {
    const cliente_id = req.user.id; 
    const { descrizione, servizio, materiale, dimensioni, finitura, allegato } = req.body;

    if (!descrizione || !servizio || !materiale || !dimensioni) {
      return res.status(400).json({ message: 'Compila tutti i campi obbligatori.' });
    }

    const nuovoPreventivo = await Preventivo.create({
      cliente_id, descrizione, servizio, materiale, dimensioni,
      finitura: finitura || null,
      allegato: allegato || null
    });

    res.status(201).json({ message: 'Preventivo inviato con successo!', preventivo: nuovoPreventivo });
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

exports.getPreventivoClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const preventivo = await Preventivo.findById(id);

    if (!preventivo) {
      return res.status(404).json({ message: 'Preventivo non trovato.' });
    }

    if (Number(preventivo.cliente_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Non autorizzato a visualizzare questo preventivo.' });
    }

    return res.json(preventivo);
  } catch (error) {
    console.error('Errore recupero preventivo cliente:', error);
    return res.status(500).json({ message: 'Errore nel recupero del preventivo.' });
  }
};

exports.clienteRispondePreventivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { azione } = req.body; 

    const preventivo = await Preventivo.findById(id);
    if (!preventivo) return res.status(404).json({ message: 'Preventivo non trovato.' });
    if (Number(preventivo.cliente_id) !== Number(req.user.id)) return res.status(403).json({ message: 'Non autorizzato.' });

    // LUCCHETTO 1: Se il cliente ha già risposto, blocca tutto
    if (preventivo.stato_risposta_cliente !== 'In attesa') {
      return res.status(400).json({ message: 'Hai già risposto a questo preventivo. Il ciclo è chiuso.' });
    }

    if (preventivo.stato_admin !== 'Prezzo proposto') {
      return res.status(400).json({ message: 'Nessun prezzo da valutare.' });
    }

    // Calcoliamo i due nuovi stati
    const nuovoStatoCliente = azione === 'accetta' ? 'Accettato' : 'Rifiutato';
    
    // Se il cliente accetta, l'admin vedrà "Preventivo concordato". Se rifiuta, lo diamo per "Rifiutato" anche all'admin.
    const nuovoStatoAdmin = azione === 'accetta' ? 'Preventivo concordato' : 'Rifiutato';

    // Passiamo entrambi gli stati al database
    await Preventivo.clienteRisponde(id, nuovoStatoCliente, nuovoStatoAdmin);

    const preventivoAggiornato = await Preventivo.findById(id);
    return res.json({ message: `Preventivo ${nuovoStatoCliente.toLowerCase()} con successo.`, preventivo: preventivoAggiornato });
  } catch (error) {
    console.error('Errore risposta preventivo cliente:', error);
    return res.status(500).json({ message: 'Errore durante la risposta.' });
  }
};

// Recupera il dettaglio di un singolo preventivo per l'admin (con dati cliente)
exports.getPreventivoAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Usiamo la funzione del modello che fa la JOIN con gli utenti
    const preventivo = await Preventivo.findByIdForAdmin(id);

    if (!preventivo) {
      return res.status(404).json({ message: 'Preventivo non trovato.' });
    }

    return res.json(preventivo);
  } catch (error) {
    console.error('Errore recupero dettaglio preventivo admin:', error);
    return res.status(500).json({ message: 'Errore nel recupero del preventivo per admin.' });
  }
};


// Gestisce l'inserimento del prezzo da parte dell'admin
exports.adminProponePrezzo = async (req, res) => {
  try {
    const { id } = req.params;
    const { prezzo } = req.body;

    // Controllo di sicurezza: il prezzo deve esserci e deve essere un numero valido
    if (!prezzo || isNaN(prezzo) || prezzo <= 0) {
      return res.status(400).json({ message: 'Prezzo non valido.' });
    }

    // Controlliamo che il preventivo esista
    const preventivo = await Preventivo.findById(id);
    if (!preventivo) {
      return res.status(404).json({ message: 'Preventivo non trovato.' });
    }

    // LUCCHETTO 2: L'admin non può cambiare il prezzo se il cliente ha già chiuso la pratica
    if (preventivo.stato_risposta_cliente !== 'In attesa') {
      return res.status(400).json({ message: 'Impossibile modificare: il cliente ha già chiuso questo preventivo.' });
    }

    // Aggiorniamo il database tramite la funzione che abbiamo appena creato nel modello
    await Preventivo.adminProponePrezzo(id, prezzo);

    // Recuperiamo il preventivo aggiornato per restituirlo
    const preventivoAggiornato = await Preventivo.findByIdForAdmin(id);
    return res.json({ 
      message: 'Prezzo proposto con successo.', 
      preventivo: preventivoAggiornato 
    });
    
  } catch (error) {
    console.error('Errore proposta prezzo admin:', error);
    return res.status(500).json({ message: 'Errore durante la proposta del prezzo.' });
  }
};

// Gestisce il rifiuto del preventivo lato admin
exports.adminRifiutaPreventivo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controlliamo che il preventivo esista
    const preventivo = await Preventivo.findById(id);
    if (!preventivo) {
      return res.status(404).json({ message: 'Preventivo non trovato.' });
    }

    // LUCCHETTO 3: Se il preventivo è già stato chiuso in precedenza, non permettere altre modifiche
    if (preventivo.stato_risposta_cliente !== 'In attesa') {
      return res.status(400).json({ message: 'Impossibile rifiutare: il preventivo è già stato chiuso.' });
    }

    // Cambiamo lo stato in rifiutato nel database
    await Preventivo.adminRifiutaPreventivo(id);
    
    return res.json({ message: 'Preventivo rifiutato con successo.' });
    
  } catch (error) {
    console.error('Errore rifiuto preventivo admin:', error);
    return res.status(500).json({ message: 'Errore durante il rifiuto.' });
  }
};