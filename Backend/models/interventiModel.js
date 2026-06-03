const db = require('../database/database');

exports.create = (dati) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO interventi
        (cliente_id, descrizione, luogo, priorita, data_richiesta, data_proposta_cliente)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
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
          resolve({
            id: this.lastID,
            ...dati
          });
        }
      }
    );
  });
};

exports.findByClienteId = (cliente_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT *
        FROM interventi
        WHERE cliente_id = ?
        ORDER BY data_richiesta DESC
      `,
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

exports.adminProponeData = (id, data_proposta_admin) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_admin = 'Data proposta',
          stato_risposta_cliente = 'In attesa',
          data_proposta_admin = ?
        WHERE id = ?
      `,
      [data_proposta_admin, id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};

exports.adminAccettaDataCliente = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_admin = 'Data proposta',
          stato_risposta_cliente = 'In attesa',
          data_proposta_admin = data_proposta_cliente
        WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};

exports.adminRifiutaIntervento = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_admin = 'Rifiutato'
        WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};

exports.clienteAccettaData = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_admin = 'Intervento concordato',
          stato_risposta_cliente = 'Data accettata',
          data_accettata = data_proposta_admin,
          stato_lavorazione = 'Programmato'
        WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};

exports.clienteProponeNuovaData = (id, nuova_data) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_admin = 'In attesa nuova valutazione',
          stato_risposta_cliente = 'Nuova data proposta',
          data_proposta_cliente = ?
        WHERE id = ?
      `,
      [nuova_data, id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};

exports.clienteAnnullaIntervento = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET
          stato_risposta_cliente = 'Intervento annullato'
        WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            changes: this.changes
          });
        }
      }
    );
  });
};