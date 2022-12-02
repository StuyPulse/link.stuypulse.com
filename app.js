const app = require('express')();
const { google } = require('googleapis');

// ========== SETUP ==========
require('dotenv').config();

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.SHEETS_API_KEY
});

async function getSheetData() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.LINKS_SHEET_ID,
    range: 'A2:B'
  });

  return response.data.values;
}

let timestamp = -1;
let cache = null;


// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.send('This is the StuyPulse link shortener server!');
});
app.get('/*', (req, res) => {
  // alias refers to the "alias" in "link.stuypulse.com/alias"
  const alias = req.path.slice(1);
  if(Date.now() > timestamp + 5000) {
    // console.log('Updating cache... ' + Date.now() + 'and the last cache time: ' + timestamp);
    timestamp = Date.now();
    getSheetData().then(data => {
      cache = data;
      // console.log('Cache updated!');
    });
  }
  for (const [linkAlias, destinationLink] of cache) {
    if (alias === linkAlias) {
      res.redirect(destinationLink);
      return;
    }
  }
    res.send('This shortlink does not exist. Check your spelling?');
});

app.listen(process.env.PORT, () => {
  console.log(`link.stuypulse.com listening on port ${process.env.PORT}!`);
});
