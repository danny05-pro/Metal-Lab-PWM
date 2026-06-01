const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// 1. Prendi tutti i dipendenti
exports.getAll = async (req, res) => {
  try {
    const dipendenti = await User.findByRole('dipendente');
    res.json(dipendenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dipendenti' });
  }
};

// 2. Crea un nuovo dipendente
exports.create = async (req, res) => {
  try {
    // Aggiunto "telefono" all'estrazione dei dati
    const { nome, cognome, email, telefono, password } = req.body;
    
    // Verifica email duplicata
    const esistente = await User.findByEmail(email);
    if (esistente) {
      return res.status(409).json({ message: 'Email già in uso' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuovo = await User.create({
      nome, 
      cognome, 
      email, 
      telefono, // Ora passa il telefono reale invece di ''
      password: passwordHash, 
      ruolo: 'dipendente'
    });
    
    res.status(201).json(nuovo);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione' });
  }
};

// 3. Modifica un dipendente
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiunto "telefono" all'estrazione dei dati
    const { nome, cognome, email, telefono, password } = req.body;
    
    // Inserito "telefono" nell'oggetto da aggiornare
    let updateData = { nome, cognome, email, telefono };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await User.update(id, updateData);
    res.json({ message: 'Dipendente aggiornato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la modifica' });
  }
};

// 4. Elimina un dipendente
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: 'Dipendente eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione' });
  }
};