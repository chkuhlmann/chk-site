const normalize = value => value.normalize('NFKD').toLowerCase()
  .replace(/&/g, ' and ').replace(/[\p{M}\p{P}\p{S}]/gu, '').replace(/\s+/g, ' ').trim();
const artistsFrom = value => value.split('|').map(name => name.trim()).filter(Boolean);

function groupReleases(source) {
  const [headers, ...rows] = source.values;
  for (const name of ['Artist', 'Track', 'Service', 'Release']) {
    if (!headers.includes(name)) throw new Error(`Credits sheet is missing ${name}`);
  }
  const groups = new Map();
  rows.forEach((cells, index) => {
    if (!cells.some(Boolean)) return;
    const row = Object.fromEntries(headers.map((name, column) => [name, (cells[column] || '').trim()]));
    if (!row.Artist || !row.Track) throw new Error(`Credits sheet row ${index + 2} needs an artist and track`);
    const artists = artistsFrom(row.Artist);
    let release = row.Release || row.Track;
    // User-confirmed correction; do not rewrite the source Sheet.
    if (normalize(row.Artist) === 'mercury' && normalize(row.Track) === 'i dont know you like i used to'
      && normalize(release) === 'fifth year') release = row.Track;
    const key = JSON.stringify([artists.map(normalize).sort(), normalize(release)]);
    if (!groups.has(key)) groups.set(key, { key, artists, artist: artists.join(' & '), release, tracks: [], roles: [] });
    const group = groups.get(key);
    const roles = row.Service.split(',').map(role => role.trim()).filter(Boolean);
    group.tracks.push({ title: row.Track, role: row.Service, row: index + 2 });
    for (const role of roles) if (!group.roles.includes(role)) group.roles.push(role);
  });
  return [...groups.values()].reverse().map((group, index) => ({ ...group, index }));
}

module.exports = { normalize, artistsFrom, groupReleases };
