const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const db = new DatabaseSync(path.join(__dirname, 'db', 'models.db'));

app.use(express.static(path.join(__dirname)));

app.get('/api/models', (_req, res) => {
  const rows = db.prepare('SELECT * FROM models ORDER BY cap ASC').all();
  const models = rows.map(r => ({
    ...r,
    media: JSON.parse(r.media),
    poe: Boolean(r.poe),
    macsec: Boolean(r.macsec),
    multigig: Boolean(r.multigig),
    splitport: Boolean(r.splitport),
    poectrl: Boolean(r.poectrl),
    ingresspause: Boolean(r.ingresspause),
  }));
  res.json(models);
});

app.get('/api/fortigate', (_req, res) => {
  const rows = db.prepare('SELECT * FROM fortigate_models ORDER BY fw_gbps ASC').all();
  const models = rows.map(r => ({
    ...r,
    has_wifi: Boolean(r.has_wifi),
  }));
  res.json(models);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FortiSelector rodando em http://localhost:${PORT}`);
});
