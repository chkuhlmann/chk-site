import test from 'node:test';
import assert from 'node:assert/strict';
import { matchTracks, createSpotifyClient, artistsMatch, matchReleases } from './spotify-client.mjs';
import { fetchPublishedSheet, parseCsv, publishedCsvUrl } from './google-sheet.mjs';
import { groupReleases } from '../experiments/spotify-credits/release-groups.cjs';
import { readFileSync } from 'node:fs';
import { selectRelease, collectReleases } from '../lib/release-selection.mjs';
const credit = { artist: 'Mary Malu', title: "You're The One I Want" };
const track = { id: 'a', name: 'You’re The One I Want', artists: [{ name: 'Mary Malu' }], album: { name: 'Release', release_date: '2024', images: [] }, external_urls: { spotify: 'https://open.spotify.com/track/a' } };
test('parses published sheet CSV including quoted commas, quotes, and line breaks', () => {
  assert.deepEqual(parseCsv('Artist,Track,Service,Release\r\n"A, B","A ""quoted"" song","Mixing\nProduction",Record\r\n'), [
    ['Artist', 'Track', 'Service', 'Release'],
    ['A, B', 'A "quoted" song', 'Mixing\nProduction', 'Record'],
  ]);
});
test('fetches the configured read-only Sheet tab and validates its credit columns', async () => {
  const config = { spreadsheetId: 'sheet-id', sheetName: 'Credits & Mixes' };
  const url = new URL(publishedCsvUrl(config));
  assert.equal(url.searchParams.get('sheet'), config.sheetName);
  assert.equal(url.searchParams.get('tqx'), 'out:csv');
  assert.equal(publishedCsvUrl(config, 'https://docs.google.com/spreadsheets/d/e/published-id/pub?output=csv'),
    'https://docs.google.com/spreadsheets/d/e/published-id/pub?output=csv');
  assert.throws(() => publishedCsvUrl(config, 'https://example.com/credits.csv'), /Google Sheets CSV publish URL/);
  const source = await fetchPublishedSheet(config, async () => new Response(
    'Artist,Track,Service,Release\nArtist,Song,Mixing,Record\n',
    { headers: { 'Content-Type': 'text/csv' } }
  ));
  assert.deepEqual(source.values[1], ['Artist', 'Song', 'Mixing', 'Record']);
  await assert.rejects(fetchPublishedSheet(config, async () => new Response('', { status: 401 })), /HTTP 401/);
});
test('matches punctuation differences but rejects other artists and versions', () => {
  assert.equal(matchTracks(credit, [track]).status, 'matched');
  assert.equal(matchTracks(credit, [{ ...track, name: `${track.name} - Live` }]).status, 'unmatched');
  assert.equal(matchTracks(credit, [{ ...track, artists: [{ name: 'Someone Else' }] }]).status, 'unmatched');
});
test('does not silently choose among releases or truncated search results', () => {
  assert.equal(matchTracks(credit, [track, { ...track, id: 'b' }]).status, 'ambiguous');
  assert.equal(matchTracks(credit, [track], true).status, 'ambiguous');
  assert.equal(matchTracks(credit, [track, track]).candidates.length, 1);
});
test('matches a compound collaborator listing without requiring links', () => {
  assert.equal(matchTracks({ artist: 'book NOT brooke & Venus & the Flytraps', title: 'Song' }, [{ ...track, name: 'Song', artists: [{ name: 'book NOT brooke' }, { name: 'Venus & the Flytraps' }] }]).status, 'matched');
});
test('renews rejected token and caches results without exposing credentials', async () => {
  const calls = [];
  const responses = [
    new Response(JSON.stringify({ access_token: 'old', expires_in: 3600 })),
    new Response('', { status: 401 }),
    new Response(JSON.stringify({ access_token: 'new', expires_in: 3600 })),
    new Response(JSON.stringify({ tracks: { items: [track], next: null } })),
  ];
  const client = createSpotifyClient({ credentials: () => ({ id: 'id', secret: 'secret' }), fetchImpl: async (url, options) => { calls.push({ url, options }); return responses.shift(); } });
  assert.equal((await client.search(credit)).status, 'matched');
  await client.search(credit);
  assert.equal(calls.length, 4);
  assert.equal(calls[3].options.headers.Authorization, 'Bearer new');
  assert.match(calls[3].url, /market=US/);
});
test('honors rate-limit cooldown instead of retrying immediately', async () => {
  let calls = 0;
  const client = createSpotifyClient({ credentials: () => ({ id: 'id', secret: 'secret' }), fetchImpl: async () => { calls++; return new Response('', { status: 429, headers: { 'retry-after': '120' } }); } });
  await assert.rejects(client.search(credit), /120 seconds/);
  await assert.rejects(client.search(credit), /rate-limiting/);
  assert.equal(calls, 1);
});
test('broadens an empty search without accepting a different artist', async () => {
  const responses = [
    new Response(JSON.stringify({ access_token: 'token', expires_in: 3600 })),
    new Response(JSON.stringify({ tracks: { items: [], next: null } })),
    new Response(JSON.stringify({ tracks: { items: [{ ...track, artists: [{ name: 'Different Artist' }] }], next: null } })),
  ];
  const client = createSpotifyClient({ credentials: () => ({ id: 'id', secret: 'secret' }), fetchImpl: async () => responses.shift() });
  assert.equal((await client.search(credit)).status, 'unmatched');
});
test('collaboration matching ignores order and preserves ampersands inside artist names', () => {
  const names = ['book NOT brooke', 'Venus & the Flytraps'];
  assert.equal(artistsMatch(names, [{name:'Venus and the Flytraps'},{name:'book NOT brooke'}]), true);
  assert.equal(artistsMatch(names, [{name:'book NOT brooke'}]), false);
});
test('release matches never silently accept a deluxe edition or another artist', () => {
  const group = {artists:['book NOT brooke'],release:'Dancer First'};
  const album = {id:'a',name:'Dancer First',artists:[{name:'book NOT brooke'}]};
  assert.equal(matchReleases(group,[album]).status,'matched');
  assert.equal(matchReleases(group,[{...album,name:'Dancer First (Deluxe)'}]).status,'unmatched');
  assert.equal(matchReleases(group,[{...album,artists:[{name:'Someone Else'}]}]).status,'unmatched');
  assert.equal(matchReleases(group,[album,{...album,id:'b'}]).status,'ambiguous');
});
test('copied sheet groups 78 credits into 23 releases and preserves separate singles', () => {
  const source = JSON.parse(readFileSync(new URL('../experiments/spotify-credits/source-sheet.json',import.meta.url)));
  const groups = groupReleases(source);
  assert.equal(groups.length,23);
  assert.equal(groups.reduce((n,g)=>n+g.tracks.length,0),78);
  assert.equal(groups.find(g=>g.release==='Dancer First').tracks.length,11);
  assert.equal(groups.filter(g=>g.artist==='Henry J. Star').length,1);
  assert.equal(groups.filter(g=>g.artist==='mercury').length,2);
  assert.equal(groups.find(g=>g.release==='Ctrl Alt CHERRY Delete').artists.length,2);
  assert.equal(groups.some(g=>g.artist==='mercury'&&g.release==='Fifth Year'),false);
});
test('album grouping uses artists as well as titles and retains per-track roles', () => {
  const groups=groupReleases({values:[['Artist','Track','Service','Release'],['A','First','Mixing','Record'],['A','Second','Production','record'],['B','Third','Mastering','Record']]});
  assert.equal(groups.length,2);
  const a=groups.find(g=>g.artist==='A');
  assert.deepEqual(a.roles,['Mixing','Production']);
  assert.equal(a.tracks[0].role,'Mixing');
});
test('joint release fallback verifies collaborators on track metadata', async () => {
  const artists=[{name:'Venus & the Flytraps'},{name:'book NOT brooke'}];
  const album={id:'joint',name:'Ctrl Alt CHERRY Delete',artists:[artists[1]],images:[],external_urls:{spotify:'https://open.spotify.com/album/joint'}};
  const responses=[
    new Response(JSON.stringify({access_token:'token',expires_in:3600})),
    new Response(JSON.stringify({albums:{items:[album],next:null}})),
    new Response(JSON.stringify({albums:{items:[album],next:null}})),
    new Response(JSON.stringify({tracks:{items:[{name:album.name,album,artists}],next:null}})),
  ];
  const client=createSpotifyClient({credentials:()=>({id:'id',secret:'secret'}),fetchImpl:async()=>responses.shift()});
  const result=await client.resolveRelease({artists:['book NOT brooke','Venus & the Flytraps'],release:album.name,tracks:[{title:album.name}]});
  assert.equal(result.status,'matched');
  assert.equal(result.candidates[0].id,'joint');
});
const releaseFixture = {id:'album-a',title:'Record',artists:['Artist'],releaseDate:'2024-01-02',releaseType:'album',
  image:'https://i.scdn.co/image/art',url:'https://open.spotify.com/album/album-a'};
test('automatic selection prefers a full album, then the earliest matching edition', () => {
  const single={...releaseFixture,id:'single',releaseType:'single',releaseDate:'2023-01-01'};
  const reissue={...releaseFixture,id:'reissue',releaseDate:'2025-01-01'};
  assert.equal(selectRelease([single,reissue,releaseFixture]).id,'album-a');
  assert.equal(selectRelease([{...releaseFixture,image:'javascript:alert(1)'}]),null);
});
test('sync merges shared releases, preserves roles, and omits unavailable rows', async () => {
  const makeGroup=(title,role)=>({artist:'Artist',release:title,roles:[role],tracks:[{title,role}]});
  const groups=[makeGroup('One','Mixing'),makeGroup('Two','Production'),makeGroup('Unavailable','Mastering')];
  const result=await collectReleases(groups,async group=>({candidates:group.release==='Unavailable'?[]:[releaseFixture]}));
  assert.equal(result.releases.length,1);
  assert.deepEqual(result.releases[0].roles,['Mixing','Production']);
  assert.equal(result.releases[0].tracks.length,2);
  assert.equal(result.missing.length,1);
  assert.equal(groups.length,3);
});
test('sync stops for authentication failures and an entirely unmatched catalog', async () => {
  const groups=[{artist:'Artist',release:'Record',roles:[],tracks:[]}];
  await assert.rejects(collectReleases(groups,async()=>{throw new Error('Authentication failed');}),/Authentication failed/);
  await assert.rejects(collectReleases(groups,async()=>({candidates:[]})),/Keeping the previous snapshot/);
});
