import { useState } from "react";
import { unlockVault, WrongPasswordError } from "../../lib/vault";
import type { EncryptedVault, UnlockedWallet } from "../../lib/types";

export function Unlock(props: {
  vault: EncryptedVault;
  onUnlocked: (wallet: UnlockedWallet) => void;
  onForgetWallet: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingForget, setConfirmingForget] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const wallet = await unlockVault(password, props.vault);
      props.onUnlocked(wallet);
    } catch (err) {
      setError(err instanceof WrongPasswordError ? "Incorrect password." : "Failed to unlock.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="qs-app">
      <div className="qs-header">
        <h1 className="qs-title">Unlock Wallet</h1>
      </div>
      <div className="qs-address-box">{props.vault.address}</div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="qs-field">
          <label htmlFor="upw">Password</label>
          <input
            id="upw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        {error && <div className="qs-error">{error}</div>}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Unlocking…" : "Unlock"}
        </button>
      </form>
      {!confirmingForget ? (
        <button className="link" onClick={() => setConfirmingForget(true)}>
          Forget this wallet
        </button>
      ) : (
        <div className="qs-field">
          <span className="qs-error">
            This removes the encrypted wallet from this browser. Make sure you have a backup.
          </span>
          <div className="qs-row">
            <button onClick={() => setConfirmingForget(false)}>Cancel</button>
            <button className="primary" onClick={props.onForgetWallet}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
