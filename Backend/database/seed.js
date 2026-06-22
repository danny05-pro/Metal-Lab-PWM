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
      else resolve(this); // Restituisce 'this' per poter leggere this.lastID
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

    // 2. Creazione Utenti
    const defaultPassword = await bcrypt.hash('Password123!', 10);
    const adminPassword = await bcrypt.hash('Admin123!', 10);

    // ADMIN (Reinserito per evitare di perderlo con il reset)
    await runQuery(
      `INSERT INTO users (id, nome, cognome, telefono, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Admin', 'Metal Lab', '0000000000', 'admin@metallab.it', adminPassword, 'admin']
    );

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

    // =========================================================================
    // 4. CREAZIONE PREVENTIVI TEST PER ANDREA BIANCHI (TUTTI I CHIP POSSIBILI)
    // =========================================================================
    const preventiviTest = [
      // Stato 1: Da valutare
      [4, 'Preventivo inviato dal cliente(Da valutare)', 'carpenteria', 'Ferro', '100x100', 'Nessuna', null, 'Da valutare', 'In attesa'],
      // Stato 2: Prezzo Proposto (Richiede azione del cliente)
      [4, 'L\'Admin ha proposto un prezzo (Da accettare o rifiutare)', 'lavorazioni', 'Acciaio', '200x200', 'Satinatura', 500.00, 'Prezzo proposto', 'In attesa'],
      // Stato 3: Preventivo Accettato
      [4, 'Preventivo concordato e accettato', 'manutenzione', 'Alluminio', '50x50', 'Verniciato', 300.00, 'Preventivo concordato', 'Accettato'],
      // Stato 4: Preventivo Rifiutato
      [4, 'Preventivo rifiutato', 'carpenteria', 'Rame', '10x10', 'Grezzo', 1000.00, 'Rifiutato', 'Rifiutato']
    ];

    for (const prev of preventiviTest) {
      await runQuery(
        `INSERT INTO preventivi (cliente_id, descrizione, servizio, materiale, dimensioni, finitura, prezzo_proposto, stato_admin, stato_risposta_cliente) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, prev
      );
    }
    console.log('Preventivi di test inseriti.');

    // =========================================================================
    // 5. CREAZIONE INTERVENTI TEST PER ANDREA BIANCHI (TUTTI I CHIP POSSIBILI)
    // =========================================================================
    const oggi = new Date();
    
    const ieri = new Date(oggi); ieri.setDate(ieri.getDate() - 1);
    const domani = new Date(oggi); domani.setDate(domani.getDate() + 1);
    const dopodomani = new Date(oggi); dopodomani.setDate(dopodomani.getDate() + 2);
    
    const fmtOggi = oggi.toISOString().split('T')[0];
    const fmtIeri = ieri.toISOString().split('T')[0];
    const fmtDomani = domani.toISOString().split('T')[0];
    const fmtDopodomani = dopodomani.toISOString().split('T')[0];

    // Array di interventi [cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_proposta_cliente, data_proposta_admin, data_accettata]
    const interventiTest = [
      // 1. Richiesto
      [4, 'Appena richiesto (In attesa dell\'Admin)', 'Sede 1', 'Bassa', 'Richiesto', 'In attesa', 'Da programmare', null, null, null],
      // 2. Data proposta dall'Admin
      [4, 'Data proposta dall\'Admin (Devi rispondere)', 'Sede 1', 'Media', 'Data proposta', 'In attesa', 'Da programmare', null, fmtDomani, null],
      // 3. Nuova data proposta dal cliente
      [4, 'Hai proposto una nuova data (In attesa dell\'Admin)', 'Sede 1', 'Alta', 'In attesa nuova valutazione', 'Nuova data proposta', 'Da programmare', fmtDopodomani, null, null],
      // 4. Rifiutato
      [4, 'Intervento Rifiutato dall\'Admin', 'Sede 1', 'Bassa', 'Rifiutato', 'In attesa', 'Da programmare', null, null, null],
      // 5. Annullato
      [4, 'Intervento Annullato dal cliente', 'Sede 1', 'Bassa', 'Richiesto', 'Intervento annullato', 'Da programmare', null, null, null],
      // 6. Programmato (Data Accettata) - Assegnato a LUIGI FERRI
      [4, 'Programmato (Tecnico assegnato)', 'Sede 1', 'Alta', 'Intervento concordato', 'Data accettata', 'Programmato', null, null, fmtDomani],
      // 7. In lavorazione - Assegnato a LUIGI FERRI
      [4, 'Lavori in corso (I tecnici sono sul posto)', 'Sede 1', 'Media', 'Intervento concordato', 'Data accettata', 'In lavorazione', null, null, fmtOggi],
      // 8. Terminato - Assegnato a LUIGI FERRI
      [4, 'Lavoro Terminato', 'Sede 1', 'Bassa', 'Intervento concordato', 'Data accettata', 'Terminato', null, null, fmtIeri]
    ];

    for (let i = 0; i < interventiTest.length; i++) {
      const it = interventiTest[i];
      const result = await runQuery(
        `INSERT INTO interventi (cliente_id, descrizione, luogo, priorita, stato_admin, stato_risposta_cliente, stato_lavorazione, data_richiesta, data_proposta_cliente, data_proposta_admin, data_accettata) 
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)`,
        it
      );

      // Assegniamo a Luigi Ferri (ID: 2) gli ultimi 3 interventi (Programmato, In lavorazione, Terminato)
      // In modo che lui veda tutti i suoi 3 chip possibili.
      if (i >= 5) {
        await runQuery(`INSERT INTO dipendenti_interventi (intervento_id, dipendente_id) VALUES (?, ?)`, [result.lastID, 2]);
      }
    }

    console.log('Interventi e assegnazioni completati.');
    console.log('\n✅ SEEDING COMPLETATO CON SUCCESSO!');
    console.log('----------------------------------------------------');
    console.log('PER VEDERE TUTTI I CHIP DEL CLIENTE, ACCEDI CON:');
    console.log(' Email: andrea.bianchi@gmail.com');
    console.log(' Pass:  Password123!');
    console.log('----------------------------------------------------');
    console.log('PER VEDERE I CHIP DEL DIPENDENTE, ACCEDI CON:');
    console.log(' Email: luigi.ferri@metallab.it');
    console.log(' Pass:  Password123!');
    console.log('----------------------------------------------------');
    console.log('PER L\'AMMINISTRAZIONE, ACCEDI CON:');
    console.log(' Email: admin@metallab.it');
    console.log(' Pass:  Admin123!');
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('Errore durante il seeding:', error);
  } finally {
    db.close();
  }
}

seedDatabase();