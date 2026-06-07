const http = require('http');
const https = require('https');
const url = require('url');

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/ui5pmo9u1vmr2b41tsntmyb6v1vqy3ev';
const VERIFY_TOKEN = 'SID9019';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const mode = parsed.query['hub.mode'];
  const token = parsed.query['hub.verify_token'];
  const challenge = parsed.query['hub.challenge'];

  if (req.method === 'GET' && mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.writeHead(200);
    res.end(challenge);
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const makeReq = https.request(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      makeReq.write(body);
      makeReq.end();
      res.writeHead(200);
      res.end('OK');
    });
    return;
  }

  res.writeHead(200);
  res.end('OK');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Running on port ' + PORT));
