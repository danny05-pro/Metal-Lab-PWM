const db = require('../database/database');

exports.create = (dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO interventi (cliente_id, descrizione, luogo, priorita, data_richiesta, data_proposta_cliente)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dati.cliente_id, 
        dati.descrizione, 
        dati.luogo, 
        dati.priorita, 
        dati.data_richiesta, 
        dati.data_proposta_cliente
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // this.lastID contiene l'ID appena generato da SQLite
          resolve({ id: this.lastID, ...dati });
        }
      }
    );
  });
};


exports.findByClienteId = (cliente_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM interventi WHERE cliente_id = ? ORDER BY data_richiesta DESC`,
      [cliente_id],
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

exports.findAllForAdmin = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          interventi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM interventi
        JOIN users ON users.id = interventi.cliente_id
        ORDER BY interventi.data_richiesta DESC
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

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT
          interventi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM interventi
        JOIN users ON users.id = interventi.cliente_id
        WHERE interventi.id = ?
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