const db = require('../database');

// Funzione per cercare un utente tramite la sua email
const getUserByEmail = (email, callback) => {
    const query = `SELECT * FROM utenti WHERE email = ?`;
    db.get(query, [email], (err, row) => {
        callback(err, row);
    });
};

module.exports = {
    getUserByEmail
};