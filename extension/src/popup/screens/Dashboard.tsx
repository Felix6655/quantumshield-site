import { useEffect, useState } from "react";
import type { EncryptedVault, MempoolItem, UnlockedWallet } from "../../lib/types";
import { getHealth, getMempool, submitTransaction } from "../../lib/qsClient";
import { buildSignedEnvelope } from "../../lib/tx";
import { exportVaultToFile } from "../../lib/backup";

const POLL_INTERVAL_MS = 5000;

export function Dashboard(props: { vault: EncryptedVault; wallet: UnlockedWallet; onLock: () => void }) {
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [mempool, setMempool] = useState<MempoolItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [revealSecret, setRevealSecret] = useState(false);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [nonce, setNonce] = useState("1");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const poll = async () => {
      setHealthy(await getHealth());
      try {
        setMempool(await getMempool());
      } catch {
        // node may be offline; health badge already reflects this
      }
    };
    void poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  async function copyAddress() {
    await navigator.clipboard.writeText(props.wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);
    setSendResult(null);
    const amountNum = Number(amount);
    const nonceNum = Number(nonce);
    if (!toAddress.trim()) {
      setSendError("Recipient address is required.");
      return;
    }
    if (!Number.isFinite(amountNum) || amountNum < 0) {
      setSendError("Amount must be a non-negative number.");
      return;
    }
    if (!Number.isFinite(nonceNum) || nonceNum < 0) {
      setSendError("Nonce must be a non-negative number.");
      return;
    }
    setSending(true);
    try {
      const envelope = await buildSignedEnvelope(props.wallet, toAddress.trim(), amountNum, nonceNum);
      const response = await submitTransaction(envelope);
      if (response.status === "accepted") {
        setSendResult(`Accepted — hash ${response.hash.slice(0, 16)}…`);
        setNonce(String(nonceNum + 1));
        setMempool(await getMempool());
      } else {
        setSendError("Transaction rejected by node.");
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to submit transaction.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="qs-app">
      <div className="qs-header">
        <h1 className="qs-title">QuantumShield Wallet</h1>
        <span className={`qs-badge ${healthy ? "ok" : "bad"}`}>
          {healthy === null ? "checking…" : healthy ? "node online" : "node offline"}
        </span>
      </div>

      <div className="qs-address-box">
        {props.wallet.address}
        <button onClick={copyAddress}>{copied ? "Copied!" : "Copy"}</button>
      </div>

      <hr />

      <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="qs-field">
          <label htmlFor="to">Recipient address</label>
          <input id="to" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="qs1..." />
        </div>
        <div className="qs-row">
          <div className="qs-field">
            <label htmlFor="amt">Amount</label>
            <input id="amt" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
          </div>
          <div className="qs-field">
            <label htmlFor="nonce">Nonce</label>
            <input id="nonce" value={nonce} onChange={(e) => setNonce(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        {sendError && <div className="qs-error">{sendError}</div>}
        {sendResult && <div className="qs-muted">{sendResult}</div>}
        <button className="primary" type="submit" disabled={sending}>
          {sending ? "Signing & sending…" : "Sign & Send"}
        </button>
      </form>

      <hr />

      <div>
        <div className="qs-muted">Mempool ({mempool.length})</div>
        <ul className="qs-mempool-list">
          {mempool
            .slice()
            .reverse()
            .map((item) => (
              <li key={item.hash} className="qs-mempool-item">
                {item.to} · {item.amount} · nonce {item.nonce}
              </li>
            ))}
        </ul>
      </div>

      <hr />

      <div className="qs-row">
        <button onClick={() => exportVaultToFile(props.vault)}>Export Backup</button>
        <button onClick={props.onLock}>Lock</button>
      </div>

      <button className="link" onClick={() => setRevealSecret((v) => !v)}>
        {revealSecret ? "Hide secret key" : "Reveal secret key"}
      </button>
      {revealSecret && (
        <textarea readOnly rows={4} value={props.wallet.secretKeyB64} onFocus={(e) => e.target.select()} />
      )}
    </div>
  );
}
