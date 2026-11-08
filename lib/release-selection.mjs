function validUrl(value, hostname) {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === hostname; }
  catch { return false; }
}

export function selectRelease(candidates) {
  return candidates.filter(release => release.id && release.title && release.artists?.length &&
    /^\d{4}(-\d{2}){0,2}$/.test(release.releaseDate) &&
    validUrl(release.url, 'open.spotify.com') && validUrl(release.image, 'i.scdn.co'))
    .sort((a,b) => Number(b.releaseType === 'album') - Number(a.releaseType === 'album') ||
      a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id))[0] || null;
}

export async function collectReleases(groups, resolve, report = () => {}) {
  const albums = new Map();
  const missing = [];
  for (const group of groups) {
    const result = await resolve(group);
    const release = selectRelease(result.candidates);
    report(group, Boolean(release));
    if (!release) { missing.push(`${group.artist} — ${group.release}`); continue; }
    if (!albums.has(release.id)) albums.set(release.id, {...release,roles:[],tracks:[]});
    const album = albums.get(release.id);
    for (const role of group.roles) if (!album.roles.includes(role)) album.roles.push(role);
    for (const {title,role} of group.tracks) {
      if (!album.tracks.some(track=>track.title===title&&track.role===role)) album.tracks.push({title,role});
    }
  }
  if (!albums.size) throw new Error('No releases resolved. Keeping the previous snapshot and stopping deployment.');
  return { releases:[...albums.values()].sort((a,b)=>b.releaseDate.localeCompare(a.releaseDate)||a.title.localeCompare(b.title)), missing };
}
