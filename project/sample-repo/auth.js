// auth.js — admin authentication

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'SuperSecret123!';

function isAdmin(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function requireAdmin(req, res, next) {
  const { username, password } = req.headers;
  if (isAdmin(username, password)) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

module.exports = { isAdmin, requireAdmin, ADMIN_USERNAME, ADMIN_PASSWORD };