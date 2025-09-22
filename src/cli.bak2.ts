import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { QSWallet } from "./wallet.js";
import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore, saveMnemonic, loadMnemonic, nextDerivationIndex, relabelWallet } from "./keystore.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx } from "./core/tx.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { getDefaultAddress, setDefaultAddress } from "./core/config.js";

const args = process.argv.slice(2);
const cmd = args[0] ?? "gen";

function log(o: unknown) { console.log(JSON.stringify(o, null, 2)); }

async function ask(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const val = await rl.question(prompt);
  rl.close();
  return val;
}
function getFlag(name: string): string | undefined {
  const i = args.findIndex(a => a === `--${name}`);
  if (i >= 0 && i + 1 < args.length) return args[i + 1];
  return undefined;
}
async function askPassphrase(): Promise<string> {
  const fromEnv = process.env.QS_PASSPHRASE;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return ask("Enter passphrase (visible input): ");
}

switch (cmd) {
  // Wallet basics
  case "gen": {
    const w = QSWallet.newRandom();
    log({ info: "Generated QS keypair (STUB).", ...w.export() });
    break;
  }
  case "addr": {
    const sk = args[1]; if (!sk) { console.error("Usage: npm run addr:from -- <secretKeyHex>"); process.exit(1); }
    const w = QSWallet.fromSecretKeyHex(sk);
    log({ info: "Derived wallet (STUB).", ...w.export() });
    break;
  }
  case "sign": {
    const message = args[1] ?? "hello";
    const w = QSWallet.newRandom();
    const sig = w.sign(message);
    log({ info: "Signed message (STUB).", address: w.address, scheme: w.export().scheme, message, signatureHex: sig.signatureHex, verified: sig.ok });
    break;
  }

  // Keystore
  case "ks:init": {
    log({ info: "Keystore init", ...(await initKeystore()) });
    break;
  }
  case "ks:add": {
    const label = getFlag("label");
    const pass = await askPassphrase();
    log({ info: "Added wallet to keystore", ...(await addWalletToKeystore(pass, label)) });
    break;
  }
  case "ks:list": {
    const items = await listWallets();
    log({ info: "Wallets in keystore", count: items.length, items });
    break;
  }
  case "ks:show": {
    const address = args[1]; if (!address) { console.error("Usage: npm run ks:show -- <address>"); process.exit(1); }
    const pass = await askPassphrase();
    log({ info: "Decrypted wallet", ...(await showWallet(address, pass)) });
    break;
  }
  case "ks:label": {
    const address = args[1]; const label = getFlag("label") ?? "";
    if (!address || !label) { console.error("Usage: npm run ks:label -- <address> --label <name>"); process.exit(1); }
    log({ info: "Updated label", ...(await relabelWallet(address, label)) });
    break;
  }

  // Mnemonic vault + account derivation
  case "mnemonic:new": {
    const wordsNum = Number(args[1] ?? "24");
    const m = QSWallet.generateMnemonic(wordsNum === 12 ? 12 : 24);
    log({ info: "Write this down and store safely", mnemonic: m });
    break;
  }
  case "mnemonic:save": {
    const mnemonic = args.slice(1).join(" ").trim();
    if (mnemonic.split(" ").length < 12) { console.error("Usage: npm run mnemonic:save -- <mnemonic words...>"); process.exit(1); }
    const pass = await askPassphrase();
    log({ info: "Mnemonic saved (encrypted)", ...(await saveMnemonic(pass, mnemonic)) });
    break;
  }
  case "mnemonic:show": {
    const pass = await askPassphrase();
    log({ mnemonic: await loadMnemonic(pass) });
    break;
  }
  case "acct:derive": {
    const pass = await askPassphrase();
    const label = getFlag("label");
    const idxArg = getFlag("index");
    const idx = idxArg ? Number(idxArg) : await nextDerivationIndex();
    const mnemonic = await loadMnemonic(pass);
    log({ info: "Derived account", ...(await addWalletFromMnemonic(pass, mnemonic, idx, label ?? `acct-${idx}`)) });
    break;
  }

  // Default wallet
  case "default:set": {
    const addr = args[1];
    if (!addr) { console.error("Usage: npm run default:set -- <address>"); process.exit(1); }
    log({ info: "Default address set", ...(await setDefaultAddress(addr)) });
    break;
  }
  case "default:get": {
    log({ defaultAddress: await getDefaultAddress() });
    break;
  }

  // State / balances
  case "state:init": {
    const chainId = getFlag("chain") ?? "qs-local";
    log({ info: "State init", ...(await initState(chainId)) });
    break;
  }
  case "state:fund": {
    const to = getFlag("to") ?? ""; const amount = getFlag("amount") ?? "0";
    if (!isValidAddress(to)) { console.error("Usage: npm run state:fund -- --to <qs1...> --amount <int>"); process.exit(1); }
    log({ info: "Funded", ...(await fundAddress(to, amount)) });
    break;
  }
  case "state:balance": {
    const addr = getFlag("addr") ?? "";
    if (!isValidAddress(addr)) { console.error("Usage: npm run state:balance -- --addr <qs1...>"); process.exit(1); }
    log(await balanceOf(addr));
    break;
  }

  // TX
  case "ks:sign:tx": {
    const from = getFlag("from") ?? ""; const to = getFlag("to") ?? ""; const amount = getFlag("amount") ?? "0"; const memo = getFlag("memo");
    if (!isValidAddress(from) || !isValidAddress(to)) { console.error("Need --from and --to as qs1..."); process.exit(1); }
    const pass = await askPassphrase();
    const b = await balanceOf(from); const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount, nonce, memo });
    log({ info: "Signed tx with keystore wallet", tx });
    break;
  }
  case "tx:send": {
    const fromArg = getFlag("from") ?? "";
    const to = getFlag("to") ?? "";
    const amount = getFlag("amount") ?? "0";
    const memo = getFlag("memo");
    const pass = await askPassphrase();

    const from = fromArg || (await getDefaultAddress()) || "";
    if (!isValidAddress(from) || !isValidAddress(to)) { console.error("Need --from (or set default) and --to as qs1..."); process.exit(1); }
    const b = await balanceOf(from); const nonce = b.nonce;
    const w = await loadWalletFromKeystore(from, pass);
    const tx = signTx(w, { from, to, amount, nonce, memo });
    const res = await applyTx(tx);
    log({ info: "Sent tx", txHash: res.hash, from: res.from, to: res.to });
    break;
  }

  default: { console.error(`Unknown command: ${cmd}`); process.exit(1); }
}
