"use client";

import React, { useEffect, useMemo, useState } from "react";

const NODE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_QS_NODE_URL) ||
  "http://127.0.0.1:3008";

type MempoolItem = { hash: string; to: string; amount: number; nonce: number };

export default function WalletPage() {
  const [health, setHealth] = useState<string>("…");
  const [mempool, setMempool] = useState<MempoolItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // form state
  const [fromPkB64, setFromPkB64] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [nonce, setNonce] = useState<number>(1);

  const node = useMemo(() => NODE_URL.replace(/\/$/, ""), []);

  async function refresh() {
    try {
      const h = await fetch(`${node}/health`).then(r => r.text());
      setHealth(h);
    } catch {
      setHealth("down");
    }
    try {
      const mp = await fetch(`${node}/mempool`).then(r => r.json());
      setMempool(mp);
    } catch {
      setMempool([]);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000);
    return () => clearInterval(t);
  }, []);

  async function submitTx(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      // Build a Transaction (hash_hex may be empty; node recomputes)
      const tx = {
        from_pk_b64: fromPkB64.trim(),
        to_address: toAddr.trim(),
        amount: Number(amount),
        nonce: Number(nonce),
        hash_hex: "",
      };
      const txStr = JSON.stringify(tx);
      // Base64 encode JSON bytes
      const txB64 =
        typeof window !== "undefined"
          ? btoa(txStr) // JSON is ASCII-safe
          : Buffer.from(txStr, "utf8").toString("base64");

      // Envelope (node currently ignores sig verification)
      const env = { tx_b64: txB64, sig_b64: "", from_pk_b64: fromPkB64.trim() };

      const res = await fetch(`${node}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(env),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`submit failed (${res.status}): ${t}`);
      }
      const j = await res.json();
      setMsg(`Submitted ✓  hash=${j.hash}  from=${j.from_address}`);
      await refresh();
    } catch (err: any) {
      setMsg(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quantum Shield Wallet</h1>
        <span className={`text-sm px-2 py-1 rounded ${health === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>node: {health}</span>
      </header>

      <section className="rounded-2xl border p-4 space-y-3">
        <h2 className="font-medium">Send</h2>
        <form onSubmit={submitTx} className="space-y-3">
          <div className="grid gap-2">
            <label className="text-sm">From Public Key (base64)</label>
            <textarea
              className="w-full rounded border p-2 font-mono text-xs"
              rows={3}
              value={fromPkB64}
              onChange={e => setFromPkB64(e.target.value)}
              placeholder="paste pk_b64 from keys\alice.json"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">To Address (qs1…)</label>
            <input
              className="w-full rounded border p-2 font-mono text-sm"
              value={toAddr}
              onChange={e => setToAddr(e.target.value)}
              placeholder="qs1..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Amount</label>
              <input
                type="number"
                min={0}
                className="w-full rounded border p-2"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm">Nonce</label>
              <input
                type="number"
                min={0}
                className="w-full rounded border p-2"
                value={nonce}
                onChange={e => setNonce(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            disabled={busy}
            className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {busy ? "Submitting…" : "Submit"}
          </button>
          {msg && <p className="text-sm text-slate-600">{msg}</p>}
        </form>
      </section>

      <section className="rounded-2xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Mempool</h2>
          <button onClick={refresh} className="text-sm underline">refresh</button>
        </div>
        {mempool.length === 0 ? (
          <p className="text-sm text-slate-500">empty</p>
        ) : (
          <ul className="space-y-2">
            {mempool.map((m) => (
              <li key={m.hash} className="rounded border p-2">
                <div className="font-mono text-xs break-all">hash: {m.hash}</div>
                <div className="text-sm">to: {m.to}</div>
                <div className="text-sm">amount: {m.amount} · nonce: {m.nonce}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}