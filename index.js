const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'https://example.com');

  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token === 'SID9019') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(challenge);
    } else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('OK');
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const makeUrl = process.env.MAKE_WEBHOOK_URL;
      const parsed = new URL(makeUrl);
      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      };
      const proxyReq = https.request(options, (proxyRes) => {});
      proxyReq.write(body);
      proxyReq.end();
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('OK');
    });
  }
});

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Server ready');
});
