const db = require('../database/database');

exports.create = (utente) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO users
        (nome, cognome, telefono, email, password, ruolo)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        utente.nome,
        utente.cognome,
        utente.telefono,
        utente.email,
        utente.password,
        utente.ruolo
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nome: utente.nome,
            cognome: utente.cognome,
            telefono: utente.telefono,
            email: utente.email,
            ruolo: utente.ruolo
          });
        }
      }
    );
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM users
        WHERE email = ?
      `,
      [email],
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

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT id, nome, cognome, telefono, email, ruolo
        FROM users
        WHERE id = ?
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