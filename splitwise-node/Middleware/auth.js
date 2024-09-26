const { verify } = require('../Helper/jwtHelper');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Assuming the token is in the form "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = verify(token, "some secret");
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;