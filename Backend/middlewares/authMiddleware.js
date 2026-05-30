const jwt = require('jsonwebtoken');

const SECRET = 'metal-lab-secret-key';

module.exports = (req, res, next) => {
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