import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('dist');
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const resolveFilePath = (pathname) => {
  if (pathname.endsWith('/')) {
    return path.join(root, pathname, 'index.html');
  }
  return path.join(root, pathname);
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(res);
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = resolveFilePath(pathname.slice(1));

  try {
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      await stat(filePath);
    }
    sendFile(res, filePath);
  } catch (error) {
    const fallbackPath = path.join(root, 'index.html');
    try {
      await stat(fallbackPath);
      sendFile(res, fallbackPath);
    } catch (fallbackError) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }
});

server.listen(port, () => {
  console.log(`Preview server available at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop.');
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
