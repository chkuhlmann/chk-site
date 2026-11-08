import { readFile, writeFile, rename } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { fetchPublishedSheet } from './google-sheet.mjs';
import { groupReleases } from '../lib/release-groups.cjs';
import { createSpotifyClient } from './spotify-client.mjs';
import { collectReleases } from '../lib/release-selection.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const args = new Set(process.argv.slice(2));
let local = {};
if (!process.env.CI) {
  try { local = parseEnv(await readFile(path.join(root, '.env.spotify.local'), 'utf8')); } catch {}
}
const id = process.env.SPOTIFY_CLIENT_ID || local.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET || local.SPOTIFY_CLIENT_SECRET;

try {
  if (!id || !secret) throw new Error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before syncing releases.');
  const config = await readJson('config/credits-source.json');
  const source = args.has('--snapshot') ? await readJson('data/credits-sheet.json') : await fetchPublishedSheet(config);
  const groups = groupReleases(source);
  const spotify = createSpotifyClient({ credentials: () => ({id,secret}) });
  const {releases,missing} = await collectReleases(groups, group=>spotify.resolveRelease(group),
    (group,matched)=>console.log(`${group.artist} — ${group.release}: ${matched ? 'matched' : 'unavailable'}`));
  if (missing.length) console.warn(`Omitted unavailable releases (rows retained in Sheet): ${missing.join('; ')}`);
  const destination = path.join(root, 'src/_data/releases.json');
  await writeFile(`${destination}.tmp`, `${JSON.stringify(releases,null,2)}\n`);
  await rename(`${destination}.tmp`, destination);
  if (!args.has('--snapshot')) await writeFile(path.join(root,'data/credits-sheet.json'),`${JSON.stringify(source,null,2)}\n`);
  console.log(`Synced ${groups.reduce((n,g)=>n+g.tracks.length,0)} song credits into ${releases.length} releases.`);
} catch(error) {
  console.error(error.message);
  process.exitCode=1;
}
