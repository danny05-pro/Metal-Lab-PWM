const db = require('../database/database');

exports.create = (dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO interventi (cliente_id, descrizione, luogo, priorita, data_richiesta, data_preferita)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dati.cliente_id, 
        dati.descrizione, 
        dati.luogo, 
        dati.priorita, 
        dati.data_richiesta, 
        dati.data_preferita
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