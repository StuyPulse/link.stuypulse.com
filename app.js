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

app.get('/*', (req, res) => {
  // alias refers to the "alias" in "link.stuypulse.com/alias"
  const alias = req.path.slice(1);

  getSheetData().then((data) => {
    for (const [linkAlias, destinationLink] of data) {
      if (alias === linkAlias) {
        res.redirect(destinationLink);
        return;
      }
    }

    res.send('StuyPulse Link Shortener');
  });
});

app.listen(process.env.PORT, () => {
  console.log(`link.stuypulse.com listening on port ${process.env.PORT}!`);
});
