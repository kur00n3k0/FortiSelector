const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'models.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS models (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    series      TEXT NOT NULL,
    sku         TEXT NOT NULL,
    desc        TEXT NOT NULL,
    media       TEXT NOT NULL,
    poe         INTEGER NOT NULL DEFAULT 0,
    macsec      INTEGER NOT NULL DEFAULT 0,
    ports       TEXT NOT NULL,
    portDensity INTEGER NOT NULL,
    cap         INTEGER NOT NULL,
    mpps        INTEGER NOT NULL,
    mac         TEXT NOT NULL,
    latency     TEXT NOT NULL,
    vlans       TEXT NOT NULL,
    lag         TEXT NOT NULL,
    lagGroups   TEXT NOT NULL,
    queues      TEXT NOT NULL,
    buffers     TEXT NOT NULL,
    mem         TEXT NOT NULL,
    flash       TEXT NOT NULL,
    drive       TEXT NOT NULL,
    l3host      TEXT NOT NULL,
    routes      TEXT NOT NULL,
    multicast   TEXT NOT NULL,
    acl         TEXT NOT NULL,
    multigig    INTEGER NOT NULL DEFAULT 0,
    splitport   INTEGER NOT NULL DEFAULT 0,
    poectrl     INTEGER NOT NULL DEFAULT 0,
    ingresspause INTEGER NOT NULL DEFAULT 0,
    poetype     TEXT,
    poebudget   TEXT,
    routing     TEXT NOT NULL,
    lic         TEXT NOT NULL,
    psu         TEXT NOT NULL,
    power       TEXT NOT NULL,
    heat        TEXT NOT NULL,
    optemp      TEXT NOT NULL,
    sttemp      TEXT NOT NULL,
    humidity    TEXT NOT NULL,
    airflow     TEXT NOT NULL,
    noise       TEXT NOT NULL,
    mtbf        TEXT NOT NULL,
    weight      TEXT NOT NULL,
    dims        TEXT NOT NULL,
    form        TEXT NOT NULL,
    stp         TEXT NOT NULL,
    linerate    TEXT
  )
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO models VALUES (
    :id, :name, :series, :sku, :desc, :media,
    :poe, :macsec, :ports, :portDensity, :cap, :mpps,
    :mac, :latency, :vlans, :lag, :lagGroups, :queues, :buffers,
    :mem, :flash, :drive, :l3host, :routes, :multicast, :acl,
    :multigig, :splitport, :poectrl, :ingresspause,
    :poetype, :poebudget, :routing, :lic,
    :psu, :power, :heat, :optemp, :sttemp, :humidity,
    :airflow, :noise, :mtbf, :weight, :dims, :form, :stp, :linerate
  )
`);

const models = [
  {
    id: "FS-1024E", name: "FortiSwitch 1024E", series: "E", sku: "FS-1024E",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 24x GE/10GE SFP/SFP+ e 2x 100GE QSFP28. Fontes AC duplas.",
    media: JSON.stringify(["sfpplus","qsfp28"]), poe: 0, macsec: 1,
    ports: "24x SFP+/SFP 10G/1G + 2x QSFP28/QSFP+ 100G/40G", portDensity: 26,
    cap: 880, mpps: 1309, mac: "64 K", latency: "~1 µs", vlans: "4 K",
    lag: "Até 24", lagGroups: "Até o nº de portas", queues: "8", buffers: "8 MB",
    mem: "8 GB DDR4", flash: "32 MB NOR", drive: "8 GB SSD",
    l3host: "16K / 6K", routes: "8K / 4K", multicast: "8k", acl: "3K",
    multigig: 1, splitport: 1, poectrl: 0, ingresspause: 1,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-1000",
    psu: "Dupla AC hot-swap", power: "176 W", heat: "599,13 BTU/h",
    optemp: "0 °C a 45 °C", sttemp: "-40 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Front to back", noise: "56 dBA", mtbf: "> 10 anos",
    weight: "6,58 kg (14,5 lb)", dims: "44 x 410 x 440 mm", form: "1 RU",
    stp: "64", linerate: null
  },
  {
    id: "FS-T1024E", name: "FortiSwitch T1024E", series: "E", sku: "FS-T1024E",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 24x 1G/2.5G/5G/10GBase-T e 2x 100GE QSFP28. Fontes AC duplas.",
    media: JSON.stringify(["baset","qsfp28"]), poe: 0, macsec: 1,
    ports: "24x BASE-T 10G/5G/2.5G/1G/100M + 2x QSFP28/QSFP+ 100G/40G", portDensity: 26,
    cap: 880, mpps: 1309, mac: "64 K", latency: "~1 µs", vlans: "4 K",
    lag: "Até 24", lagGroups: "Até o nº de portas", queues: "8", buffers: "8 MB",
    mem: "8 GB DDR4", flash: "32 MB NOR", drive: "8 GB SSD",
    l3host: "16K / 6K", routes: "8K / 4K", multicast: "8k", acl: "3K",
    multigig: 1, splitport: 1, poectrl: 0, ingresspause: 1,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-1000",
    psu: "Dupla AC hot-swap", power: "128 W", heat: "436,48 BTU/h",
    optemp: "0 °C a 45 °C", sttemp: "-40 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Front to back", noise: "57,3 dBA", mtbf: "> 10 anos",
    weight: "6,54 kg (14,4 lb)", dims: "44 x 410 x 440 mm", form: "1 RU",
    stp: "64", linerate: null
  },
  {
    id: "FS-T1024F-FPOE", name: "FortiSwitch T1024F-FPOE", series: "F", sku: "FS-T1024F-FPOE",
    desc: "Layer 2/3 compatível com FortiGate switch controller — PoE 802.3bt, 24x 10G/5G/2.5G/1G RJ45 e 2x 100GE QSFP28. Budget PoE máx. 1440W. Fontes AC duplas.",
    media: JSON.stringify(["baset","qsfp28"]), poe: 1, macsec: 1,
    ports: "24x BASE-T 10G/5G/2.5G/1G/100M + 2x QSFP28/QSFP+ 100G/40G", portDensity: 26,
    cap: 880, mpps: 1309, mac: "64 K", latency: "~1 µs", vlans: "4 K",
    lag: "Até 24", lagGroups: "Até o nº de portas", queues: "8", buffers: "8 MB",
    mem: "8 GB DDR4", flash: "32 MB NOR", drive: "8 GB SSD",
    l3host: "16K / 6K", routes: "8K / 4K", multicast: "8k", acl: "3K",
    multigig: 1, splitport: 1, poectrl: 1, ingresspause: 1,
    poetype: "802.3 af/at/bt type 4", poebudget: "1440 W",
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-1000",
    psu: "Dupla AC hot-swap", power: "1660 W", heat: "5664 BTU/h",
    optemp: "0 °C a 45 °C", sttemp: "-40 °C a 70 °C", humidity: "10–95% s/ condensação",
    airflow: "Front to back", noise: "64,5 dBA", mtbf: "> 10 anos",
    weight: "7,5 kg (16,53 lb)", dims: "44 x 410 x 440 mm", form: "1 RU",
    stp: "64", linerate: null
  },
  {
    id: "FS-1048G", name: "FortiSwitch 1048G", series: "G", sku: "FS-1048G",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 48x GE/10GE SFP/SFP+ e 6x 100GE QSFP28. MACsec. Fontes AC duplas.",
    media: JSON.stringify(["sfpplus","qsfp28"]), poe: 0, macsec: 1,
    ports: "48x SFP+/SFP 10G/1G + 6x QSFP28/QSFP+ 100G/40G", portDensity: 54,
    cap: 2160, mpps: 2000, mac: "64 K", latency: "< 1 µs", vlans: "4 K",
    lag: "Até 48", lagGroups: "Até o nº de portas", queues: "8", buffers: "32 MB",
    mem: "8 GB DDR4", flash: "32 MB NOR", drive: "128 GB SSD",
    l3host: "16K / 8K", routes: "16K / 8K", multicast: "16K", acl: "3K",
    multigig: 0, splitport: 0, poectrl: 0, ingresspause: 1,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-1000",
    psu: "Dupla AC hot-swap", power: "585,78 W", heat: "2004,3 BTU/h",
    optemp: "0 °C a 40 °C", sttemp: "-25 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Front to back", noise: "71 dBA", mtbf: "> 10 anos",
    weight: "9,1 kg (20,06 lb)", dims: "43 x 460 x 438,5 mm", form: "1 RU",
    stp: "64", linerate: "Full line rate com pacote mínimo de 128 bytes"
  },
  {
    id: "FS-2048F", name: "FortiSwitch 2048F", series: "F", sku: "FS-2048F",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 48x 25G SFP28 + 8x 100G QSFP28 + 2x 10G SFP+. Fontes AC duplas.",
    media: JSON.stringify(["sfp28","sfpplus","qsfp28"]), poe: 0, macsec: 0,
    ports: "48x SFP28 25G/10G/1G + 2x SFP+ 10G/1G + 8x QSFP28/QSFP+ 100G/40G", portDensity: 58,
    cap: 4000, mpps: 4000, mac: "96 K", latency: "< 1 µs", vlans: "4 K",
    lag: "Até 48", lagGroups: "Até o nº de portas", queues: "8", buffers: "32 MB",
    mem: "8 GB DDR4", flash: "8 GB NAND", drive: "32 GB SSD",
    l3host: "16K / 8K", routes: "16K / 8K", multicast: "8k", acl: "3K",
    multigig: 0, splitport: 0, poectrl: 0, ingresspause: 1,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-2000",
    psu: "Dupla AC hot-swap", power: "175,7 W", heat: "406 BTU/h",
    optemp: "0 °C a 40 °C", sttemp: "-25 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Front to back", noise: "69,36 dBA", mtbf: "> 10 anos",
    weight: "9,88 kg (21,78 lb)", dims: "43,5 x 460 x 438,5 mm", form: "1 RU",
    stp: "64", linerate: "Full line rate com pacote mínimo de 110 bytes (sem uso das 2x10G)"
  },
  {
    id: "FS-2048F-B2F", name: "FortiSwitch 2048F-B2F", series: "F", sku: "FS-2048F-B2F",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 48x 25G SFP28 + 8x 100G QSFP28 + 2x 10G SFP+. Fluxo de ar back-to-front. Fontes AC duplas.",
    media: JSON.stringify(["sfp28","sfpplus","qsfp28"]), poe: 0, macsec: 0,
    ports: "48x SFP28 25G/10G/1G + 2x SFP+ 10G/1G + 8x QSFP28/QSFP+ 100G/40G", portDensity: 58,
    cap: 4000, mpps: 4000, mac: "96 K", latency: "< 1 µs", vlans: "4 K",
    lag: "Até 48", lagGroups: "Até o nº de portas", queues: "8", buffers: "32 MB",
    mem: "8 GB DDR4", flash: "8 GB NAND", drive: "32 GB SSD",
    l3host: "16K / 8K", routes: "16K / 8K", multicast: "8k", acl: "3K",
    multigig: 0, splitport: 0, poectrl: 0, ingresspause: 1,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-2000",
    psu: "Dupla AC hot-swap", power: "175,7 W", heat: "406 BTU/h",
    optemp: "0 °C a 40 °C", sttemp: "-25 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Back to front", noise: "69,36 dBA", mtbf: "> 10 anos",
    weight: "9,88 kg (21,78 lb)", dims: "43,5 x 460 x 438,5 mm", form: "1 RU",
    stp: "64", linerate: "Full line rate com pacote mínimo de 110 bytes (sem uso das 2x10G)"
  },
  {
    id: "FS-3032G", name: "FortiSwitch 3032G", series: "G", sku: "FS-3032G",
    desc: "Layer 2/3 compatível com FortiGate switch controller — 32x 100GE/40GE QSFP28/QSFP+ e 2x 10GE SFP+. Fontes AC duplas.",
    media: JSON.stringify(["qsfp28","sfpplus"]), poe: 0, macsec: 0,
    ports: "32x QSFP28/QSFP+ 100GE/40GE + 2x SFP+/SFP 10GE/1GE", portDensity: 34,
    cap: 6440, mpps: 4000, mac: "65 K", latency: "< 1 µs", vlans: "4 K",
    lag: "Até o nº de portas", lagGroups: "Até o nº de portas", queues: "8", buffers: "32 MB",
    mem: "8 GB DDR4", flash: "32 MB NOR", drive: "128 GB SSD",
    l3host: "16K / 16K", routes: "16K / 8K", multicast: "16k", acl: "2.7K",
    multigig: 0, splitport: 0, poectrl: 0, ingresspause: 0,
    poetype: null, poebudget: null,
    routing: "OSPF, RIP, VRRP, BGP, IS-IS", lic: "FS-SW-LIC-3000",
    psu: "Dupla AC hot-swap", power: "548,94 W", heat: "1871,88 BTU/h",
    optemp: "0 °C a 40 °C", sttemp: "-25 °C a 70 °C", humidity: "10–90% s/ condensação",
    airflow: "Front to back", noise: "73,13 dBA", mtbf: "> 10 anos",
    weight: "8,37 kg (18,45 lb)", dims: "43 x 460 x 438,5 mm", form: "1 RU",
    stp: "64", linerate: "Full line rate com pacote mínimo de 251 bytes"
  }
];

db.exec('BEGIN');
for (const m of models) insert.run(m);
db.exec('COMMIT');

console.log(`Banco de dados criado em db/models.db com ${models.length} modelos.`);
db.close();
