export class SpotifyError extends Error {
  constructor(message, status = 502) { super(message); this.status = status; }
}

export const normalize = value => value.normalize('NFKD').toLowerCase()
  .replace(/&/g, ' and ').replace(/[\p{M}\p{P}\p{S}]/gu, '').replace(/\s+/g, ' ').trim();

export function artistsMatch(expected, actual) {
  const names = actual.map(artist => normalize(artist.name));
  return expected.every(name => names.includes(normalize(name)));
}

export function matchReleases(group, albums, hasMore = false) {
  const byArtist = [...new Map(albums.filter(album => artistsMatch(group.artists, album.artists || []))
    .map(album => [album.id, album])).values()];
  const exact = byArtist.filter(album => normalize(album.name) === normalize(group.release));
  const compact = value => normalize(value).replace(/\s/g, '');
  const close = byArtist.filter(album => compact(album.name) === compact(group.release));
  const candidates = exact.length ? exact : close;
  return {
    status: exact.length === 1 && !hasMore ? 'matched' : candidates.length ? 'ambiguous' : 'unmatched',
    candidates: candidates.map(album => ({
      id: album.id, title: album.name, artists: album.artists.map(artist => artist.name),
      releaseDate: album.release_date || '', releaseType: album.album_type || '', totalTracks: album.total_tracks,
      image: album.images?.find(image => image.width >= 300)?.url || album.images?.[0]?.url || '',
      url: album.external_urls?.spotify || '',
    })),
  };
}

export function matchTracks(credit, tracks, hasMore = false) {
  const matches = [...new Map(tracks.filter(track => {
    const names = (track.artists || []).map(artist => artist.name);
    return normalize(track.name) === normalize(credit.title) &&
      [...names, names.join(' & ')].some(name => normalize(name) === normalize(credit.artist));
  }).map(track => [track.id, track])).values()];
  return {
    status: matches.length === 1 && !hasMore ? 'matched' : matches.length ? 'ambiguous' : 'unmatched',
    candidates: matches.map(track => ({
      id: track.id, title: track.name,
      album: track.album?.name || '',
      releaseDate: track.album?.release_date || '',
      releaseType: track.album?.album_type || '',
      image: track.album?.images?.find(image => image.width >= 300)?.url || track.album?.images?.[0]?.url || '',
      url: track.external_urls?.spotify || '',
      durationMs: track.duration_ms,
    })),
  };
}

export function createSpotifyClient({ credentials, fetchImpl = fetch, now = Date.now }) {
  let token, expiresAt = 0, cooldown = 0;
  const cache = new Map();
  async function request(url, options) {
    if (now() < cooldown) throw new SpotifyError('Spotify is rate-limiting requests. Try again later.', 429);
    let response;
    try { response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(15000) }); }
    catch { throw new SpotifyError('Spotify could not be reached. Your credits are still available.'); }
    if (response.status === 429) {
      const retrySeconds = Number(response.headers.get('retry-after')) || 60;
      cooldown = now() + Math.max(1, retrySeconds) * 1000;
      throw new SpotifyError(`Spotify request limit reached. Try again in ${Math.ceil(retrySeconds)} seconds.`, 429);
    }
    return response;
  }
  async function accessToken() {
    if (token && now() < expiresAt) return token;
    const { id, secret } = credentials();
    if (!id || !secret) throw new SpotifyError('Add your Client ID and Client Secret to .env.spotify.local, then click Load Spotify details.', 503);
    const response = await request('https://accounts.spotify.com/api/token', {
      method: 'POST', headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }, body: 'grant_type=client_credentials',
    });
    if (!response.ok) throw new SpotifyError('Spotify rejected the app credentials. Check the Client ID, Client Secret, and app status.', 502);
    const data = await response.json();
    if (!data.access_token) throw new SpotifyError('Spotify did not return an access token.');
    token = data.access_token;
    expiresAt = now() + Math.max(0, data.expires_in - 60) * 1000;
    return token;
  }
  async function catalog(query, type) {
    const params = new URLSearchParams({ q: query, type, market: 'US', limit: '10' });
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
      response = await request(`https://api.spotify.com/v1/search?${params}`, { headers: { Authorization: `Bearer ${await accessToken()}` } });
      if (response.status !== 401) break;
      token = undefined;
    }
    if (!response.ok) throw new SpotifyError(response.status === 403
      ? 'Spotify denied catalog access. Check the app status and whether the app owner has Premium.'
      : 'Spotify search failed. Try again later.');
    return response.json();
  }
  return {
    async resolveRelease(group) {
      const key = JSON.stringify(['release-v1', group.artists, group.release]);
      const existing = cache.get(key);
      if (existing && now() - existing.time < 15 * 60 * 1000) return existing.result;
      const clean = value => value.replace(/["\\]/g, ' ');
      const primary = clean(group.artists[0]);
      const title = clean(group.release);
      const data = await catalog(`album:"${title}" artist:"${primary}"`, 'album');
      let result = matchReleases(group, data.albums?.items || [], Boolean(data.albums?.next));
      if (result.status === 'unmatched') {
        const broader = await catalog(`album:"${title}"`, 'album');
        result = matchReleases(group, broader.albums?.items || [], Boolean(broader.albums?.next));
      }
      if (result.status === 'unmatched') {
        const tracks = await catalog(`track:"${clean(group.tracks[0].title)}" artist:"${primary}"`, 'track');
        // Joint singles may list collaborators on the track, but not its release.
        const albums = (tracks.tracks?.items || []).filter(track => artistsMatch(group.artists, track.artists || []))
          .map(track => ({ ...track.album, artists: track.artists }));
        result = matchReleases(group, albums, Boolean(tracks.tracks?.next));
      }
      cache.set(key, { result, time: now() });
      return result;
    },
    async search(credit) {
      const key = JSON.stringify([credit.artist, credit.title]);
      const existing = cache.get(key);
      if (existing && now() - existing.time < 15 * 60 * 1000) return existing.result;
      const clean = value => value.replace(/["\\]/g, ' ');
      const query = new URLSearchParams({ q: `artist:"${clean(credit.artist)}" track:"${clean(credit.title)}"`, type: 'track', market: 'US', limit: '10' });
      let response;
      for (let attempt = 0; attempt < 2; attempt++) {
        response = await request(`https://api.spotify.com/v1/search?${query}`, { headers: { Authorization: `Bearer ${await accessToken()}` } });
        if (response.status !== 401) break;
        token = undefined;
      }
      if (!response.ok) throw new SpotifyError(response.status === 403
        ? 'Spotify denied catalog access. Check the app status and whether the app owner has Premium.'
        : 'Spotify search failed. Try again later.');
      const data = await response.json();
      let result = matchTracks(credit, data.tracks?.items || [], Boolean(data.tracks?.next));
      // Joint artist names may not be indexed as a single Spotify artist field.
      // Broaden retrieval, but keep the same strict artist/title validation.
      if (result.status === 'unmatched') {
        query.set('q', `track:"${clean(credit.title)}"`);
        const fallback = await request(`https://api.spotify.com/v1/search?${query}`, { headers: { Authorization: `Bearer ${await accessToken()}` } });
        if (!fallback.ok) throw new SpotifyError('Spotify search failed. Try again later.');
        const broader = await fallback.json();
        result = matchTracks(credit, broader.tracks?.items || [], Boolean(broader.tracks?.next));
      }
      cache.set(key, { result, time: now() });
      return result;
    },
  };
}
