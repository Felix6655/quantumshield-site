import "dotenv/config";
import express from "express";
import cors from "cors";

import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore } from "./keystore.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx } from "./core/tx.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.QS_API_PORT ?? 4011);

// Helper: get passphrase from header or env
function getPass(req: express.Request): string | undefined {
  return (req.headers["x-qs-passphrase"] as string) || process.env.QS_PASSPHRASE;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "QuantumShield API", version: "0.4.0" });
});

/* ===== Keystore ===== */
app.post("/keystore/init", async (_req, res) => {
  try {
    const out = await initKeystore();
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.get("/keystore/list", async (_req, res) => {
  try {
    const items = await listWallets();
    res.json({ count: items.length, items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/keystore/add", async (req, res) => {
  try {
    const pass = getPass(req);
    if (!pass) return res.status(400).json({ error: "Missing passphrase. Use header X-QS-Passphrase or env QS_PASSPHRASE." });
    const out = await addWalletToKeystore(pass);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/keystore/add-mnemonic", async (req, res) => {
  try {
    const pass = getPass(req);
    const { mnemonic } = req.body || {};
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });
    if (!mnemonic || typeof mnemonic !== "string") return res.status(400).json({ error: "mnemonic (string) required" });
    const out = await addWalletFromMnemonic(pass, mnemonic.trim());
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/keystore/show", async (req, res) => {
  try {
    const pass = getPass(req);
    const { address } = req.body || {};
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });
    if (!address) return res.status(400).json({ error: "address required" });
    const out = await showWallet(address, pass);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

/* ===== State / balances ===== */
app.post("/state/init", async (req, res) => {
  try {
    const { chainId } = req.body || {};
    const out = await initState(chainId ?? "qs-local");
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/state/fund", async (req, res) => {
  try {
    const { to, amount } = req.body || {};
    if (!to || !isValidAddress(to)) return res.status(400).json({ error: "to must be a valid qs1 address" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    const out = await fundAddress(to, String(amount));
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.get("/state/balance/:addr", async (req, res) => {
  try {
    const addr = req.params.addr;
    if (!isValidAddress(addr)) return res.status(400).json({ error: "invalid address" });
    const out = await balanceOf(addr);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

/* ===== Transactions ===== */
app.post("/tx/sign", async (req, res) => {
  try {
    const pass = getPass(req);
    const { from, to, amount, memo } = req.body || {};
    if (!isValidAddress(from) || !isValidAddress(to)) return res.status(400).json({ error: "from/to must be valid qs1 addresses" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });

    const b = await balanceOf(from);
    const nonce = b.nonce;

    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount: String(amount), nonce, memo });
    res.json({ tx });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/tx/send", async (req, res) => {
  try {
    const pass = getPass(req);
    const { from, to, amount, memo } = req.body || {};
    if (!isValidAddress(from) || !isValidAddress(to)) return res.status(400).json({ error: "from/to must be valid qs1 addresses" });
    if (!amount) return res.status(400).json({ error: "amount required" });
    if (!pass) return res.status(400).json({ error: "Missing passphrase." });

    const b = await balanceOf(from);
    const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount: String(amount), nonce, memo });

    const result = await applyTx(tx);
    res.json({ txHash: result.hash, from: result.from, to: result.to, tx });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.post("/tx/verify", (req, res) => {
  try {
    const tx = req.body?.tx as Tx;
    if (!tx) return res.status(400).json({ error: "tx JSON required in body" });
    const ok = verifyTx(tx);
    res.json({ ok });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`QS API listening on http://localhost:${PORT}`);
});
