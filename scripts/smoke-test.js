'use strict';

const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON inválido em ${url}: ${e.message}`)); }
      });
    }).on('error', err => reject(new Error(`${url}: ${err.message}`)));
  });
}

async function main() {
  const checks = [
    { url: 'http://localhost:3000/api/models',    expected: 7,  label: 'FortiSwitch' },
    { url: 'http://localhost:3000/api/fortigate', expected: 28, label: 'FortiGate'   },
  ];

  let failed = false;

  for (const { url, expected, label } of checks) {
    try {
      const data = await get(url);
      if (!Array.isArray(data)) throw new Error('resposta não é um array');
      if (data.length !== expected) throw new Error(`esperado ${expected} modelos, recebido ${data.length}`);
      console.log(`✓ ${label}: ${data.length} modelos OK`);
    } catch (err) {
      console.error(`✗ ${label}: ${err.message}`);
      failed = true;
    }
  }

  if (failed) process.exit(1);
  console.log('\nTodos os smoke tests passaram.');
}

main();
