const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'models.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS fortigate_models (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    sku           TEXT NOT NULL,
    segment       TEXT NOT NULL,
    desc          TEXT NOT NULL,
    form          TEXT NOT NULL,
    fw_gbps       REAL NOT NULL,
    fw_text       TEXT NOT NULL,
    ipsec_gbps    REAL NOT NULL,
    ips_gbps      REAL NOT NULL,
    ngfw_gbps     REAL NOT NULL,
    threat_gbps   REAL NOT NULL,
    latency       TEXT NOT NULL,
    sessions_m    REAL NOT NULL,
    sessions_text TEXT NOT NULL,
    new_sessions  INTEGER NOT NULL,
    fw_policies   INTEGER NOT NULL,
    gw_ipsec      INTEGER NOT NULL,
    cli_ipsec     INTEGER NOT NULL,
    ssl_vpn_gbps  REAL,
    ssl_vpn_users INTEGER,
    ssl_inspect   REAL NOT NULL,
    appctrl_gbps  REAL NOT NULL,
    fortiaps      TEXT NOT NULL,
    fortiswitches INTEGER NOT NULL,
    fortitokens   INTEGER NOT NULL,
    vdoms         TEXT NOT NULL,
    interfaces    TEXT NOT NULL,
    storage       TEXT,
    psu           TEXT NOT NULL,
    variants      TEXT,
    has_wifi      INTEGER NOT NULL DEFAULT 0
  )
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO fortigate_models VALUES (
    :id,:name,:sku,:segment,:desc,:form,
    :fw_gbps,:fw_text,:ipsec_gbps,:ips_gbps,:ngfw_gbps,:threat_gbps,
    :latency,:sessions_m,:sessions_text,:new_sessions,:fw_policies,
    :gw_ipsec,:cli_ipsec,:ssl_vpn_gbps,:ssl_vpn_users,
    :ssl_inspect,:appctrl_gbps,:fortiaps,:fortiswitches,:fortitokens,
    :vdoms,:interfaces,:storage,:psu,:variants,:has_wifi
  )
`);

const models = [
  // ── ENTRY / SOHO ──────────────────────────────────────────────────────
  {
    id:"FG-30G", name:"FortiGate 30G", sku:"FG-30G", segment:"entry",
    desc:"Desktop compacto para SOHO — 4 Gbps FW, 600 K sessões. Variante FWF-30G com Wi-Fi integrado.",
    form:"Desktop", fw_gbps:4, fw_text:"4 / 4 / 3,9 Gbps",
    ipsec_gbps:3.5, ips_gbps:0.8, ngfw_gbps:0.57, threat_gbps:0.5,
    latency:"2,87 µs", sessions_m:0.6, sessions_text:"600 K", new_sessions:30000,
    fw_policies:2000, gw_ipsec:200, cli_ipsec:250,
    ssl_vpn_gbps:null, ssl_vpn_users:null,
    ssl_inspect:0.4, appctrl_gbps:0.83,
    fortiaps:"16 / 8", fortiswitches:8, fortitokens:500, vdoms:"— / —",
    interfaces:"4x GE RJ45", storage:"30 GB", psu:"Single AC", variants:"WiFi", has_wifi:1
  },
  {
    id:"FG-40F", name:"FortiGate 40F", sku:"FG-40F", segment:"entry",
    desc:"Desktop para pequenas filiais — 5 Gbps FW, 700 K sessões. Variante FWF-40F com Wi-Fi e 3G/4G.",
    form:"Desktop", fw_gbps:5, fw_text:"5 / 5 / 5 Gbps",
    ipsec_gbps:4.4, ips_gbps:1, ngfw_gbps:0.8, threat_gbps:0.6,
    latency:"2,97 µs", sessions_m:0.7, sessions_text:"700 K", new_sessions:35000,
    fw_policies:2000, gw_ipsec:200, cli_ipsec:250,
    ssl_vpn_gbps:null, ssl_vpn_users:null,
    ssl_inspect:0.31, appctrl_gbps:0.99,
    fortiaps:"16 / 8", fortiswitches:8, fortitokens:500, vdoms:"10 / 10",
    interfaces:"5x GE RJ45", storage:null, psu:"Single AC", variants:"WiFi, 3G4G", has_wifi:1
  },
  {
    id:"FG-50G", name:"FortiGate 50G", sku:"FG-50G", segment:"entry",
    desc:"Desktop com alta inspeção SSL — 5 Gbps FW, IPS 2,25 Gbps. Variantes com Wi-Fi, DSL, PoE e 5G.",
    form:"Desktop", fw_gbps:5, fw_text:"5 / 5 / 4 Gbps",
    ipsec_gbps:4.5, ips_gbps:2.25, ngfw_gbps:1.25, threat_gbps:1.1,
    latency:"2,42 µs", sessions_m:0.72, sessions_text:"720 K", new_sessions:85000,
    fw_policies:2000, gw_ipsec:200, cli_ipsec:250,
    ssl_vpn_gbps:null, ssl_vpn_users:null,
    ssl_inspect:1.3, appctrl_gbps:2.8,
    fortiaps:"16 / 8", fortiswitches:8, fortitokens:500, vdoms:"5 / 5",
    interfaces:"5x GE RJ45", storage:"64 GB", psu:"Single AC", variants:"WiFi, DSL, SFP, POE, 5G", has_wifi:1
  },
  // ── SMB ───────────────────────────────────────────────────────────────
  {
    id:"FG-60F", name:"FortiGate 60F", sku:"FG-60F", segment:"smb",
    desc:"Desktop para filiais — 10 Gbps FW, 24 FortiSwitches gerenciados. Variante FWF-60F com Wi-Fi e armazenamento.",
    form:"Desktop", fw_gbps:10, fw_text:"10 / 10 / 6 Gbps",
    ipsec_gbps:6.5, ips_gbps:1.4, ngfw_gbps:1, threat_gbps:0.7,
    latency:"3,30 µs", sessions_m:0.7, sessions_text:"700 K", new_sessions:35000,
    fw_policies:2000, gw_ipsec:200, cli_ipsec:500,
    ssl_vpn_gbps:null, ssl_vpn_users:null,
    ssl_inspect:0.63, appctrl_gbps:1.8,
    fortiaps:"64 / 32", fortiswitches:24, fortitokens:500, vdoms:"10 / 10",
    interfaces:"10x GE RJ45", storage:"128 GB", psu:"Single AC", variants:"WiFi, Storage", has_wifi:1
  },
  {
    id:"FG-70F", name:"FortiGate 70F", sku:"FG-70F", segment:"smb",
    desc:"Desktop com VPN SSL ativa — 10 Gbps FW, 1,5 M sessões, SSL VPN 405 Mbps para 200 usuários.",
    form:"Desktop", fw_gbps:10, fw_text:"10 / 10 / 6 Gbps",
    ipsec_gbps:6.1, ips_gbps:1.4, ngfw_gbps:1, threat_gbps:0.8,
    latency:"2,54 µs", sessions_m:1.5, sessions_text:"1,5 M", new_sessions:35000,
    fw_policies:5000, gw_ipsec:200, cli_ipsec:500,
    ssl_vpn_gbps:0.405, ssl_vpn_users:200,
    ssl_inspect:0.7, appctrl_gbps:1.8,
    fortiaps:"64 / 32", fortiswitches:24, fortitokens:500, vdoms:"10 / 10",
    interfaces:"10x GE RJ45", storage:"128 GB", psu:"Single AC", variants:null, has_wifi:0
  },
  {
    id:"FG-70G", name:"FortiGate 70G", sku:"FG-70G", segment:"smb",
    desc:"Desktop nova geração — 10 Gbps FW linha-rate, IPS 2,5 Gbps. Variante FWF-70G com Wi-Fi e PoE.",
    form:"Desktop", fw_gbps:10, fw_text:"10 / 10 / 10 Gbps",
    ipsec_gbps:7.1, ips_gbps:2.5, ngfw_gbps:1.5, threat_gbps:1.3,
    latency:"2,46 µs", sessions_m:1.4, sessions_text:"1,4 M", new_sessions:100000,
    fw_policies:5000, gw_ipsec:200, cli_ipsec:500,
    ssl_vpn_gbps:null, ssl_vpn_users:null,
    ssl_inspect:1.4, appctrl_gbps:3.6,
    fortiaps:"96 / 48", fortiswitches:24, fortitokens:500, vdoms:"10 / 10",
    interfaces:"10x GE RJ45", storage:"64 GB", psu:"Single AC", variants:"WiFi, POE", has_wifi:1
  },
  {
    id:"FG-80F", name:"FortiGate 80F", sku:"FG-80F", segment:"smb",
    desc:"Desktop com dual-input e VPN SSL 950 Mbps — 10 Gbps FW, 1,5 M sessões. Variantes DSL, Bypass e Storage.",
    form:"Desktop", fw_gbps:10, fw_text:"10 / 10 / 7 Gbps",
    ipsec_gbps:6.5, ips_gbps:1.4, ngfw_gbps:1, threat_gbps:0.9,
    latency:"3,23 µs", sessions_m:1.5, sessions_text:"1,5 M", new_sessions:45000,
    fw_policies:5000, gw_ipsec:200, cli_ipsec:2500,
    ssl_vpn_gbps:0.95, ssl_vpn_users:200,
    ssl_inspect:0.715, appctrl_gbps:1.8,
    fortiaps:"96 / 48", fortiswitches:24, fortitokens:500, vdoms:"10 / 10",
    interfaces:"8x GE RJ45, 2x Shared Port Pairs", storage:"128 GB", psu:"Single AC, dual inputs", variants:"WiFi, 3G4G, DSL, Bypass, Storage", has_wifi:1
  },
  {
    id:"FG-90G", name:"FortiGate 90G", sku:"FG-90G", segment:"smb",
    desc:"Desktop de alta capacidade — 28 Gbps FW, 3 M sessões, 2x 10GE uplinks integrados e SSL VPN 1,4 Gbps.",
    form:"Desktop", fw_gbps:28, fw_text:"28 / 28 / 27,9 Gbps",
    ipsec_gbps:25, ips_gbps:4.5, ngfw_gbps:2.5, threat_gbps:2.2,
    latency:"3,23 µs", sessions_m:3, sessions_text:"3 M", new_sessions:124000,
    fw_policies:5000, gw_ipsec:200, cli_ipsec:2500,
    ssl_vpn_gbps:1.4, ssl_vpn_users:200,
    ssl_inspect:2.6, appctrl_gbps:6.7,
    fortiaps:"128 / 64", fortiswitches:24, fortitokens:500, vdoms:"10 / 10",
    interfaces:"8x GE RJ45, 2x 10GE Shared Port Pairs", storage:"120 GB", psu:"Single AC, dual inputs", variants:null, has_wifi:0
  },
  {
    id:"FG-120G", name:"FortiGate 120G", sku:"FG-120G", segment:"smb",
    desc:"1U para filiais grandes e sedes pequenas — 39 Gbps FW, NGFW 3,1 Gbps, Dual PSU. Gerencia 48 FortiSwitches.",
    form:"1 RU", fw_gbps:39, fw_text:"39 / 39 / 28 Gbps",
    ipsec_gbps:35, ips_gbps:5.3, ngfw_gbps:3.1, threat_gbps:2.8,
    latency:"3,17 µs", sessions_m:3, sessions_text:"3 M", new_sessions:140000,
    fw_policies:10000, gw_ipsec:2000, cli_ipsec:16000,
    ssl_vpn_gbps:1.5, ssl_vpn_users:500,
    ssl_inspect:3, appctrl_gbps:6.7,
    fortiaps:"128 / 64", fortiswitches:48, fortitokens:5000, vdoms:"10 / 10",
    interfaces:"4x 10GE SFP+, 18x GE RJ45, 8x GE SFP", storage:"480 GB", psu:"Dual AC", variants:null, has_wifi:0
  },
  {
    id:"FG-200G", name:"FortiGate 200G", sku:"FG-200G", segment:"smb",
    desc:"1U para sedes médias — 39 Gbps FW, NGFW 7 Gbps, 11 M sessões. Portas 10GE SFP+ e 5GE RJ45.",
    form:"1 RU", fw_gbps:39, fw_text:"39 / 39 / 26,5 Gbps",
    ipsec_gbps:36, ips_gbps:9, ngfw_gbps:7, threat_gbps:6,
    latency:"4,36 µs", sessions_m:11, sessions_text:"11 M", new_sessions:400000,
    fw_policies:10000, gw_ipsec:2000, cli_ipsec:16000,
    ssl_vpn_gbps:3, ssl_vpn_users:500,
    ssl_inspect:7, appctrl_gbps:27.8,
    fortiaps:"256 / 128", fortiswitches:64, fortitokens:5000, vdoms:"10 / 25",
    interfaces:"8x 10GE SFP+, 8x 5GE RJ45, 10x GE RJ45, 4x GE SFP", storage:"480 GB", psu:"Dual AC", variants:null, has_wifi:0
  },
  // ── ENTERPRISE ────────────────────────────────────────────────────────
  {
    id:"FG-400G", name:"FortiGate 400G", sku:"FG-400G", segment:"enterprise",
    desc:"1U para sedes corporativas — 164 Gbps FW, NGFW 14 Gbps, portas 25GE SFP28. Gerencia 512 FortiAPs.",
    form:"1 RU", fw_gbps:164, fw_text:"164 / 163 / 145 Gbps",
    ipsec_gbps:55, ips_gbps:25, ngfw_gbps:14, threat_gbps:13,
    latency:"2,51 µs", sessions_m:28, sessions_text:"28 M", new_sessions:580000,
    fw_policies:10000, gw_ipsec:2000, cli_ipsec:50000,
    ssl_vpn_gbps:6.1, ssl_vpn_users:5000,
    ssl_inspect:11.5, appctrl_gbps:50,
    fortiaps:"512 / 256", fortiswitches:96, fortitokens:5000, vdoms:"10 / 25",
    interfaces:"4x 25GE SFP28, 4x 10GE SFP+, 16x GE SFP, 8x 5GE RJ45, 1x 2,5GE RJ45, 1x GE RJ45", storage:"960 GB", psu:"Dual AC", variants:null, has_wifi:0
  },
  {
    id:"FG-700G", name:"FortiGate 700G", sku:"FG-700G", segment:"enterprise",
    desc:"1U enterprise de alta inspeção — 164 Gbps FW, NGFW 29 Gbps, 30 K políticas. SSL VPN para 10 K usuários.",
    form:"1 RU", fw_gbps:164, fw_text:"164 / 163 / 145 Gbps",
    ipsec_gbps:55, ips_gbps:38, ngfw_gbps:29, threat_gbps:26,
    latency:"3,87 µs", sessions_m:28, sessions_text:"28 M", new_sessions:700000,
    fw_policies:30000, gw_ipsec:2000, cli_ipsec:50000,
    ssl_vpn_gbps:8, ssl_vpn_users:10000,
    ssl_inspect:14, appctrl_gbps:50,
    fortiaps:"1024 / 512", fortiswitches:96, fortitokens:5000, vdoms:"10 / 50",
    interfaces:"4x 25GE SFP28, 4x 10GE SFP+, 16x GE SFP, 8x 5GE RJ45, 1x 2,5GE RJ45, 1x GE RJ45", storage:"960 GB", psu:"Dual AC", variants:null, has_wifi:0
  },
  {
    id:"FG-900G", name:"FortiGate 900G", sku:"FG-900G", segment:"enterprise",
    desc:"1U top enterprise — 164 Gbps FW, NGFW 31 Gbps, 50 K políticas. FortiAPs 2048, variante DC disponível.",
    form:"1 RU", fw_gbps:164, fw_text:"164 / 163 / 153 Gbps",
    ipsec_gbps:55, ips_gbps:42, ngfw_gbps:31, threat_gbps:30,
    latency:"3,78 / 2,5 µs", sessions_m:16, sessions_text:"16 M", new_sessions:720000,
    fw_policies:50000, gw_ipsec:2000, cli_ipsec:50000,
    ssl_vpn_gbps:10, ssl_vpn_users:10000,
    ssl_inspect:16.7, appctrl_gbps:74.8,
    fortiaps:"2048 / 1024", fortiswitches:196, fortitokens:5000, vdoms:"10 / 50",
    interfaces:"4x 25GE SFP28, 4x 10GE SFP+, 1x 2,5GE RJ45, 8x GE SFP, 17x GE RJ45", storage:"960 GB", psu:"Dual", variants:"DC", has_wifi:0
  },
  {
    id:"FG-1000F", name:"FortiGate 1000F", sku:"FG-1000F", segment:"enterprise",
    desc:"2U com uplinks 100GE QSFP28 — 198 Gbps FW, NGFW 15 Gbps, 100 K políticas. 8x 10GE RJ45.",
    form:"2 RU", fw_gbps:198, fw_text:"198 / 196 / 134 Gbps",
    ipsec_gbps:55, ips_gbps:19, ngfw_gbps:15, threat_gbps:13,
    latency:"3,45 µs", sessions_m:7.5, sessions_text:"7,5 M", new_sessions:650000,
    fw_policies:100000, gw_ipsec:20000, cli_ipsec:100000,
    ssl_vpn_gbps:5.3, ssl_vpn_users:10000,
    ssl_inspect:10, appctrl_gbps:44,
    fortiaps:"4096 / 2048", fortiswitches:196, fortitokens:20000, vdoms:"10 / 250",
    interfaces:"2x 100GE QSFP28, 8x 25GE SFP28, 16x 10GE SFP+, 8x 10GE RJ45, 1x 2,5GE RJ45, 1x GE RJ45", storage:"960 GB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-1800F", name:"FortiGate 1800F", sku:"FG-1800F", segment:"enterprise",
    desc:"2U com 4x 100GE QSFP28 — 198 Gbps FW, NGFW 17 Gbps. Suporte a hyperscale license. Variante DC.",
    form:"2 RU", fw_gbps:198, fw_text:"198 / 197 / 140 Gbps",
    ipsec_gbps:55, ips_gbps:22, ngfw_gbps:17, threat_gbps:15,
    latency:"3,22 µs", sessions_m:12, sessions_text:"12 M / 40 M*", new_sessions:750000,
    fw_policies:100000, gw_ipsec:20000, cli_ipsec:100000,
    ssl_vpn_gbps:11, ssl_vpn_users:10000,
    ssl_inspect:12, appctrl_gbps:34,
    fortiaps:"4096 / 2048", fortiswitches:196, fortitokens:20000, vdoms:"10 / 250",
    interfaces:"4x 100GE QSFP28, 12x 25GE SFP28, 2x 10GE SFP+, 8x GE SFP, 18x GE RJ45", storage:"2x 960 GB", psu:"Dual", variants:"DC", has_wifi:0
  },
  {
    id:"FG-2600F", name:"FortiGate 2600F", sku:"FG-2600F", segment:"enterprise",
    desc:"2U alta inspeção — 198 Gbps FW, NGFW 27 Gbps, SSL VPN 16 Gbps para 30 K usuários. Variante DC.",
    form:"2 RU", fw_gbps:198, fw_text:"198 / 196 / 140 Gbps",
    ipsec_gbps:55, ips_gbps:31, ngfw_gbps:27, threat_gbps:25,
    latency:"3,41 µs", sessions_m:24, sessions_text:"24 M / 40 M*", new_sessions:1000000,
    fw_policies:100000, gw_ipsec:20000, cli_ipsec:100000,
    ssl_vpn_gbps:16, ssl_vpn_users:30000,
    ssl_inspect:20, appctrl_gbps:64,
    fortiaps:"4096 / 2048", fortiswitches:196, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"4x 100GE QSFP28/40GE QSFP+, 16x 25GE SFP28, 16x 10GE RJ45, 2x 10GE SFP+, 2x GE RJ45", storage:"2x 960 GB", psu:"Dual", variants:"DC", has_wifi:0
  },
  // ── DATA CENTER ───────────────────────────────────────────────────────
  {
    id:"FG-3000F", name:"FortiGate 3000F", sku:"FG-3000F", segment:"datacenter",
    desc:"2U data center — 397 Gbps FW, NGFW 34 Gbps, 200 K políticas. 6x 100GE uplinks. Variante DC.",
    form:"2 RU", fw_gbps:397, fw_text:"397 / 389 / 221 Gbps",
    ipsec_gbps:105, ips_gbps:36, ngfw_gbps:34, threat_gbps:33,
    latency:"3,92 µs", sessions_m:70, sessions_text:"70 M / 230 M*", new_sessions:870000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:11, ssl_vpn_users:30000,
    ssl_inspect:29, appctrl_gbps:115,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"6x 100GE QSFP28/40GE QSFP+, 16x 25GE SFP28, 18x 10GE RJ45, 2x GE RJ45", storage:"2x 960 GB", psu:"Dual", variants:"DC", has_wifi:0
  },
  {
    id:"FG-3000G", name:"FortiGate 3000G", sku:"FG-3000G", segment:"datacenter",
    desc:"2U DC nova geração NP8 — 397 Gbps FW, NGFW 85 Gbps, SSL Inspect 75 Gbps. Alta densidade de inspeção.",
    form:"2 RU", fw_gbps:397, fw_text:"397 / 394 / 234 Gbps",
    ipsec_gbps:105, ips_gbps:90, ngfw_gbps:85, threat_gbps:80,
    latency:"3,70 µs", sessions_m:88, sessions_text:"88 M / 230 M*", new_sessions:1100000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:9, ssl_vpn_users:30000,
    ssl_inspect:75, appctrl_gbps:159,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"6x 100GE QSFP28/40GE QSFP+, 16x 25GE SFP28, 18x 10GE RJ45, 2x GE RJ45", storage:"2x 960 GB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-3200F", name:"FortiGate 3200F", sku:"FG-3200F", segment:"datacenter",
    desc:"2U com interfaces 400GE QSFP-DD — 387 Gbps FW, NGFW 47 Gbps, 12x 50GE SFP56.",
    form:"2 RU", fw_gbps:387, fw_text:"387 / 385 / 178,5 Gbps",
    ipsec_gbps:105, ips_gbps:63, ngfw_gbps:47, threat_gbps:45,
    latency:"3,42 µs", sessions_m:70, sessions_text:"70 M", new_sessions:800000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:11, ssl_vpn_users:30000,
    ssl_inspect:29, appctrl_gbps:109,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"4x 400GE QSFP-DD, 12x 50GE SFP56, 4x 25GE SFP28, 2x 10GE RJ45", storage:"2x 960 GB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-3500F", name:"FortiGate 3500F", sku:"FG-3500F", segment:"datacenter",
    desc:"2U alta densidade — 595 Gbps FW, 32x 25GE SFP28, NGFW 65 Gbps. Suporte a hyperscale license.",
    form:"2 RU", fw_gbps:595, fw_text:"595 / 590 / 420 Gbps",
    ipsec_gbps:165, ips_gbps:72, ngfw_gbps:65, threat_gbps:63,
    latency:"2,98 µs", sessions_m:140, sessions_text:"140 M / 348 M*", new_sessions:1000000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:16, ssl_vpn_users:30000,
    ssl_inspect:63, appctrl_gbps:135,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"6x 100GE QSFP28/40GE QSFP+, 32x 25GE SFP28, 2x GE RJ45", storage:"2x 1,92 TB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-3500G", name:"FortiGate 3500G", sku:"FG-3500G", segment:"datacenter",
    desc:"2U com 400GE QSFP-DD e NP8 — 595 Gbps FW, NGFW 115 Gbps, SSL Inspect 112 Gbps.",
    form:"2 RU", fw_gbps:595, fw_text:"595 / 590 / 420 Gbps",
    ipsec_gbps:163, ips_gbps:125, ngfw_gbps:115, threat_gbps:105,
    latency:"2,96 µs", sessions_m:179, sessions_text:"179 M", new_sessions:1100000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:9.8, ssl_vpn_users:30000,
    ssl_inspect:112, appctrl_gbps:197,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"2x 400GE QSFP-DD, 4x 100GE QSFP28, 30x 25GE SFP28, 2x 10GE RJ45", storage:"2x 1,92 TB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-3700F", name:"FortiGate 3700F", sku:"FG-3700F", segment:"datacenter",
    desc:"2U ultra-baixa latência (ULL) — 589 Gbps FW, portas 25GE ULL para ambientes financeiros e HFT.",
    form:"2 RU", fw_gbps:589, fw_text:"589 / 589 / 420 Gbps",
    ipsec_gbps:160, ips_gbps:86, ngfw_gbps:80, threat_gbps:75,
    latency:"3,56 / 1,45 µs (ULL)", sessions_m:140, sessions_text:"140 M", new_sessions:930000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:16, ssl_vpn_users:30000,
    ssl_inspect:55, appctrl_gbps:190,
    fortiaps:"4096 / 2048", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"4x 400GE QSFP-DD, 4x ULL 25GE SFP28, 20x 50GE SFP56, 2x 10GE RJ45", storage:"2x 1,92 TB", psu:"Dual", variants:null, has_wifi:0
  },
  {
    id:"FG-3800G", name:"FortiGate 3800G", sku:"FG-3800G", segment:"datacenter",
    desc:"3U carrier-grade NP8 — 795 Gbps FW, NGFW 210 Gbps, interfaces 400GE. 4 PSUs redundantes. Variante DC.",
    form:"3 RU", fw_gbps:795, fw_text:"795 / 793 / 453 Gbps",
    ipsec_gbps:210, ips_gbps:250, ngfw_gbps:210, threat_gbps:200,
    latency:"3,53 µs", sessions_m:210, sessions_text:"210 M / 450 M*", new_sessions:1100000,
    fw_policies:400000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:27, ssl_vpn_users:30000,
    ssl_inspect:120, appctrl_gbps:315,
    fortiaps:"8192 / 4096", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"4x 400GE, 6x 200GE QSFP56, 18x 50GE SFP56, 2x 10GE RJ45", storage:"2x 1,92 TB", psu:"4 PS", variants:"DC", has_wifi:0
  },
  {
    id:"FG-4200F", name:"FortiGate 4200F", sku:"FG-4200F", segment:"datacenter",
    desc:"3U hiperescala — 800 Gbps FW, NGFW 47 Gbps, 8192 FortiAPs gerenciados. Variante DC.",
    form:"3 RU", fw_gbps:800, fw_text:"800 / 788 / 400 Gbps",
    ipsec_gbps:210, ips_gbps:52, ngfw_gbps:47, threat_gbps:45,
    latency:"3,02 µs", sessions_m:210, sessions_text:"210 M / 450 M*", new_sessions:1000000,
    fw_policies:400000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:16, ssl_vpn_users:30000,
    ssl_inspect:50, appctrl_gbps:135,
    fortiaps:"8192 / 4096", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"8x 100GE QSFP28/40GE QSFP+, 18x 25GE SFP28, 2x GE RJ45", storage:"2x 1,92 TB", psu:"Dual", variants:"DC", has_wifi:0
  },
  {
    id:"FG-4400F", name:"FortiGate 4400F", sku:"FG-4400F", segment:"datacenter",
    desc:"4U — 1,15 Tbps FW, NGFW 82 Gbps, 12x 100GE QSFP28. Suporte a hyperscale license. Variante DC.",
    form:"4 RU", fw_gbps:1150, fw_text:"1,15 / 1,14 / 0,50 Tbps",
    ipsec_gbps:310, ips_gbps:94, ngfw_gbps:82, threat_gbps:75,
    latency:"2,98 µs", sessions_m:210, sessions_text:"210 M / 700 M*", new_sessions:1000000,
    fw_policies:400000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:16, ssl_vpn_users:30000,
    ssl_inspect:86, appctrl_gbps:140,
    fortiaps:"8192 / 4096", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"12x 100GE QSFP28/40GE QSFP+, 20x 25GE SFP28, 2x GE RJ45", storage:"2x 1,92 TB", psu:"4 PS", variants:"DC", has_wifi:0
  },
  {
    id:"FG-4800F", name:"FortiGate 4800F", sku:"FG-4800F", segment:"datacenter",
    desc:"4U máxima performance NP7 — 3,1 Tbps FW, IPsec 800 Gbps, interfaces 400GE e 200GE QSFP56. NEBS.",
    form:"4 RU", fw_gbps:3100, fw_text:"3,1 / 3,1 / 0,93 Tbps",
    ipsec_gbps:800, ips_gbps:87, ngfw_gbps:77, threat_gbps:75,
    latency:"3,60 µs", sessions_m:280, sessions_text:"280 M / 1,8 B*", new_sessions:915000,
    fw_policies:400000, gw_ipsec:40000, cli_ipsec:200000,
    ssl_vpn_gbps:18, ssl_vpn_users:30000,
    ssl_inspect:63, appctrl_gbps:180,
    fortiaps:"8192 / 4096", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"8x 400GE, 12x 200GE QSFP56, 12x 50GE SFP56, 2x 10GE RJ45", storage:"2x 1,92 TB", psu:"4 PS", variants:"DC, NEBS", has_wifi:0
  },
  {
    id:"FG-7081F", name:"FortiGate 7081F", sku:"FG-7081F", segment:"datacenter",
    desc:"12U chassis ISP/Core — 1,89 Tbps FW, NGFW 330 Gbps, IPS 405 Gbps, 6 PSUs. Máximo 256 FortiSwitches.",
    form:"12 RU", fw_gbps:1890, fw_text:"1,89 / 1,88 / 1,129 Tbps",
    ipsec_gbps:378, ips_gbps:405, ngfw_gbps:330, threat_gbps:312,
    latency:"7,5 µs", sessions_m:600, sessions_text:"600 M", new_sessions:5400000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:260000,
    ssl_vpn_gbps:13.7, ssl_vpn_users:30000,
    ssl_inspect:324, appctrl_gbps:900,
    fortiaps:"—", fortiswitches:256, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"Varied (chassis modular)", storage:"4x 4 TB SSD", psu:"6 PS", variants:"DC", has_wifi:0
  },
  {
    id:"FG-7121F", name:"FortiGate 7121F", sku:"FG-7121F", segment:"datacenter",
    desc:"16U chassis máxima capacidade — 1,89 Tbps FW, NGFW 550 Gbps, IPS 675 Gbps, 8 PSUs. 1 bilhão de sessões.",
    form:"16 RU", fw_gbps:1890, fw_text:"1,89 / 1,88 / 1,129 Tbps",
    ipsec_gbps:630, ips_gbps:675, ngfw_gbps:550, threat_gbps:520,
    latency:"7,5 µs", sessions_m:1000, sessions_text:"1 B", new_sessions:9000000,
    fw_policies:200000, gw_ipsec:40000, cli_ipsec:260000,
    ssl_vpn_gbps:13.7, ssl_vpn_users:30000,
    ssl_inspect:540, appctrl_gbps:1500,
    fortiaps:"—", fortiswitches:300, fortitokens:20000, vdoms:"10 / 500",
    interfaces:"Varied (chassis modular)", storage:"4x 4 TB SSD", psu:"8 PS", variants:"DC", has_wifi:0
  }
];

db.exec('BEGIN');
for (const m of models) insert.run(m);
db.exec('COMMIT');

console.log(`FortiGate: ${models.length} modelos inseridos em db/models.db.`);
db.close();
