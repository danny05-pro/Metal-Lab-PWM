const jwt = require('jsonwebtoken');

const SECRET = 'metal-lab-secret-key';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token mancante'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token non fornito'
    });
  }

  try {
    const verified = jwt.verify(token, SECRET);

    req.user = verified;

    next();

  } catch (error) {
    return res.status(403).json({
      message: 'Token non valido'
    });
  }
};

const isAdmin = (req, res, next) => {
  // Il token (spacchettato da verifyToken) contiene il ruolo. Controlliamo se è admin.
  if (req.user && req.user.ruolo === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Accesso negato: area riservata agli amministratori.'
    });
  }
};


module.exports = {
  verifyToken,
  isAdmin
};