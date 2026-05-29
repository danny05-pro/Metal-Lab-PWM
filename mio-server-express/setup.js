const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // 1. Crea la tabella se non esiste già
    db.run(`CREATE TABLE IF NOT EXISTS utenti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cognome TEXT,
        email TEXT UNIQUE,
        password TEXT,
        ruolo TEXT
    )`);

    // 2. Cripta la password
    const email = 'admin@metallab.it';
    const passwordInChiaro = 'Admin123!';
    const saltRounds = 10;
    const hash = bcrypt.hashSync(passwordInChiaro, saltRounds);

    // 3. Inserisce l'utente
    const stmt = db.prepare(`INSERT INTO utenti (nome, cognome, email, password, ruolo) VALUES (?, ?, ?, ?, ?)`);
    stmt.run('Admin', 'Supremo', email, hash, 'admin', function(err) {
        if (err) {
            console.log("Utente già esistente o errore:", err.message);
        } else {
            console.log("✅ Utente di test creato con successo!");
            console.log("📧 Email: admin@metallab.it");
            console.log("🔑 Password: Admin123!");
        }
    });
    stmt.finalize();
});

db.close();