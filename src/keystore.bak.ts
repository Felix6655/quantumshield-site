import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from "node:crypto";
import { QSWallet } from "./wallet.js";
import { hexToU8 } from "./utils/codec.js";

type CipherRecord = {
  algo: "aes-256-gcm";
  kdf: "scrypt";
  saltHex: string;
  ivHex: string;
  tagHex: string;
  ctHex: string;
};

type WalletRecord = {
  address: string;
  scheme: string;
  publicKeyHex: string;
  cipher: CipherRecord;
  createdAt: string;
  label?: string;
  index?: number; // derivation index (if from mnemonic)
};

type Keystore = {
  version: 1;
  wallets: WalletRecord[];
};

const QS_DIR = path.join(process.cwd(), ".qs");
const KS_FILE = path.join(QS_DIR, "keys.json");
const MN_FILE = path.join(QS_DIR, "mnemonic.enc");

async function exists(p: string) { try { await fs.stat(p); return true; } catch { return false; } }

async function loadKs(): Promise<Keystore> {
  if (!(await exists(KS_FILE))) return { version: 1, wallets: [] };
  const raw = await fs.readFile(KS_FILE, "utf8");
  return JSON.parse(raw) as Keystore;
}
async function saveKs(data: Keystore) {
  await fs.mkdir(QS_DIR, { recursive: true });
  await fs.writeFile(KS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function deriveKey(pass: string, saltHex?: string) {
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);
  const key = scryptSync(pass, salt, 32);
  return { key, saltHex: salt.toString("hex") };
}

function encryptHex(secretHex: string, pass: string): CipherRecord {
  const { key, saltHex } = deriveKey(pass);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(Buffer.from(secretHex, "hex")), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { algo: "aes-256-gcm", kdf: "scrypt", saltHex, ivHex: iv.toString("hex"), tagHex: tag.toString("hex"), ctHex: ct.toString("hex") };
}
function decryptHex(rec: CipherRecord, pass: string): string {
  const { key } = deriveKey(pass, rec.saltHex);
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(rec.ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(rec.tagHex, "hex"));
  const pt = Buffer.concat([decipher.update(Buffer.from(rec.ctHex, "hex")), decipher.final()]);
  return pt.toString("hex");
}

function encryptUtf8(text: string, pass: string): CipherRecord {
  const { key, saltHex } = deriveKey(pass);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(Buffer.from(text, "utf8")), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { algo: "aes-256-gcm", kdf: "scrypt", saltHex, ivHex: iv.toString("hex"), tagHex: tag.toString("hex"), ctHex: ct.toString("hex") };
}
function decryptUtf8(rec: CipherRecord, pass: string): string {
  const { key } = deriveKey(pass, rec.saltHex);
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(rec.ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(rec.tagHex, "hex"));
  const pt = Buffer.concat([decipher.update(Buffer.from(rec.ctHex, "hex")), decipher.final()]);
  return pt.toString("utf8");
}

export async function initKeystore() {
  await fs.mkdir(QS_DIR, { recursive: true });
  if (!(await exists(KS_FILE))) {
    await saveKs({ version: 1, wallets: [] });
    return { created: true, file: KS_FILE };
  }
  return { created: false, file: KS_FILE };
}

export async function addWalletToKeystore(pass: string, label?: string) {
  if (!pass) throw new Error("Passphrase required. Set QS_PASSPHRASE env var.");
  const ks = await loadKs();

  const w = QSWallet.newRandom();
  const exp = w.export();
  const cipher = encryptHex(exp.secretKeyHex, pass);
  const record: WalletRecord = { address: exp.address, scheme: exp.scheme, publicKeyHex: exp.publicKeyHex, cipher, createdAt: new Date().toISOString(), label };
  ks.wallets.push(record);
  await saveKs(ks);
  return { address: record.address, scheme: record.scheme, publicKeyHex: record.publicKeyHex, label: record.label ?? null };
}

export async function addWalletFromMnemonic(pass: string, mnemonic: string, index = 0, label?: string) {
  if (!pass) throw new Error("Passphrase required.");
  const ks = await loadKs();

  const w = QSWallet.fromMnemonic(mnemonic, index);
  const exp = w.export();
  const cipher = encryptHex(exp.secretKeyHex, pass);
  const record: WalletRecord = { address: exp.address, scheme: exp.scheme, publicKeyHex: exp.publicKeyHex, cipher, createdAt: new Date().toISOString(), label, index };
  ks.wallets.push(record);
  await saveKs(ks);
  return { address: record.address, index: record.index ?? null, label: record.label ?? null };
}

export async function listWallets() {
  const ks = await loadKs();
  return ks.wallets.map(w => ({ address: w.address, scheme: w.scheme, createdAt: w.createdAt, label: w.label ?? null, index: w.index ?? null }));
}

export async function relabelWallet(address: string, newLabel: string) {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec) throw new Error("Address not found");
  rec.label = newLabel;
  await saveKs(ks);
  return { address: rec.address, label: rec.label };
}

export async function showWallet(address: string, pass: string) {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec) throw new Error("Address not found in keystore.");
  const secretKeyHex = decryptHex(rec.cipher, pass);
  return { address: rec.address, scheme: rec.scheme, publicKeyHex: rec.publicKeyHex, secretKeyHex, label: rec.label ?? null, index: rec.index ?? null };
}

export async function loadWalletFromKeystore(address: string, pass: string): Promise<QSWallet> {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec) throw new Error("Address not found in keystore.");
  const skHex = decryptHex(rec.cipher, pass);
  const pk = hexToU8(rec.publicKeyHex);
  const sk = hexToU8(skHex);
  return new QSWallet(pk, sk);
}

/* ===== Mnemonic vault (encrypted) ===== */

export async function saveMnemonic(pass: string, mnemonic: string) {
  if (!pass) throw new Error("Passphrase required.");
  const enc = encryptUtf8(mnemonic.trim(), pass);
  await fs.mkdir(QS_DIR, { recursive: true });
  await fs.writeFile(MN_FILE, JSON.stringify(enc, null, 2), "utf8");
  return { saved: true, file: MN_FILE };
}

export async function loadMnemonic(pass: string): Promise<string> {
  const raw = await fs.readFile(MN_FILE, "utf8");
  const enc = JSON.parse(raw) as CipherRecord;
  return decryptUtf8(enc, pass);
}

export async function nextDerivationIndex(): Promise<number> {
  const ks = await loadKs();
  const fromMn = ks.wallets.filter(w => typeof w.index === "number").map(w => w.index as number);
  return fromMn.length ? Math.max(...fromMn) + 1 : 0;
}
