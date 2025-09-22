const $ = (id) => document.getElementById(id);
const apiBase = () => $("apiBase").value.replace(/\/+$/, "");
const headers = () => {
  const h = { "Content-Type": "application/json" };
  const pass = $("pass").value.trim();
  const key  = $("apiKey").value.trim();
  if (pass) h["X-QS-Passphrase"] = pass;
  if (key)  h["X-QS-Api-Key"]    = key;
  return h;
};

async function apiGET(path) {
  const res = await fetch(apiBase() + path, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function apiPOST(path, body) {
  const res = await fetch(apiBase() + path, { method: "POST", headers: headers(), body: JSON.stringify(body ?? {}) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ===== Keystore ===== */
async function initKeystore(){ await apiPOST("/keystore/init", {}); await listWallets(); }
async function addWallet(){ await apiPOST("/keystore/add", {}); await listWallets(); }
async function listWallets(){
  const data = await apiGET("/keystore/list");
  const rows = [
    "<tr><th>Address</th><th>Label</th><th>KEM pub (first 16)</th></tr>",
    ...data.items.map(w => `<tr><td class="mono">${w.address}</td><td>${w.label ?? ""}</td><td class="mono">${(w.kemPublicHex ?? "").slice(0,16)}</td></tr>`)
  ].join("");
  $("walletsTbl").innerHTML = rows;
}

/* ===== State ===== */
async function initState(){ await apiPOST("/state/init", {}); }
async function getBalance(){
  const addr = $("balAddr").value.trim();
  if (!addr) return;
  const b = await apiGET(`/state/balance/${addr}`);
  $("balOut").textContent = JSON.stringify(b, null, 2);
}
async function fund(){
  const to = $("fundTo").value.trim(); const amount = $("fundAmt").value.trim();
  const r = await apiPOST("/state/fund", { to, amount });
  $("balOut").textContent = JSON.stringify(r, null, 2);
}

/* ===== Send (plaintext) ===== */
async function sendTx(){
  const from = $("sendFrom").value.trim();
  const to   = $("sendTo").value.trim();
  const amount = $("sendAmt").value.trim();
  const memo = $("sendMemo").value;
  const r = await apiPOST("/tx/send", { from, to, amount, memo });
  $("sendOut").textContent = JSON.stringify(r, null, 2);
}

/* ===== Contacts + Encrypted memo ===== */
async function addContact(){
  const addr = $("cAddr").value.trim();
  const label = $("cLabel").value.trim();
  const kemPublicHex = $("cKem").value.trim();
  const r = await apiPOST("/contacts/add", { addr, label, kemPublicHex });
  $("encOut").textContent = JSON.stringify(r, null, 2);
  await listContacts();
}
async function listContacts(){
  const data = await apiGET("/contacts/list");
  const rows = [
    "<tr><th>Label</th><th>Address</th><th>KEM pub (first 24)</th></tr>",
    ...data.items.map(c => `<tr><td>${c.label}</td><td class="mono">${c.address}</td><td class="mono">${c.kemPublicHex.slice(0,24)}...</td></tr>`)
  ].join("");
  $("contactsTbl").innerHTML = rows;
}
async function sendEnc(){
  const from = $("encFrom").value.trim();
  const toLabel = $("encToLabel").value.trim();
  const amount = $("encAmt").value.trim();
  const memo = $("encMemo").value;
  const r = await apiPOST("/tx/send-enc", { from, toLabel, amount, memo });
  $("encOut").textContent = JSON.stringify(r, null, 2);
}

/* ===== WS ===== */
let ws;
function connectWS(){
  try { if (ws) ws.close(); } catch {}
  const url = apiBase().replace("http","ws") + "/ws";
  ws = new WebSocket(url);
  $("wsState").textContent = "connecting";
  ws.onopen = () => $("wsState").innerHTML = `<span class="ok">connected</span> ${url}`;
  ws.onclose = () => $("wsState").innerHTML = `<span class="err">disconnected</span>`;
  ws.onmessage = (ev) => {
    const p = document.createElement("div");
    p.textContent = ev.data;
    $("events").prepend(p);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  $("docsLink").href = apiBase() + "/docs";
});
