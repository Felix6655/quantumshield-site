import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { QSWallet } from "./wallet.js";
import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore, getKemPublicHex, getKemSecretHex, relabelWallet } from "./keystore.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx, encryptMemoForRecipient, decryptMemoWithSecret } from "./core/tx.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { getDefaultAddress, setDefaultAddress } from "./core/config.js";
import { addContact, listContacts, getContactByAddress, getContactByLabel } from "./core/contacts.js";
import { makePayURI } from "./core/uri.js";
import qrcode from "qrcode-terminal";

const args = process.argv.slice(2);
const cmd = args[0] ?? "gen";

function log(o: unknown) { console.log(JSON.stringify(o, null, 2)); }
async function ask(prompt: string): Promise<string> { const rl = readline.createInterface({ input, output }); const val = await rl.question(prompt); rl.close(); return val; }
function getFlag(name: string): string | undefined { const i = args.findIndex(a => a === `--${name}`); return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined; }
async function askPassphrase(): Promise<string> { const fromEnv = process.env.QS_PASSPHRASE; if (fromEnv && fromEnv.length > 0) return fromEnv; return ask("Enter passphrase (visible input): "); }

switch (cmd) {
  /* keep previous commands... (shortened for brevity) */
  case "ks:init": { log(await initKeystore()); break; }
  case "ks:add": { const label = getFlag("label"); const pass = await askPassphrase(); log(await addWalletToKeystore(pass, label)); break; }
  case "ks:add:mn": { const mnemonic = args.slice(1).join(" ").trim(); if (mnemonic.split(" ").length < 12) { console.error("Usage: npm run ks:add:mn -- <mnemonic>"); process.exit(1); } const pass = await askPassphrase(); log(await addWalletFromMnemonic(pass, mnemonic)); break; }
  case "ks:list": { log({ items: await listWallets() }); break; }
  case "ks:show": { const address = args[1]; if (!address) { console.error("Usage: npm run ks:show -- <address>"); process.exit(1); } const pass = await askPassphrase(); log(await showWallet(address, pass)); break; }
  case "ks:label": { const address = args[1]; const label = getFlag("label") ?? ""; if (!address || !label) { console.error("Usage: npm run ks:label -- <address> --label <name>"); process.exit(1); } log(await relabelWallet(address, label)); break; }

  case "state:init": { const chainId = getFlag("chain") ?? "qs-local"; log(await initState(chainId)); break; }
  case "state:fund": { const to = getFlag("to") ?? ""; const amount = getFlag("amount") ?? "0"; if (!isValidAddress(to)) { console.error("Usage: npm run state:fund -- --to <qs1...> --amount <int>"); process.exit(1); } log(await fundAddress(to, amount)); break; }
  case "state:balance": { const addr = getFlag("addr") ?? ""; if (!isValidAddress(addr)) { console.error("Usage: npm run state:balance -- --addr <qs1...>"); process.exit(1); } log(await balanceOf(addr)); break; }

  case "kem:pub": { const addr = args[1] ?? (await getDefaultAddress()) ?? ""; if (!addr) { console.error("Usage: npm run kem:pub -- <address>"); process.exit(1); } log({ address: addr, kemPublicHex: await getKemPublicHex(addr) }); break; }
  case "contacts:add": { const address = getFlag("addr") ?? ""; const label = getFlag("label") ?? ""; const kem = getFlag("kem") ?? ""; const note = getFlag("note"); if (!isValidAddress(address) || !label || kem.length < 32) { console.error("Usage: npm run contacts:add -- --addr <qs1...> --label <name> --kem <hex> [--note <...>]"); process.exit(1); } log(await addContact(address, label, kem.toLowerCase(), note)); break; }
  case "contacts:list": { log({ items: await listContacts() }); break; }

  case "tx:send:enc": {
    const toLabel = getFlag("toLabel"); const toAddr = getFlag("to"); const amount = getFlag("amount") ?? "0"; const memo = getFlag("memo") ?? "";
    const fromArg = getFlag("from"); const pass = await askPassphrase();
    const from = fromArg || (await getDefaultAddress()) || "";
    const contact = toLabel ? (await getContactByLabel(toLabel)) : (toAddr ? await getContactByAddress(toAddr) : null);
    const to = contact?.address ?? toAddr ?? "";
    if (!isValidAddress(from) || !isValidAddress(to) || !contact?.kemPublicHex) { console.error("Need valid from/to and contact with kem pub"); process.exit(1); }
    const b = await balanceOf(from); const w = await loadWalletFromKeystore(from, pass);
    const memoEnc = encryptMemoForRecipient(memo, contact.kemPublicHex);
    const txSigned = signTx(w, { from, to, amount, nonce: b.nonce, memoEnc });
    const applied = await applyTx(txSigned);
    log({ info: "Sent encrypted memo tx", txHash: applied.hash, tx: txSigned });
    break;
  }
  case "tx:open": {
    const forAddr = getFlag("for") ?? (await getDefaultAddress()) ?? "";
    if (!isValidAddress(forAddr)) { console.error("Usage: npm run tx:open -- --for <qs1...> (or set default)"); process.exit(1); }
    const pass = await askPassphrase();
    const kemSecretHex = await getKemSecretHex(forAddr, pass);
    const json = await ask("Paste tx JSON then Enter: "); const tx = JSON.parse(json) as Tx;
    if (!tx.memoEnc) { console.error("No memoEnc on tx"); process.exit(1); }
    const msg = decryptMemoWithSecret(tx.memoEnc, kemSecretHex);
    log({ to: forAddr, decryptedMemo: msg });
    break;
  }

  /* ===== New: URI + QR ===== */
  case "uri:pay": {
    const to = getFlag("to") ?? ""; const amount = getFlag("amount"); const memo = getFlag("memo");
    if (!isValidAddress(to)) { console.error("Usage: npm run uri:pay -- --to <qs1...> [--amount <int>] [--memo <text>]"); process.exit(1); }
    const uri = makePayURI(to, amount, memo);
    log({ uri });
    break;
  }
  case "qr:addr": {
    const addr = args[1] ?? (await getDefaultAddress()) ?? "";
    if (!isValidAddress(addr)) { console.error("Usage: npm run qr:addr -- <qs1...> (or set default)"); process.exit(1); }
    qrcode.generate(addr, { small: true });
    log({ address: addr });
    break;
  }
  case "qr:pay": {
    const to = getFlag("to") ?? ""; const amount = getFlag("amount"); const memo = getFlag("memo");
    if (!isValidAddress(to)) { console.error("Usage: npm run qr:pay -- --to <qs1...> [--amount <int>] [--memo <text>]"); process.exit(1); }
    const uri = makePayURI(to, amount, memo);
    qrcode.generate(uri, { small: true });
    log({ uri });
    break;
  }

  default: {
    // quick gen kept for convenience
    const w = QSWallet.newRandom();
    log({ info: "Generated QS keypair (STUB/ML-DSA based on env).", ...w.export() });
    break;
  }
}
