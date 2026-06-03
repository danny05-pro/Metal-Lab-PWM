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
      ruolo TEXT NOT NULL CHECK (
        ruolo IN ('cliente', 'admin', 'dipendente')
      )
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS interventi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      cliente_id INTEGER NOT NULL,

      descrizione TEXT NOT NULL,
      luogo TEXT NOT NULL,

      priorita TEXT NOT NULL CHECK (
        priorita IN ('Bassa', 'Media', 'Alta')
      ),

      stato_admin TEXT NOT NULL DEFAULT 'Richiesto' CHECK (
        stato_admin IN (
          'Richiesto',
          'Rifiutato',
          'Data proposta',
          'In attesa nuova valutazione'
        )
      ),

      stato_risposta_cliente TEXT NOT NULL DEFAULT 'In attesa' CHECK (
        stato_risposta_cliente IN (
          'In attesa',
          'Data accettata',
          'Nuova data proposta',
          'Intervento annullato'
        )
      ),

      stato_lavorazione TEXT NOT NULL DEFAULT 'Da programmare' CHECK (
        stato_lavorazione IN (
          'Da programmare',
          'Programmato',
          'In lavorazione',
          'Terminato'
        )
      ),

      data_richiesta TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      data_proposta_cliente TEXT,

      data_proposta_admin TEXT,

      data_accettata TEXT,

      FOREIGN KEY (cliente_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dipendenti_interventi (
      intervento_id INTEGER NOT NULL,
      dipendente_id INTEGER NOT NULL,

      PRIMARY KEY (intervento_id, dipendente_id),

      FOREIGN KEY (intervento_id) REFERENCES interventi(id),
      FOREIGN KEY (dipendente_id) REFERENCES users(id)
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS preventivi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Collegamento con la tabella users
    cliente_id INTEGER NOT NULL,
    
    -- Dati tecnici raccolti dal form della dashboard cliente
    descrizione TEXT NOT NULL,
    servizio TEXT NOT NULL,
    materiale TEXT NOT NULL,
    dimensioni TEXT NOT NULL,
    finitura TEXT,
    allegato TEXT,
    
    -- Prezzo inserito dall'admin (nasce vuoto NULL)
    prezzo_proposto REAL DEFAULT NULL,
    
    -- 1. STATO LATO ADMIN (Gestione interna)
    stato_admin TEXT NOT NULL DEFAULT 'Da valutare' CHECK (
      stato_admin IN (
        'Da valutare',      -- Il cliente ha appena inviato la richiesta
        'Prezzo proposto',  -- L'admin ha valutato la fattibilità e ha inserito una cifra
        'Rifiutato'         -- L'admin scarta la richiesta (es. lavorazione non fattibile)
      )
    ),
    
    -- 2. STATO LATO CLIENTE (Risposta all'offerta economica)
    stato_risposta_cliente TEXT NOT NULL DEFAULT 'In attesa' CHECK (
      stato_risposta_cliente IN (
        'In attesa',  -- Il prezzo non c'è ancora, o il cliente non l'ha ancora letto
        'Accettato',  -- Il cliente conferma il preventivo e si può procedere
        'Rifiutato'   -- Il cliente ritiene il prezzo troppo alto e rifiuta
      )
    ),
    
    -- Vincolo di integrità referenziale
    FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE
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
    ],
    (err) => {
      if (err) {
        console.error('Errore seed admin:', err.message);
      }
    }
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
    ],
    (err) => {
      if (err) {
        console.error('Errore seed dipendente:', err.message);
      }
    }
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS catalogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      prezzo_base TEXT DEFAULT 'Su preventivo',
      immagine TEXT
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS preferiti (
      user_id INTEGER NOT NULL,
      catalogo_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, catalogo_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (catalogo_id) REFERENCES catalogo(id) ON DELETE CASCADE
    )
  `);

}

module.exports = db;