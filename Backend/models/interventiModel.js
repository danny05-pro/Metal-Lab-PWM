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
        SELECT interventi.*, 
        (SELECT COUNT(*) FROM dipendenti_interventi WHERE intervento_id = interventi.id) AS numero_dipendenti
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
          users.telefono AS cliente_telefono,
          (SELECT COUNT(*) FROM dipendenti_interventi WHERE intervento_id = interventi.id) AS numero_dipendenti
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
          users.telefono AS cliente_telefono,
          (SELECT COUNT(*) FROM dipendenti_interventi WHERE intervento_id = interventi.id) AS numero_dipendenti
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

exports.assegnaDipendente = (intervento_id, dipendente_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT OR IGNORE INTO dipendenti_interventi
        (intervento_id, dipendente_id)
        VALUES (?, ?)
      `,
      [intervento_id, dipendente_id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
};

exports.findDipendentiAssegnati = (intervento_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          users.id,
          users.nome,
          users.cognome,
          users.email,
          users.telefono,
          users.ruolo
        FROM dipendenti_interventi
        JOIN users ON users.id = dipendenti_interventi.dipendente_id
        WHERE dipendenti_interventi.intervento_id = ?
      `,
      [intervento_id],
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

exports.findByDipendenteId = (dipendente_id) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          interventi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM dipendenti_interventi
        JOIN interventi ON interventi.id = dipendenti_interventi.intervento_id
        JOIN users ON users.id = interventi.cliente_id
        WHERE dipendenti_interventi.dipendente_id = ?
        ORDER BY interventi.data_accettata DESC, interventi.data_richiesta DESC
      `,
      [dipendente_id],
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

exports.findByIdForDipendente = (intervento_id, dipendente_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT
          interventi.*,
          users.nome AS cliente_nome,
          users.cognome AS cliente_cognome,
          users.email AS cliente_email,
          users.telefono AS cliente_telefono
        FROM dipendenti_interventi
        JOIN interventi ON interventi.id = dipendenti_interventi.intervento_id
        JOIN users ON users.id = interventi.cliente_id
        WHERE interventi.id = ?
          AND dipendenti_interventi.dipendente_id = ?
      `,
      [intervento_id, dipendente_id],
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

exports.updateStatoLavorazioneForDipendente = (
  intervento_id,
  dipendente_id,
  stato_lavorazione
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE interventi
        SET stato_lavorazione = ?
        WHERE id = ?
          AND id IN (
            SELECT intervento_id
            FROM dipendenti_interventi
            WHERE dipendente_id = ?
          )
      `,
      [
        stato_lavorazione,
        intervento_id,
        dipendente_id
      ],
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

exports.aggiornaDipendentiAssegnati = (intervento_id, dipendente_ids) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(
        `
          DELETE FROM dipendenti_interventi
          WHERE intervento_id = ?
        `,
        [intervento_id],
        (err) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          if (!dipendente_ids || dipendente_ids.length === 0) {
            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                reject(commitErr);
              } else {
                resolve({ changes: 0 });
              }
            });

            return;
          }

          const stmt = db.prepare(
            `
              INSERT INTO dipendenti_interventi
              (intervento_id, dipendente_id)
              VALUES (?, ?)
            `
          );

          for (const dipendente_id of dipendente_ids) {
            stmt.run(intervento_id, dipendente_id);
          }

          stmt.finalize((finalizeErr) => {
            if (finalizeErr) {
              db.run('ROLLBACK');
              return reject(finalizeErr);
            }

            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                reject(commitErr);
              } else {
                resolve({ changes: dipendente_ids.length });
              }
            });
          });
        }
      );
    });
  });
};