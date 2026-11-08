const requiredHeaders = ['Artist', 'Track', 'Service', 'Release'];

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index++;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
    } else if (character === '"' && field === '') {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index++;
      row.push(field);
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('The published Google Sheet returned malformed CSV.');
  row.push(field);
  if (row.some(value => value !== '')) rows.push(row);
  if (!rows.length) throw new Error('The published Google Sheet is empty.');
  return rows;
}

export function publishedCsvUrl(config, feedUrl = process.env.CREDITS_SHEET_CSV_URL || config.csvUrl) {
  if (feedUrl) {
    const url = new URL(feedUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' ||
      !url.pathname.startsWith('/spreadsheets/d/')) {
      throw new Error('CREDITS_SHEET_CSV_URL must be an HTTPS Google Sheets CSV publish URL.');
    }
    return url.href;
  }
  if (!config.spreadsheetId || !config.sheetName) {
    throw new Error('The credits Sheet configuration needs a spreadsheet ID and tab name.');
  }
  const url = new URL(`https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.spreadsheetId)}/gviz/tq`);
  url.searchParams.set('tqx', 'out:csv');
  url.searchParams.set('sheet', config.sheetName);
  return url.href;
}

export async function fetchPublishedSheet(config, fetchImpl = fetch) {
  let response;
  try {
    response = await fetchImpl(publishedCsvUrl(config), {
      signal: AbortSignal.timeout(10000),
      headers: { Accept: 'text/csv' },
    });
  } catch (error) {
    throw new Error('Could not reach the published Google Sheet. Check the connection and sheet sharing settings.', { cause: error });
  }
  if (!response.ok) {
    throw new Error(`Google Sheets returned HTTP ${response.status}. Make the credits tab publicly readable and try again.`);
  }

  const values = parseCsv((await response.text()).replace(/^\uFEFF/, ''));
  const headers = values[0].map(value => value.trim());
  if (requiredHeaders.some(header => !headers.includes(header))) {
    throw new Error(`The live credits tab must include these columns: ${requiredHeaders.join(', ')}.`);
  }
  if (!values.slice(1).some(row => row.some(value => value.trim()))) {
    throw new Error('The live credits tab contains no credits.');
  }
  return { ...config, values };
}

