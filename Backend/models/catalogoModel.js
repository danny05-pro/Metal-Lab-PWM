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

exports.addPreferito = (userId, catalogoId) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT OR IGNORE INTO preferiti (user_id, catalogo_id) VALUES (?, ?)`, [userId, catalogoId], function (err) {
      if (err) reject(err); else resolve(this.changes);
    });
  });
};

exports.removePreferito = (userId, catalogoId) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM preferiti WHERE user_id = ? AND catalogo_id = ?`, [userId, catalogoId], function (err) {
      if (err) reject(err); else resolve(this.changes);
    });
  });
};

exports.getPreferitiUtente = (userId) => {
  return new Promise((resolve, reject) => {
    // Restituisce solo un array di ID per facilitare il frontend
    db.all(`SELECT catalogo_id FROM preferiti WHERE user_id = ?`, [userId], (err, rows) => {
      if (err) reject(err); else resolve(rows.map(r => r.catalogo_id));
    });
  });
};