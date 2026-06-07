const http = require('http');

const VERIFY_TOKEN = 'SID9019';

http.createServer(function(req, res) {
  const q = new URL(req.url, 'http://localhost');
  const mode = q.searchParams.get('hub.mode');
  const token = q.searchParams.get('hub.verify_token');
  const challenge = q.searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.writeHead(200);
      res.end(challenge);
    } else {
      res.writeHead(403);
      res.end('Forbidden');
    }
  } else {
    res.writeHead(200);
    res.end('OK');
  }
}).listen(process.env.PORT || 3000);
