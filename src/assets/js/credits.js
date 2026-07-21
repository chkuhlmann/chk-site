                var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTqcYP2KT4bTN_04WapAapr7aMpEfrLjv4YIMqyBNIYDcjzlwDbKlDnUxg9SlGmqMsLF3UqmGYj8zR6/pub?output=csv';
                
                function parseCSV(text) {
                    var result = []; var row = []; var field = ''; var inQuotes = false;
                    for (var i = 0; i < text.length; i++) {
                        var char = text[i];
                        if (inQuotes) {
                            if (char === '"') {
                                if (text[i + 1] === '"') { field += '"'; i++; }
                                else { inQuotes = false; }
                            } else { field += char; }
                        } else {
                            if (char === '"') { inQuotes = true; }
                            else if (char === ',') { row.push(field); field = ''; }
                            else if (char === '\n' || char === '\r') {
                                row.push(field); result.push(row); row = []; field = '';
                                if (char === '\r' && text[i+1] === '\n') i++;
                            } else { field += char; }
                        }
                    }
                    if (field !== '') row.push(field);
                    if (row.length > 0) result.push(row);
                    return result;
                }

                var creditsBody = document.getElementById('credits-body');

                function setCreditsState(message, isError) {
                    creditsBody.innerHTML = '';
                    var row = document.createElement('tr');
                    var cell = document.createElement('td');
                    cell.colSpan = 2;
                    cell.textContent = message;
                    if (isError) cell.setAttribute('role', 'alert');
                    row.appendChild(cell);
                    creditsBody.appendChild(row);
                    creditsBody.setAttribute('aria-busy', 'false');
                }

                fetchWithTimeout(csvUrl)
                    .then(response => {
                        if (!response.ok) throw new Error('Credits request failed');
                        return response.text();
                    })
                    .then(csvText => {
                        const parsed = parseCSV(csvText);
                        const artists = {}; const artistOrder = [];
                        const dataRows = parsed.slice(1).reverse();
                        
                        dataRows.forEach(row => {
                            if (row.length < 3) return;
                            const artist = row[0]?.trim() || 'Unknown Artist';
                            const song = row[1]?.trim() || 'Unknown Track';
                            const role = row[2]?.trim() || '';
                            const link = row[4]?.trim() || '';
                            
                            if (artist === 'Unknown Artist') return;
                            if (!artists[artist]) {
                                artists[artist] = { tracks: [], link: link };
                                artistOrder.push(artist);
                            }
                            artists[artist].tracks.push({ song, role });
                        });

                        if (artistOrder.length === 0) {
                            setCreditsState('No credits are available right now. Please check back soon.', false);
                            return;
                        }

                        creditsBody.innerHTML = '';
                        const fragment = document.createDocumentFragment();
                        
                        artistOrder.forEach(artist => {
                            const tr = document.createElement('tr');
                            const artistData = artists[artist];
                            const artistCell = document.createElement('td');
                            const creditsCell = document.createElement('td');
                            const artistName = document.createElement('strong');
                            const details = document.createElement('div');

                            artistCell.setAttribute('valign', 'top');
                            creditsCell.setAttribute('valign', 'top');
                            artistName.className = 'artist-name';
                            artistName.textContent = artist;
                            details.className = 'details-box';

                            var artistNameContainer = artistName;
                            if (artistData.link) {
                                try {
                                    const artistUrl = new URL(artistData.link);
                                    if (artistUrl.protocol === 'http:' || artistUrl.protocol === 'https:') {
                                        const artistLink = document.createElement('a');
                                        artistLink.href = artistUrl.href;
                                        artistLink.style.fontSize = 'inherit';
                                        artistLink.target = '_blank';
                                        artistLink.rel = 'noopener noreferrer';
                                        artistLink.appendChild(artistName);
                                        artistNameContainer = artistLink;
                                    }
                                } catch (_) {
                                    // Ignore invalid optional artist links.
                                }
                            }

                            artistCell.appendChild(artistNameContainer);
                            artistData.tracks.forEach(track => {
                                const trackEntry = document.createElement('div');
                                const trackName = document.createElement('strong');
                                const role = document.createElement('em');
                                trackEntry.className = 'track-entry';
                                trackName.textContent = `"${track.song}"`;
                                role.textContent = track.role;
                                trackEntry.appendChild(trackName);
                                trackEntry.appendChild(document.createTextNode(' - '));
                                trackEntry.appendChild(role);
                                details.appendChild(trackEntry);
                            });
                            creditsCell.appendChild(details);
                            tr.appendChild(artistCell);
                            tr.appendChild(creditsCell);
                            fragment.appendChild(tr);
                        });
                        creditsBody.appendChild(fragment);
                        creditsBody.setAttribute('aria-busy', 'false');
                    })
                    .catch(() => {
                        setCreditsState('Credits are temporarily unavailable. Please try again later.', true);
                        console.error('Credits request failed.');
                    });
