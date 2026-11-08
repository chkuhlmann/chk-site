import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, '.cache/spotify-preview');
const port = Number(process.env.SPOTIFY_PREVIEW_PORT || 8091);
const origin = `http://127.0.0.1:${port}`;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.headers.host !== `127.0.0.1:${port}` || (req.headers.origin && req.headers.origin !== origin) || req.headers['sec-fetch-site'] === 'cross-site') {
    return json(res, 403, { error: 'Use the local preview URL.' });
  }
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
  try {
    const url = new URL(req.url, origin);
    const base = site;
    let relative = decodeURIComponent(url.pathname);
    if (relative.endsWith('/')) relative += 'index.html';
    const candidate = path.resolve(base, `.${relative}`);
    const resolved = await realpath(candidate);
    if (!resolved.startsWith(`${base}${path.sep}`)) return json(res, 403, { error: 'Forbidden.' });
    const data = await readFile(resolved);
    res.writeHead(200, { 'Content-Type': types[path.extname(resolved)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (error) {
    json(res, error.code === 'ENOENT' ? 404 : 500, { error: error.code === 'ENOENT' ? 'Not found.' : 'The preview could not complete that request.' });
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Credits preview: ${origin}/credits-preview/`));
