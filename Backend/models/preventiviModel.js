const db = require('../database/database');

exports.create = (dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO preventivi (cliente_id, descrizione, servizio, materiale, dimensioni, finitura, allegato)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dati.cliente_id, dati.descrizione, dati.servizio, dati.materiale, dati.dimensioni, dati.finitura, dati.allegato],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...dati });
      }
    );
  });
};



exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM preventivi WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

exports.findByClienteId = (cliente_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM preventivi WHERE cliente_id = ? ORDER BY id DESC`,
      [cliente_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};



exports.findAllForAdmin = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          preventivi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM preventivi
        JOIN users ON users.id = preventivi.cliente_id
        ORDER BY preventivi.id DESC
      `,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};


exports.findByIdForAdmin = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT
          preventivi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM preventivi
        JOIN users ON users.id = preventivi.cliente_id
        WHERE preventivi.id = ?
      `,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};


// L'admin propone un prezzo al cliente
exports.adminProponePrezzo = (id, prezzo) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE preventivi 
       SET stato_admin = 'Prezzo proposto', 
           stato_risposta_cliente = 'In attesa', 
           prezzo_proposto = ? 
       WHERE id = ?`,
      [prezzo, id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// L'admin rifiuta definitivamente la richiesta di preventivo
exports.adminRifiutaPreventivo = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE preventivi 
       SET stato_admin = 'Rifiutato', 
           stato_risposta_cliente = 'Rifiutato', 
           prezzo_proposto = NULL 
       WHERE id = ?`,
      [id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Il cliente risponde al preventivo (accetta o rifiuta)
exports.clienteRisponde = (id, statoCliente, statoAdmin) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE preventivi 
       SET stato_risposta_cliente = ?, stato_admin = ?
       WHERE id = ?`,
      [statoCliente, statoAdmin, id],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};