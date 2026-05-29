# FortiNet Product Selector

An interactive tool for selecting **FortiSwitch** and **FortiGate** models based on technical requirements. Filter by throughput, port media, PoE, MACsec, segment, and more — compare models side by side and view complete specs.

> **Disclaimer:** This is an **unofficial, community-built tool** and is not affiliated with, endorsed by, or supported by Fortinet, Inc. All product data is sourced from publicly available Fortinet datasheets. Fortinet®, FortiGate®, and FortiSwitch® are registered trademarks of Fortinet, Inc.

---

## Features

- **FortiSwitch selector** — 7 Campus Core & Data Center models (Series E, F, G)
- **FortiGate selector** — 28 models from Entry/SOHO desktops to 16U chassis
- Guided wizard with scenario-based recommendations
- Advanced filters (throughput, segment, media type, PoE, MACsec, Wi-Fi)
- Side-by-side comparison table with **automatic difference highlighting**
- Full technical spec detail view for each model

## Requirements

- **Node.js 22 or higher** — required for the built-in `node:sqlite` module
- npm 9+

---

## Setup (Linux)

### 1. Install Node.js 22 via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node --version  # should print v22.x.x or higher
```

### 2. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FortiSelector.git
cd FortiSelector
```

### 3. Install dependencies

```bash
npm install
```

### 4. Seed the database

This creates `db/models.db` and populates both FortiSwitch and FortiGate tables:

```bash
npm run seed:all
```

### 5. Start the server

```bash
npm start
```

The app will be available at **http://localhost:3000**.

To use a different port:

```bash
PORT=8080 npm start
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run seed` | Seeds FortiSwitch models only |
| `npm run seed:fg` | Seeds FortiGate models only |
| `npm run seed:all` | Seeds both FortiSwitch and FortiGate models |
| `npm start` | Starts the Express server |
| `npm run setup` | Seeds all models then starts the server |
| `npm run lint` | Runs ESLint |
| `npm run smoke` | Runs API smoke tests (requires server running) |

---

## CI

Every push to `main` automatically runs:

1. ESLint
2. `npm audit` (moderate severity threshold)
3. Database seed
4. API smoke tests (`/api/models` and `/api/fortigate`)

---

## Data Sources

- FortiSwitch Campus Core and Data Center Series — Datasheet FS-DC-DAT-R44-20260401
- FortiGate Network Security Platform — Product Matrix May 2026
