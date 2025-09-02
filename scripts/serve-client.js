/**
 * Minimal static server so the client runs at http://localhost:8080
 * Usage:
 *   node scripts/serve-client.js src/client 8080
 *   node scripts/serve-client.js dist/client 8080
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const [,, dir='dist/client', portArg='8080'] = process.argv;
const port = Number(portArg) || 8080;
const root = path.resolve(process.cwd(), dir);
const distRoot = path.resolve(process.cwd(), 'dist/client');

const mime = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.css': 'text/css',
  '.map': 'application/json'
};

function send(res, code, headers, body) {
  res.writeHead(code, headers);
  res.end(body);
}

function serveFile(res, absPath, typeHint) {
  fs.readFile(absPath, (err, data) => {
    if (err) return send(res, 404, {'Content-Type': 'text/plain'}, 'Not found');
    const type = typeHint || mime[path.extname(absPath)] || 'application/octet-stream';
    send(res, 200, {'Content-Type': type}, data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url || '/');
  let pathname = decodeURIComponent(parsed.pathname || '/');


  if (pathname === '/proxy') {
    const q = new URLSearchParams(parsed.query || '');
    const target = q.get('u');
    if (!target) return send(res, 400, {'Content-Type':'text/plain'}, 'Missing u');
    try {
      const r = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) return send(res, r.status, {'Content-Type':'text/plain'}, `Upstream ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      const ct = r.headers.get('content-type') || 'image/jpeg';
      return send(res, 200, {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }, buf);
    } catch {
      return send(res, 502, {'Content-Type':'text/plain'}, 'Proxy fetch failed');
    }
  }


  if (pathname === '/app.js' || pathname === '/hash.js') {
    const distPath = path.join(distRoot, pathname.slice(1));
    return serveFile(res, distPath, 'application/javascript; charset=UTF-8');
  }


  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    return send(res, 403, {'Content-Type':'text/plain'}, 'Forbidden');
  }
  serveFile(res, filePath);
});

server.listen(port, () => {
  console.log(`Client Application URL http://localhost:${port}`);
});