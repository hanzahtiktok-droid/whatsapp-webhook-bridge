const http = require('http');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'https://example.com');
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
});

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Server ready');
});
