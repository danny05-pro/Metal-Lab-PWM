const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error(err.message);
    else console.log("Connesso al DB SQLite");
});

// Creazione tabella utenti (Allineata con setup.js)
db.run(`
    CREATE TABLE IF NOT EXISTS utenti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cognome TEXT,
        email TEXT UNIQUE,
        password TEXT,
        ruolo TEXT
    )
`);

module.exports = db;