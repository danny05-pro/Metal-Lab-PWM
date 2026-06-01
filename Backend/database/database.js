  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const bcrypt = require('bcrypt');

  const dbPath = path.join(__dirname, 'database.sqlite');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to SQLite DB');
    }
  });

  db.serialize(() => {

    

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cognome TEXT NOT NULL,
        telefono TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        ruolo TEXT NOT NULL CHECK (ruolo IN ('cliente', 'admin', 'dipendente'))
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS interventi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        dipendente_id INTEGER,
        descrizione TEXT NOT NULL,
        luogo TEXT NOT NULL,
        priorita TEXT NOT NULL,
        stato TEXT DEFAULT 'Da assegnare',
        data_richiesta TEXT NOT NULL,
        data_preferita TEXT,
        data_intervento TEXT,
        note TEXT,
        FOREIGN KEY (cliente_id) REFERENCES users(id),
        FOREIGN KEY (dipendente_id) REFERENCES users(id)
      )
    `);

    seedUtenti();

  });

  async function seedUtenti() {
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const dipendentePassword = await bcrypt.hash('Dipendente123!', 10);

    db.run(
      `
        INSERT OR IGNORE INTO users
        (id, nome, cognome, telefono, email, password, ruolo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        1,
        'Admin',
        'Metal Lab',
        '0000000000',
        'admin@metallab.it',
        adminPassword,
        'admin'
      ]
    );

    db.run(
      `
        INSERT OR IGNORE INTO users
        (id, nome, cognome, telefono, email, password, ruolo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        2,
        'Luigi',
        'Ferri',
        '3331234567',
        'dipendente@metallab.it',
        dipendentePassword,
        'dipendente'
      ]
    );
  }

  module.exports = db;