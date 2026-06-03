const db = require('../database/database');

exports.findAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM catalogo ORDER BY categoria, nome`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.create = (dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO catalogo (nome, categoria, prezzo_base, immagine) VALUES (?, ?, ?, ?)`,
      [dati.nome, dati.categoria, dati.prezzoBase || 'Su preventivo', dati.immagine || ''],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...dati });
      }
    );
  });
};

exports.update = (id, dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE catalogo SET nome = ?, categoria = ?, prezzo_base = ?, immagine = ? WHERE id = ?`,
      [dati.nome, dati.categoria, dati.prezzoBase, dati.immagine, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM catalogo WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};