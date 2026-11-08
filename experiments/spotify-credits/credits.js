(() => {
  let groups = JSON.parse(document.querySelector('#showcase-data').textContent);
  let cards = [...document.querySelectorAll('.release-card')];
  const grid = document.querySelector('#release-grid');
  const review = document.querySelector('#release-review');
  const panel = document.querySelector('#review-panel');
  const button = document.querySelector('#load-spotify');
  const status = document.querySelector('#spotify-status');
  const sheetStatus = document.querySelector('#sheet-status');
  const albums = new Map();
  let cursor = 0;
  let selections = {};
  const storageKey = 'chk-showcase-selections-v1';
  try { selections = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  const spotifyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.1-10.55-1.14a.75.75 0 0 1-.34-1.46c4.58-1.05 8.51-.61 11.67 1.32a.75.75 0 0 1 .25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.22-1.98-8.13-2.56-11.94-1.4a.94.94 0 0 1-.55-1.8c4.36-1.32 9.77-.68 13.47 1.6a.94.94 0 0 1 .31 1.29zm.13-3.4C15.24 8.34 8.87 8.13 5.18 9.25a1.13 1.13 0 0 1-.65-2.16c4.24-1.28 11.28-1.03 15.72 1.6a1.13 1.13 0 0 1-1.15 1.94z"/></svg>';
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function makeCard(group) {
    const card = element('article', '', 'release-card');
    card.dataset.index = group.index;
    const cover = element('div', '', 'release-cover');
    cover.append(element('span', String(group.index + 1), 'cover-placeholder'));
    const caption = element('div', '', 'release-caption');
    caption.append(
      element('p', group.artist, 'release-artist'),
      element('h2', group.release),
      element('p', 'Release details pending', 'release-date'),
      element('p', group.roles.join(' · '), 'release-role')
    );
    const details = element('details', '', 'track-credits');
    details.append(element('summary', `Credits · ${group.tracks.length} ${group.tracks.length === 1 ? 'track' : 'tracks'}`));
    const list = element('ul');
    for (const track of group.tracks) {
      const item = element('li');
      item.append(element('strong', track.title), element('span', track.role));
      list.append(item);
    }
    details.append(list);
    caption.append(details, element('div', '', 'release-link'));
    card.append(cover, caption);
    return card;
  }
  async function refreshCredits() {
    const response = await fetch('/api/credits', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not refresh the live credits Sheet.');
    if (!Array.isArray(result.showcase) || !result.showcase.length) {
      throw new Error('The live credits Sheet did not return any releases.');
    }
    groups = result.showcase;
    cards = groups.map(makeCard);
    albums.clear();
    review.replaceChildren();
    grid.replaceChildren(...cards);
    const trackCount = groups.reduce((count, group) => count + group.tracks.length, 0);
    document.querySelector('#release-count').textContent = `${groups.length} releases · ${trackCount} song credits`;
    sheetStatus.textContent = 'Live credits loaded from Google Sheets.';
  }
  function safeUrl(value, hostname) {
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === hostname ? url.href : ''; }
    catch { return ''; }
  }
  function link(url, label) {
    const node = element('a', label); node.href = url;
    node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
  }
  function dateText(date) {
    if (/^\d{4}$/.test(date)) return date;
    if (/^\d{4}-\d{2}$/.test(date)) return new Intl.DateTimeFormat('en-US', {month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}-01T00:00:00Z`));
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`));
    return 'Date unavailable';
  }
  function dateKey(date) { return /^\d{4}(-\d{2}){0,2}$/.test(date) ? `${date}-01-01`.slice(0,10) : ''; }
  function updateCounts() {
    document.querySelector('#release-count').textContent = `${albums.size} releases · ${groups.reduce((n,g)=>n+g.tracks.length,0)} song credits`;
    panel.hidden = !review.children.length;
    document.querySelector('#review-count').textContent = `${review.children.length} ${review.children.length === 1 ? 'release' : 'releases'} to review`;
  }
  function sortGrid() {
    [...grid.children].sort((a,b) => (b.dataset.date || '').localeCompare(a.dataset.date || '') || Number(a.dataset.index)-Number(b.dataset.index)).forEach(card => grid.append(card));
  }
  function selectionKey(group) { return JSON.stringify([group.key, group.tracks]); }
  function display(index, release) {
    const url = safeUrl(release.url, 'open.spotify.com');
    if (!url) throw new Error('Spotify returned an invalid release link.');
    let card = cards[index];
    const reviewEntry = card.closest('.review-entry');
    if (reviewEntry) { grid.append(card); reviewEntry.remove(); }
    const existing = albums.get(release.id);
    if (existing) {
      existing.indexes.add(index);
      if (existing.card !== card) card.remove();
      card = existing.card;
    } else {
      albums.set(release.id, {card, indexes:new Set([index])});
    }
    const indices = [...albums.get(release.id).indexes];
    const combined = indices.map(i=>groups[i]);
    const roles = [...new Set(combined.flatMap(group=>group.roles))];
    const tracks = combined.flatMap(group=>group.tracks);
    card.querySelector('h2').textContent = release.title;
    card.querySelector('.release-artist').textContent = release.artists.join(' & ');
    card.querySelector('.release-date').textContent = dateText(release.releaseDate);
    card.querySelector('.release-role').textContent = roles.join(' · ');
    card.dataset.date = dateKey(release.releaseDate);
    card.dataset.album = release.id;
    const creditDetails = card.querySelector('.track-credits');
    creditDetails.querySelector('summary').textContent = `Credits · ${tracks.length} ${tracks.length===1?'track':'tracks'}`;
    const list = creditDetails.querySelector('ul'); list.replaceChildren();
    for (const track of tracks) {
      const item = element('li'); item.append(element('strong',track.title), element('span',track.role)); list.append(item);
    }
    const imageUrl = safeUrl(release.image, 'i.scdn.co');
    if (imageUrl) {
      const image = element('img'); image.src=imageUrl; image.alt=`${release.title} cover`;
      image.width=640; image.height=640; image.loading='lazy';
      const coverLink = link(url,''); coverLink.append(image);
      card.querySelector('.release-cover').replaceChildren(coverLink);
    }
    const listen = link(url,''); listen.innerHTML=spotifyIcon;
    listen.append(document.createTextNode('Listen on Spotify ↗'));
    listen.setAttribute('aria-label',`Listen to ${release.title} on Spotify`);
    card.querySelector('.release-link').replaceChildren(listen);
    sortGrid(); updateCounts();
  }
  function needsReview(index, result) {
    const group = groups[index];
    const entry = element('div','', 'review-entry');
    entry.append(element('h3',group.release),element('p',group.artist));
    entry.append(element('p',result.candidates.length ? 'Choose the release you want to showcase.' : 'No exact release match found. Check the artist and release spelling in the copied sheet.'));
    for (const release of result.candidates) {
      const choice = element('div','', 'preview-choice');
      choice.append(element('span',`${release.title} · ${dateText(release.releaseDate)}`));
      const url = safeUrl(release.url,'open.spotify.com');
      if (url) choice.append(link(url,'Open Spotify ↗'));
      const select = element('button','Use this release'); select.type='button';
      select.addEventListener('click',() => {
        display(index,release);
        selections[selectionKey(group)] = release.id;
        try { localStorage.setItem(storageKey,JSON.stringify(selections)); } catch {}
      });
      choice.append(select); entry.append(choice);
    }
    entry.append(cards[index]); review.append(entry); updateCounts();
  }
  async function load() {
    button.disabled=true;
    try {
      while(cursor < groups.length) {
        status.textContent=`Finding artwork and release dates · ${cursor+1} / ${groups.length}`;
        const response = await fetch(`/api/releases/${cursor}`);
        const result = await response.json();
        if(!response.ok) throw new Error(result.error || 'Spotify lookup failed.');
        const saved = result.candidates.find(release=>release.id===selections[selectionKey(groups[cursor])]);
        if(result.status==='matched' || saved) display(cursor,saved || result.candidates[0]);
        else needsReview(cursor,result);
        cursor++;
      }
      status.textContent = review.children.length ? `${albums.size} releases ready. ${review.children.length} need review below.` : 'All releases loaded from Spotify.';
      button.textContent='Reload matches';
    } catch(error) {
      status.textContent=error.message==='Failed to fetch' ? 'The local preview server is unavailable.' : error.message;
      button.textContent='Retry remaining releases';
    } finally { button.disabled=false; }
  }
  button.addEventListener('click',()=>{ if(cursor>=groups.length) location.reload(); else load(); });
  async function initialize() {
    try {
      await refreshCredits();
    } catch (error) {
      sheetStatus.textContent = `Live Google Sheet unavailable; showing the saved snapshot. ${error.message}`;
    }
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Preview status unavailable.');
      button.disabled = false;
      if (data.configured) load();
      else status.textContent = 'Add Spotify app credentials to .env.spotify.local, then load releases using Preview controls.';
    } catch {
      status.textContent = 'Start the local preview with npm run preview:credits to load release artwork.';
    }
  }
  initialize();
})();
