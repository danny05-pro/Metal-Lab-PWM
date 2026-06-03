const Catalogo = require('../models/catalogoModel');

exports.getAll = async (req, res) => {
  try {
    const voci = await Catalogo.findAll();
    res.json(voci);
  } catch (error) {
    console.error("Errore recupero catalogo:", error);
    res.status(500).json({ message: 'Errore nel caricamento del catalogo.' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { nome, categoria, prezzoBase } = req.body;
    const immagine = req.file ? `/uploads/${req.file.filename}` : '';
    if (!nome || !categoria) {
      return res.status(400).json({ message: 'Nome e categoria sono obbligatori.' });
    }
    const nuovaVoce = await Catalogo.create({ nome, categoria, prezzoBase, immagine });
    res.status(201).json(nuovaVoce);
  } catch (error) {
    console.error("Errore creazione voce catalogo:", error);
    res.status(500).json({ message: 'Errore durante la creazione.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, categoria, prezzoBase, immagine } = req.body;

    // Se c'è un nuovo file, usa il suo percorso, altrimenti tieni l'URL/stringa precedente
    const pathImmagine = req.file ? `/uploads/${req.file.filename}` : immagine;
    
    const modifiche = await Catalogo.update(id, { 
      nome, 
      categoria, 
      prezzoBase, 
      immagine: pathImmagine 
    });
    
    if (modifiche === 0) return res.status(404).json({ message: 'Voce non trovata.' });
    res.json({ message: 'Voce aggiornata con successo.' });
  } catch (error) {
    console.error("Errore aggiornamento voce catalogo:", error);
    res.status(500).json({ message: 'Errore durante la modifica.' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const modifiche = await Catalogo.delete(id);
    
    if (modifiche === 0) return res.status(404).json({ message: 'Voce non trovata.' });
    res.json({ message: 'Voce eliminata con successo.' });
  } catch (error) {
    console.error("Errore eliminazione voce catalogo:", error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione.' });
  }
};