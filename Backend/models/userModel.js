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



exports.findByRole = (ruolo) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, nome, cognome, telefono, email, ruolo FROM users WHERE ruolo = ?`,
      [ruolo],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
// la funzione update riguarda solamente la modifica del profilo dipendente non l'inserimento.
// la funzione update riguarda la modifica del profilo, ora include anche il telefono.
exports.update = (id, dati) => {
  return new Promise((resolve, reject) => {

    if (dati.password) {
      db.run(
        `UPDATE users SET nome = ?, cognome = ?, telefono = ?, email = ?, password = ? WHERE id = ?`,
        [dati.nome, dati.cognome, dati.telefono, dati.email, dati.password, id],
        (err) => err ? reject(err) : resolve()
      );
    } else {
      db.run(
        `UPDATE users SET nome = ?, cognome = ?, telefono = ?, email = ? WHERE id = ?`,
        [dati.nome, dati.cognome, dati.telefono, dati.email, id],
        (err) => err ? reject(err) : resolve()
      );
    }
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM users WHERE id = ?`, 
      [id], 
      (err) => err ? reject(err) : resolve()
    );
  });
};