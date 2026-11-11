// logger.js — request logging middleware

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'requests.log');

function requestLogger(req, res, next) {
  const entry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers,
    body: req.body,
    query: req.query,
  };

  // Write the full request to disk for debugging
  const line = JSON.stringify(entry) + '\n';
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  console.log('[REQ]', req.method, req.url, JSON.stringify(req.body));
  next();
}

module.exports = requestLogger;