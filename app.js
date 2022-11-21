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

// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.send('main page');
});

app.get('/*', (req, res) => {
  // path refers to the "path-here" in "link.stuypulse.com/path-here"
  const path = req.path.slice(1);

  getSheetData().then((data) => {
    for (const [linkPath, destinationLink] of data) {
      if (linkPath === path) {
        res.redirect(destinationLink);
        return;
      }
    }

    res.send('404');
  });
});

app.listen(process.env.PORT, () => {
  console.log(`link.stuypulse.com listening on port ${process.env.PORT}!`);
});
