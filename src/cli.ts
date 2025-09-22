import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { QSWallet } from "./wallet.js";
import { initKeystore, addWalletToKeystore, listWallets, showWallet, addWalletFromMnemonic, loadWalletFromKeystore, getKemPublicHex, getKemSecretHex, relabelWallet } from "./keystore.js";
import { isValidAddress } from "./utils/address.js";
import { signTx, verifyTx, Tx, encryptMemoForRecipient, decryptMemoWithSecret } from "./core/tx.js";
import { initState, fundAddress, balanceOf, applyTx } from "./core/state.js";
import { getDefaultAddress, setDefaultAddress } from "./core/config.js";
import { recordAppliedTx, mineBlock, getTip, getTx as chainGetTx, listAddressTxs } from "./core/chain.js";
import { addContact, listContacts, getContactByAddress, getContactByLabel } from "./core/contacts.js";

const args = process.argv.slice(2);
const cmd = args[0] ?? "help";
const log = (o: unknown) => console.log(JSON.stringify(o, null, 2));
async function ask(prompt: string){ const rl = readline.createInterface({ input, output }); const v = await rl.question(prompt); rl.close(); return v; }
function flag(n: string){ const i = args.findIndex(a => a === `--${n}`); return (i>=0 && i+1<args.length) ? args[i+1] : undefined; }
async function pass(){ const e = process.env.QS_PASSPHRASE; if (e) return e; return ask("Enter passphrase (visible input): "); }

switch (cmd) {
  case "ks:init": { log(await initKeystore()); break; }
  case "ks:add": { const p = await pass(); log(await addWalletToKeystore(p, flag("label"))); break; }
  case "ks:add:mn": { const m = args.slice(1).join(" ").trim(); if (m.split(" ").length<12) { console.error("Usage: npm run ks:add:mn -- <mnemonic>"); process.exit(1); } const p = await pass(); log(await addWalletFromMnemonic(p,m)); break; }
  case "ks:list": { log({ items: await listWallets() }); break; }
  case "ks:show": { const a=args[1]; if(!a){ console.error("Usage: npm run ks:show -- <address>"); process.exit(1);} const p=await pass(); log(await showWallet(a,p)); break; }
  case "ks:label": { const a=args[1]; const l=flag("label")??""; if(!a||!l){ console.error("Usage: npm run ks:label -- <address> --label <name>"); process.exit(1);} log(await relabelWallet(a,l)); break; }

  case "state:init": { log(await initState(flag("chain")??"qs-local")); break; }
  case "state:fund": { const to=flag("to")??""; const amount=flag("amount")??"0"; if(!isValidAddress(to)){ console.error("Usage: npm run state:fund -- --to <qs1...> --amount <int>"); process.exit(1);} log(await fundAddress(to,amount)); break; }
  case "state:balance": { const a=flag("addr")??""; if(!isValidAddress(a)){ console.error("Usage: npm run state:balance -- --addr <qs1...>"); process.exit(1);} log(await balanceOf(a)); break; }

  // simple send (plaintext)
  case "tx:send": {
    const fromArg = flag("from") ?? (await getDefaultAddress()) ?? "";
    const to = flag("to") ?? "";
    const amount = flag("amount") ?? "0";
    const memo = flag("memo");
    if(!isValidAddress(fromArg)||!isValidAddress(to)){ console.error("Need --from (or default) and --to"); process.exit(1); }
    const p = await pass(); const b = await balanceOf(fromArg); const w = await loadWalletFromKeystore(fromArg,p);
    const tx = signTx(w, { from: fromArg, to, amount, nonce: b.nonce, memo: memo ?? undefined });
    const res = await applyTx(tx); await recordAppliedTx(res.hash, tx);
    log({ info:"Sent tx", txHash: res.hash, from: res.from, to: res.to });
    break;
  }

  // encrypted send (if you already added contacts)
  case "tx:send:enc": {
    const fromArg = flag("from") ?? (await getDefaultAddress()) ?? "";
    const toLabel = flag("toLabel"); const toAddr = flag("to");
    const amount = flag("amount") ?? "0"; const memo = flag("memo") ?? "";
    const dest = toLabel ? await getContactByLabel(toLabel) : (toAddr ? await getContactByAddress(toAddr) : null);
    const to = dest?.address ?? ""; if(!isValidAddress(fromArg)||!isValidAddress(to)||!dest?.kemPublicHex){ console.error("Need valid from/to and contact with kem pub"); process.exit(1); }
    const p = await pass(); const b = await balanceOf(fromArg); const w = await loadWalletFromKeystore(fromArg,p);
    const memoEnc = encryptMemoForRecipient(memo, dest.kemPublicHex);
    const tx = signTx(w, { from: fromArg, to, amount, nonce: b.nonce, memoEnc });
    const res = await applyTx(tx); await recordAppliedTx(res.hash, tx);
    log({ info:"Sent encrypted tx", txHash: res.hash, from: res.from, to: res.to });
    break;
  }

  // miner + history
  case "chain:mine": { const max = Number(flag("max") ?? "1000"); log(await mineBlock(max)); break; }
  case "chain:tip": { log(await getTip()); break; }
  case "tx:get": { const h = flag("hash") ?? ""; if (!h) { console.error("Usage: npm run tx:get -- --hash <keccak>"); process.exit(1); } log(await chainGetTx(h.toLowerCase())); break; }
  case "addr:txs": { const a = flag("addr") ?? ""; const lim = Number(flag("limit") ?? "50"); if(!isValidAddress(a)){ console.error("Usage: npm run addr:txs -- --addr <qs1...> [--limit 50]"); process.exit(1);} log({ items: await listAddressTxs(a, lim) }); break; }

  // contacts + kem utils (kept)
  case "kem:pub": { const a=args[1] ?? (await getDefaultAddress()) ?? ""; if(!a){ console.error("Usage: npm run kem:pub -- <address>"); process.exit(1);} log({ address:a, kemPublicHex: await getKemPublicHex(a) }); break; }
  case "contacts:add": { const addr=flag("addr")??""; const label=flag("label")??""; const kem=flag("kem")??""; if(!isValidAddress(addr)||!label||kem.length<32){ console.error("Usage: npm run contacts:add -- --addr <qs1...> --label <name> --kem <hex>"); process.exit(1);} log(await addContact(addr,label,kem.toLowerCase())); break; }
  case "contacts:list": { log({ items: await listContacts() }); break; }

  case "default:set": { const a=args[1]; if(!a){ console.error("Usage: npm run default:set -- <address>"); process.exit(1);} log(await setDefaultAddress(a)); break; }
  case "default:get": { log({ defaultAddress: await getDefaultAddress() }); break; }

  default: {
    console.error("Commands: ks:init/add/add:mn/list/show/label  state:init/fund/balance  tx:send tx:send:enc tx:get  chain:mine chain:tip  addr:txs  kem:pub  contacts:add/list  default:set/get");
    process.exit(1);
  }
}
