import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from "node:crypto";
import { QSWallet } from "./wallet.js";
import { hexToU8, u8ToHex } from "./utils/codec.js";
import { getKemSuite } from "./crypto/kem.js";

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
  scheme: string;          // ML-DSA level used for signatures
  publicKeyHex: string;    // signing pub
  cipher: CipherRecord;    // encrypted signing secret
  createdAt: string;
  label?: string;
  index?: number;

  // NEW: ML-KEM keys for memo encryption
  kemPublicHex?: string;   // ML-KEM pub
  kemCipher?: CipherRecord;// encrypted ML-KEM secret
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
  return JSON.parse(await fs.readFile(KS_FILE, "utf8")) as Keystore;
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

function encHex(secretHex: string, pass: string): CipherRecord {
  const { key, saltHex } = deriveKey(pass);
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([c.update(Buffer.from(secretHex, "hex")), c.final()]);
  const tag = c.getAuthTag();
  return { algo: "aes-256-gcm", kdf: "scrypt", saltHex, ivHex: iv.toString("hex"), tagHex: tag.toString("hex"), ctHex: ct.toString("hex") };
}
function decHex(rec: CipherRecord, pass: string): string {
  const { key } = deriveKey(pass, rec.saltHex);
  const d = createDecipheriv("aes-256-gcm", key, Buffer.from(rec.ivHex, "hex"));
  d.setAuthTag(Buffer.from(rec.tagHex, "hex"));
  const pt = Buffer.concat([d.update(Buffer.from(rec.ctHex, "hex")), d.final()]);
  return pt.toString("hex");
}

/* ===== Public API ===== */
export async function initKeystore() {
  await fs.mkdir(QS_DIR, { recursive: true });
  if (!(await exists(KS_FILE))) { await saveKs({ version: 1, wallets: [] }); return { created: true, file: KS_FILE }; }
  return { created: false, file: KS_FILE };
}

async function ensureKemForRecord(rec: WalletRecord, pass: string) {
  if (rec.kemPublicHex && rec.kemCipher) return rec;
  const kem = getKemSuite();
  const { publicKey, secretKey } = kem.keygen();
  rec.kemPublicHex = u8ToHex(publicKey);
  rec.kemCipher = encHex(u8ToHex(secretKey), pass);
  return rec;
}

export async function addWalletToKeystore(pass: string, label?: string) {
  if (!pass) throw new Error("Passphrase required.");
  const ks = await loadKs();

  const w = QSWallet.newRandom();
  const exp = w.export();
  const rec: WalletRecord = {
    address: exp.address,
    scheme: exp.scheme,
    publicKeyHex: exp.publicKeyHex,
    cipher: encHex(exp.secretKeyHex, pass),
    createdAt: new Date().toISOString(),
    label
  };
  await ensureKemForRecord(rec, pass);
  ks.wallets.push(rec);
  await saveKs(ks);
  return { address: rec.address, scheme: rec.scheme, publicKeyHex: rec.publicKeyHex, kemPublicHex: rec.kemPublicHex!, label: rec.label ?? null };
}

export async function addWalletFromMnemonic(pass: string, mnemonic: string, index = 0, label?: string) {
  if (!pass) throw new Error("Passphrase required.");
  const ks = await loadKs();

  const w = QSWallet.fromMnemonic(mnemonic, index);
  const exp = w.export();

  // Derive deterministic KEM seed from mnemonic+index
  const kem = getKemSuite();
  // NOTE: hkdf used inside wallet for ML-DSA; here we simply use kem.keygen() with no seed.
  // If you want deterministic KEM, replace with your hkdf(seed,index) and slice(32).
  const { publicKey, secretKey } = kem.keygen();

  const rec: WalletRecord = {
    address: exp.address,
    scheme: exp.scheme,
    publicKeyHex: exp.publicKeyHex,
    cipher: encHex(exp.secretKeyHex, pass),
    createdAt: new Date().toISOString(),
    label, index,
    kemPublicHex: u8ToHex(publicKey),
    kemCipher: encHex(u8ToHex(secretKey), pass)
  };
  ks.wallets.push(rec);
  await saveKs(ks);
  return { address: rec.address, index: rec.index ?? null, label: rec.label ?? null, kemPublicHex: rec.kemPublicHex! };
}

export async function listWallets() {
  return (await loadKs()).wallets.map(w => ({
    address: w.address, scheme: w.scheme, createdAt: w.createdAt, label: w.label ?? null, index: w.index ?? null, kemPublicHex: w.kemPublicHex ?? null
  }));
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
  if (!rec.kemPublicHex || !rec.kemCipher) { await ensureKemForRecord(rec, pass); await saveKs(ks); }
  const secretKeyHex = decHex(rec.cipher, pass);
  const kemSecretHex = decHex(rec.kemCipher!, pass);
  return { address: rec.address, scheme: rec.scheme, publicKeyHex: rec.publicKeyHex, secretKeyHex, kemPublicHex: rec.kemPublicHex!, kemSecretHex, label: rec.label ?? null, index: rec.index ?? null };
}

export async function loadWalletFromKeystore(address: string, pass: string): Promise<QSWallet> {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec) throw new Error("Address not found in keystore.");
  if (!rec.kemPublicHex || !rec.kemCipher) { await ensureKemForRecord(rec, pass); await saveKs(ks); }
  const skHex = decHex(rec.cipher, pass);
  const pk = hexToU8(rec.publicKeyHex);
  const sk = hexToU8(skHex);
  return new QSWallet(pk, sk);
}

export async function getKemPublicHex(address: string): Promise<string> {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec?.kemPublicHex) throw new Error("No KEM key for address");
  return rec.kemPublicHex;
}
export async function getKemSecretHex(address: string, pass: string): Promise<string> {
  const ks = await loadKs();
  const rec = ks.wallets.find(w => w.address === address);
  if (!rec?.kemCipher) throw new Error("No KEM secret for address");
  return decHex(rec.kemCipher, pass);
}
