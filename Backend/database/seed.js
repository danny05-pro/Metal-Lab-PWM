const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore di connessione:', err.message);
    process.exit(1);
  }
  console.log('Connesso al database SQLite. Avvio pulizia e inserimento dati...');
});

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

async function seedDatabase() {
  try {
    // 1. Pulizia tabelle esistenti e reset degli ID
    await runQuery(`DELETE FROM dipendenti_interventi`);
    await runQuery(`DELETE FROM preventivi`);
    await runQuery(`DELETE FROM interventi`);
    await runQuery(`DELETE FROM preferiti`);
    await runQuery(`DELETE FROM catalogo`);
    await runQuery(`DELETE FROM users`);
    await runQuery(`DELETE FROM sqlite_sequence`); // Resetta gli ID autoincrementanti

    console.log('Tabelle ripulite con successo.');

    // 2. Creazione Utenti (Tutti con password "Password123!")
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // DIPENDENTI
    await runQuery(
      `INSERT INTO users (id, nome, cognome, telefono, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [2, 'Luigi', 'Ferri', '3381234567', 'luigi.ferri@metallab.it', defaultPassword, 'dipendente']
    );
    await runQuery(
      `INSERT INTO users (id, nome, cognome, telefono, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [3, 'Marco', 'Saldatori', '3397654321', 'marco.saldatori@metallab.it', defaultPassword, 'dipendente']
    );

    // CLIENTI
    await runQuery(
      `INSERT INTO users (id, nome, cognome, telefono, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [4, 'Andrea', 'Bianchi', '3401122334', 'andrea.bianchi@gmail.com', defaultPassword, 'cliente']
    );
    await runQuery(
      `INSERT INTO users (id, nome, cognome, telefono, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [5, 'Logistica', 'Express SRL', '0912345678', 'info@logisticaexpress.it', defaultPassword, 'cliente']
    );

    console.log('Utenti inseriti.');

    // 3. Creazione Catalogo
    const catalogo = [
      { nome: 'Cancello Scorrevole Industriale', categoria: 'Prodotto', prezzo: 'Da 1200€', img: '' },
      { nome: 'Scala Antincendio Esterna', categoria: 'Prodotto', prezzo: 'Da 3500€', img: '' },
      { nome: 'Tettoia in Acciaio Zincato', categoria: 'Prodotto', prezzo: 'A partire da 80€/mq', img: '' },
      { nome: 'Taglio Laser CNC', categoria: 'Servizio', prezzo: '60€/ora', img: '' },
      { nome: 'Saldatura TIG/MIG Certificata', categoria: 'Servizio', prezzo: '45€/ora', img: '' },
      { nome: 'Piegatura Lamiere', categoria: 'Servizio', prezzo: 'Su preventivo', img: '' }
    ];

    for (const item of catalogo) {
      await runQuery(
        `INSERT INTO catalogo (nome, categoria, prezzo_base, immagine) VALUES (?, ?, ?, ?)`,
        [item.nome, item.categoria, item.prezzo, item.img]
      );
    }
    console.log('Catalogo popolato.');

    // 4. Creazione Preventivi
    await runQuery(
      `INSERT INTO preventivi (cliente_id, descrizione, servizio, materiale, dimensioni, finitura, prezzo_proposto, stato_admin, stato_risposta_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        4, 
        'Realizzazione ringhiera per balcone con decorazioni geometriche.', 
        'carpenteria', 
        'Ferro Battuto', 
        '600x110x5', 
        'Verniciatura a polvere nero micaceo', 
        null, 
        'Da valutare', 
        'In attesa'
      ]
    );

    await runQuery(
      `INSERT INTO preventivi (cliente_id, descrizione, servizio, materiale, dimensioni, finitura, prezzo_proposto, stato_admin, stato_risposta_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        5, 
        'Struttura portante per nuovo nastro trasportatore magazzino.', 
        'lavorazioni', 
        'Acciaio INOX 304', 
        '1200x80x150', 
        'Satinatura', 
        4250.00, 
        'Prezzo proposto', 
        'In attesa'
      ]
    );

    await runQuery(
      `INSERT INTO preventivi (cliente_id, descrizione, servizio, materiale, dimensioni, finitura, prezzo_proposto, stato_admin, stato_risposta_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        5, 
        'Sostituzione tubazioni impianto di raffreddamento e staffaggio.', 
        'manutenzione', 
        'Acciaio Zincato', 
        'Variabile', 
        'Grezza', 
        1800.00, 
        'Preventivo concordato', 
        'Accettato'
      ]
    );
    console.log('Preventivi inseriti.');

    // 5. Creazione Interventi (Con logica temporale sensata)
    const oggi = new Date();
    const domani = new Date(oggi); domani.setDate(domani.getDate() + 1);
    const dopodomani = new Date(oggi); dopodomani.setDate(dopodomani.getDate() + 2);
    
    const fmtDomani = domani.toISOString().split('T')[0];
    const fmtDopodomani = dopodomani.toISOString().split('T')[0];

    // Intervento 1: Da valutare (Nuovo)
    await runQuery(
      `INSERT INTO interventi (id, cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_richiesta, data_proposta_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [1, 4, 'Cancello bloccato sui binari, probabile rottura cuscinetti.', 'Viale dell\'Olimpo 12, Palermo', 'Alta', 'Richiesto', 'In attesa', 'Da programmare', fmtDomani]
    );

    // Intervento 2: In attesa di risposta dal cliente
    await runQuery(
      `INSERT INTO interventi (id, cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_richiesta, data_proposta_admin) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [2, 5, 'Manutenzione semestrale silos di stoccaggio.', 'Via Enrico Mattei, Zona Industriale Brancaccio, Palermo', 'Media', 'Data proposta', 'In attesa', 'Da programmare', fmtDopodomani]
    );

    // Intervento 3: Programmato e assegnato a Luigi
    await runQuery(
      `INSERT INTO interventi (id, cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_richiesta, data_accettata) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [3, 5, 'Saldatura tubazione di scarico forata.', 'Zona Industriale Brancaccio, Palermo', 'Alta', 'Intervento concordato', 'Data accettata', 'Programmato', fmtDomani]
    );
    await runQuery(`INSERT INTO dipendenti_interventi (intervento_id, dipendente_id) VALUES (?, ?)`, [3, 2]);

    // Intervento 4: In lavorazione da Marco
    await runQuery(
      `INSERT INTO interventi (id, cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_richiesta, data_accettata) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [4, 4, 'Installazione nuova tettoia in ferro zincato e copertura in policarbonato.', 'Viale della Regione Siciliana 1500, Palermo', 'Media', 'Intervento concordato', 'Data accettata', 'In lavorazione', oggi.toISOString().split('T')[0]]
    );
    await runQuery(`INSERT INTO dipendenti_interventi (intervento_id, dipendente_id) VALUES (?, ?)`, [4, 3]);

    console.log('Interventi e assegnazioni completati.');
    console.log('\n✅ SEEDING COMPLETATO CON SUCCESSO!');
    console.log('Credenziali generate per il test:');
    console.log(' - Admin: admin@metallab.it | Admin123!');
    console.log(' - Dipendente: luigi.ferri@metallab.it | Password123!');
    console.log(' - Cliente: andrea.bianchi@gmail.com | Password123!');

  } catch (error) {
    console.error('Errore durante il seeding:', error);
  } finally {
    db.close();
  }
}

seedDatabase();