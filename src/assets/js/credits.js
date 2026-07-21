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

                fetch(csvUrl)
                    .then(response => response.text())
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

                        const tbody = document.getElementById('credits-body');
                        tbody.innerHTML = ''; 
                        const fragment = document.createDocumentFragment();
                        
                        artistOrder.forEach(artist => {
                            const tr = document.createElement('tr');
                            const artistData = artists[artist];
                            let artistHtml = `<strong class="artist-name">${artist}</strong>`;
                            if (artistData.link) {
                                artistHtml = `<a href="${artistData.link}" style="font-size: inherit;" target="_blank" rel="noopener noreferrer">${artistHtml}</a>`;
                            }
                            const tracksHtml = artistData.tracks
                                .map(track => `<div class="track-entry"><strong>"${track.song}"</strong> - <em>${track.role}</em></div>`)
                                .join('');
                                
                            tr.innerHTML = `<td valign="top">${artistHtml}</td><td valign="top"><div class="details-box">${tracksHtml}</div></td>`;
                            fragment.appendChild(tr);
                        });
                        tbody.appendChild(fragment);
                    })
                    .catch(err => {
                        document.getElementById('credits-body').innerHTML = '<tr><td colspan="2"><strong>Error:</strong> Cannot load data from server.</td></tr>';
                        console.error(err);
                    });
