  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');

  const User = require('../models/userModel');

  const SECRET = 'metal-lab-secret-key';

  function emailValida(email) {
    return /^[a-zA-Z][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function passwordValida(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password);
  }

  function emailConsentita(email) {
    const emailLower = email.toLowerCase();
    return (
      !emailLower.includes('admin') &&
      !emailLower.includes('dipendente')
    );
  }

  exports.register = async (req, res) => {
    try {
      const {
        nome,
        cognome,
        telefono,
        email,
        password
      } = req.body;

      if (!nome || !cognome || !telefono || !email || !password) {
        return res.status(400).json({
          message: 'Tutti i campi sono obbligatori'
        });
      }

      if (!emailValida(email)) {
        return res.status(400).json({
          message: 'Email non valida'
        });
      }

      if (!emailConsentita(email)) {
        return res.status(400).json({
          message: 'Email non consentita'
        });
      }

      if (!passwordValida(password)) {
        return res.status(400).json({
          message: 'La password deve contenere almeno una maiuscola, una minuscola, un numero, un carattere speciale e 6 caratteri totali'
        });
      }

      const utenteEsistente = await User.findByEmail(email);

      if (utenteEsistente) {
        return res.status(409).json({
          message: 'Email già registrata'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const nuovoUtente = await User.create({
        nome,
        cognome,
        telefono,
        email,
        password: passwordHash,
        ruolo: 'cliente'
      });

      return res.status(201).json({
        message: 'Registrazione completata',
        user: nuovoUtente
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Errore durante la registrazione',
        error: error.message
      });
    }
  };

  exports.login = async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email e password sono obbligatorie'
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: 'Credenziali non valide'
        });
      }

      const passwordCorretta = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordCorretta) {
        return res.status(401).json({
          message: 'Credenziali non valide'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          ruolo: user.ruolo
        },
        SECRET,
        {
          expiresIn: '1h'
        }
      );

      return res.json({
        message: 'Login effettuato',
        token,
        user: {
          id: user.id,
          nome: user.nome,
          cognome: user.cognome,
          telefono: user.telefono,
          email: user.email,
          ruolo: user.ruolo
        }
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Errore durante il login',
        error: error.message
      });
    }
  };

  exports.profile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'Utente non trovato'
        });
      }

      return res.json(user);

    } catch (error) {
      return res.status(500).json({
        message: 'Errore durante il recupero profilo',
        error: error.message
      });
    }
  };