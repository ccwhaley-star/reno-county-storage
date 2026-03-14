const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3458;
const BASE_DIR = path.join(__dirname);

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let urlPath = (req.url === '/' ? '/index.html' : req.url).split('?')[0];
  let filePath = path.join(BASE_DIR, urlPath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const notFoundPath = path.join(BASE_DIR, '404.html');
        fs.readFile(notFoundPath, (err404, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(err404 ? '404 Not Found' : content404);
        });
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Reno County Storage dev server running at http://localhost:${PORT}`);
});
