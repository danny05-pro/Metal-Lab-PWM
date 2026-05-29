const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Questa è la chiave per firmare i token. (In produzione andrà in un file .env)
const SECRET_KEY = 'chiave_segreta_metal_lab_2026'; 

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e password sono obbligatori.' });
    }

    // 1. Cerca l'utente nel Database
    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Errore del server.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // 2. Confronta la password in chiaro con l'hash salvato nel db
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Errore durante la verifica.' });
            
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenziali non valide.' });
            }

            // 3. Password corretta! Generiamo il Token JWT
            const token = jwt.sign(
                { id: user.id, ruolo: user.ruolo, nome: user.nome }, 
                SECRET_KEY, 
                { expiresIn: '8h' } // Il token scade dopo 8 ore
            );

            // 4. Rispondiamo ad Angular con il token e i dati essenziali
            res.status(200).json({
                message: 'Login effettuato con successo',
                token: token,
                utente: {
                    nome: user.nome,
                    cognome: user.cognome,
                    ruolo: user.ruolo
                }
            });
        });
    });
};