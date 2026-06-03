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