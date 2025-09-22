import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { openapi } from "./api/openapi.js";
import { WebSocketServer } from "ws";

import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore, getKemPublicHex } from "./keystore.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx, encryptMemoForRecipient } from "./core/tx.js";
import { makeBackup, listBackups, restoreBackup } from "./core/backup.js";
import { addContact, listContacts, getContactByAddress, getContactByLabel } from "./core/contacts.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// Serve static dashboard from /public
app.use(express.static("public"));

const PORT = Number(process.env.QS_API_PORT ?? 4011);
const API_KEY = process.env.QS_API_KEY;

// Rate limit (per IP)
const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

// Health (no auth)
app.get("/health", (_req, res) => { res.json({ ok: true, service: "QuantumShield API", version: "0.9.0" }); });

// OpenAPI/Swagger
app.get("/openapi.json", (_req, res) => res.json(openapi));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi as any));

// API key middleware (optional; after /health and /docs)
/* If QS_API_KEY is set, all endpoints below require X-QS-Api-Key */
app.use((req, res, next) => {
  if (!API_KEY) return next();
  const provided = (req.headers["x-qs-api-key"] as string) || "";
  if (provided !== API_KEY) return res.status(401).json({ error: "Unauthorized" });
  next();
});

function getPass(req: express.Request): string | undefined {
  return (req.headers["x-qs-passphrase"] as string) || process.env.QS_PASSPHRASE;
}

/* ====== WebSocket ====== */
const server = app.listen(PORT, () => { console.log(`QS API listening on http://localhost
# === QuantumShield (QS)  Minimal Web Dashboard (served by the API) ===
# Adds a static HTML+JS dashboard at http://localhost:4011/ that talks to the API and /ws.
# Run inside your QS project folder (PowerShell). This will:
# - Serve / (wallet dashboard), /docs (Swagger), /ws (events)
# - Create wallets, view balances, fund, send tx (plaintext), send tx with encrypted memo
# - Watch live events stream

# 1) Update server to serve static dashboard + new endpoints (contacts, kem pub, enc send)
(Get-Content src/server.ts) -join "`n" | Set-Content -Encoding UTF8 src/server.bak4.ts

@'
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { openapi } from "./api/openapi.js";
import { WebSocketServer } from "ws";

import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore, getKemPublicHex } from "./keystore.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx, encryptMemoForRecipient } from "./core/tx.js";
import { makeBackup, listBackups, restoreBackup } from "./core/backup.js";
import { addContact, listContacts, getContactByAddress, getContactByLabel } from "./core/contacts.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// Serve static dashboard from /public
app.use(express.static("public"));

const PORT = Number(process.env.QS_API_PORT ?? 4011);
const API_KEY = process.env.QS_API_KEY;

// Rate limit (per IP)
const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

// Health (no auth)
app.get("/health", (_req, res) => { res.json({ ok: true, service: "QuantumShield API", version: "0.9.0" }); });

// OpenAPI/Swagger
app.get("/openapi.json", (_req, res) => res.json(openapi));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi as any));

// API key middleware (optional; after /health and /docs)
/* If QS_API_KEY is set, all endpoints below require X-QS-Api-Key */
app.use((req, res, next) => {
  if (!API_KEY) return next();
  const provided = (req.headers["x-qs-api-key"] as string) || "";
  if (provided !== API_KEY) return res.status(401).json({ error: "Unauthorized" });
  next();
});

function getPass(req: express.Request): string | undefined {
  return (req.headers["x-qs-passphrase"] as string) || process.env.QS_PASSPHRASE;
}

/* ====== WebSocket ====== */
const server = app.listen(PORT, () => { console.log(`QS API listening on http://localhost:${PORT}`); });
const wss = new WebSocketServer({ server, path: "/ws" });
function broadcast(evt: any) {
  const data = JSON.stringify(evt);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(data);
  }
}

/* ===== Keystore ===== */
app.post("/keystore/init", async (_req, res) => {
  try { const out = await initKeystore(); res.json(out); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.get("/keystore/list", async (_req, res) => {
  try { const items = await listWallets(); res.json({ count: items.length, items }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.post("/keystore/add", async (req, res) => {
  try {
    const pass = getPass(req); if (!pass) return res.status(400).json({ error: "Missing passphrase." });
    const out = await addWalletToKeystore(pass);
    res.json(out);
    broadcast({ type: "wallet_added", at: Date.now(), wallet: out });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.post("/keystore/add-mnemonic", async (req, res) => {
  try {
    const pass = getPass(req); const { mnemonic, index, label } = req.body || {};
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });
    if (!mnemonic || typeof mnemonic !== "string") return res.status(400).json({ error: "mnemonic (string) required" });
    const out = await addWalletFromMnemonic(pass, mnemonic.trim(), Number(index ?? 0), label);
    res.json(out);
    broadcast({ type: "wallet_added", at: Date.now(), wallet: out });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== KEM pub for a local wallet ===== */
app.get("/kem/pub/:addr", async (req, res) => {
  try {
    const addr = req.params.addr;
    if (!isValidAddress(addr)) return res.status(400).json({ error: "invalid address" });
    const kemPublicHex = await getKemPublicHex(addr);
    res.json({ address: addr, kemPublicHex });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== Contacts ===== */
app.post("/contacts/add", async (req, res) => {
  try {
    const { addr, label, kemPublicHex, note } = req.body || {};
    if (!isValidAddress(addr)) return res.status(400).json({ error: "invalid address" });
    if (!label || typeof kemPublicHex !== "string" || kemPublicHex.length < 32) return res.status(400).json({ error: "label and kemPublicHex required" });
    const out = await addContact(addr, label, kemPublicHex.toLowerCase(), note);
    res.json(out);
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.get("/contacts/list", async (_req, res) => {
  try { res.json({ items: await listContacts() }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== State / balances ===== */
app.post("/state/init", async (req, res) => {
  try { const { chainId } = req.body || {}; const out = await initState(chainId ?? "qs-local"); res.json(out); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.post("/state/fund", async (req, res) => {
  try {
    const { to, amount } = req.body || {};
    if (!to || !isValidAddress(to)) return res.status(400).json({ error: "to must be a valid qs1 address" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    const out = await fundAddress(to, String(amount));
    res.json(out);
    broadcast({ type: "funded", at: Date.now(), to: out.address, amount: String(amount), balance: out.balance });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.get("/state/balance/:addr", async (req, res) => {
  try { const addr = req.params.addr; if (!isValidAddress(addr)) return res.status(400).json({ error: "invalid address" }); res.json(await balanceOf(addr)); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== TX (plaintext memo) ===== */
app.post("/tx/sign", async (req, res) => {
  try {
    const pass = getPass(req);
    const { from, to, amount, memo } = req.body || {};
    if (!isValidAddress(from) || !isValidAddress(to)) return res.status(400).json({ error: "from/to must be valid qs1 addresses" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });

    const b = await balanceOf(from); const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount: String(amount), nonce, memo });
    res.json({ tx });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.post("/tx/send", async (req, res) => {
  try {
    const pass = getPass(req);
    const { from, to, amount, memo } = req.body || {};
    if (!isValidAddress(from) || !isValidAddress(to)) return res.status(400).json({ error: "from/to must be valid qs1 addresses" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });

    const b = await balanceOf(from); const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount: String(amount), nonce, memo });
    const result = await applyTx(tx);
    res.json({ txHash: result.hash, from: result.from, to: result.to, tx });
    broadcast({ type: "tx_applied", at: Date.now(), hash: result.hash, from: result.from, to: result.to });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== TX (encrypted memo via KEM) ===== */
app.post("/tx/send-enc", async (req, res) => {
  try {
    const pass = getPass(req);
    const { from, to, amount, memo, recipientKemPublicHex, toLabel, toAddress } = req.body || {};
    const dest = to ?? toAddress;

    if (!isValidAddress(from)) return res.status(400).json({ error: "from must be valid qs1 address" });

    // Allow either direct 'to' or contact label/address
    let toFinal: string | null = null;
    let kemHex: string | null = recipientKemPublicHex || null;

    if (dest && isValidAddress(dest)) {
      toFinal = dest;
    } else if (toLabel) {
      const c = await getContactByLabel(toLabel);
      toFinal = c?.address ?? null;
      kemHex = kemHex ?? c?.kemPublicHex ?? null;
    } else if (toAddress) {
      const c = await getContactByAddress(toAddress);
      toFinal = c?.address ?? null;
      kemHex = kemHex ?? c?.kemPublicHex ?? null;
    }
    if (!toFinal || !isValidAddress(toFinal)) return res.status(400).json({ error: "to address missing/invalid" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });
    if (!kemHex || kemHex.length < 32) return res.status(400).json({ error: "recipientKemPublicHex required (or set up contact)" });

    const b = await balanceOf(from); const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const memoEnc = encryptMemoForRecipient(String(memo ?? ""), kemHex);
    const tx = signTx(w, { from, to: toFinal, amount: String(amount), nonce, memoEnc });
    const result = await applyTx(tx);
    res.json({ txHash: result.hash, from: result.from, to: result.to, tx });
    broadcast({ type: "tx_applied", at: Date.now(), hash: result.hash, from: result.from, to: result.to });
  } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

app.post("/tx/verify", (req, res) => {
  try { const tx = (req.body || {}).tx as Tx; if (!tx) return res.status(400).json({ error: "tx JSON required in body" }); res.json({ ok: verifyTx(tx) }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});

/* ===== Backups ===== */
app.post("/backup/make", async (req, res) => {
  try { const pass = getPass(req); if (!pass) return res.status(400).json({ error: "Missing passphrase." }); const out = await makeBackup(pass); res.json(out); broadcast({ type: "backup_made", at: Date.now(), file: out.file }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
app.get("/backup/list", async (_req, res) => { try { res.json({ files: await listBackups() }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); } });
app.post("/backup/restore", async (req, res) => {
  try { const pass = getPass(req); const { file } = req.body || {}; if (!pass) return res.status(400).json({ error: "Missing passphrase." }); if (!file) return res.status(400).json({ error: "file required" }); const out = await restoreBackup(pass, file); res.json(out); broadcast({ type: "backup_restored", at: Date.now(), file }); } catch (e: any) { res.status(500).json({ error: e?.message ?? String(e) }); }
});
