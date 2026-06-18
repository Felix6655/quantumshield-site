import { useState } from "react";
import { importVaultFromFile } from "../../lib/backup";
import { unlockVault, WrongPasswordError } from "../../lib/vault";
import { saveVault } from "../../lib/storage";
import type { EncryptedVault, UnlockedWallet } from "../../lib/types";

export function ImportWallet(props: {
  onBack: () => void;
  onImported: (vault: EncryptedVault, wallet: UnlockedWallet) => void;
}) {
  const [vault, setVault] = useState<EncryptedVault | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const loaded = await importVaultFromFile(file);
      setVault(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read backup file.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vault) return;
    setBusy(true);
    setError(null);
    try {
      const wallet = await unlockVault(password, vault);
      await saveVault(vault);
      props.onImported(vault, wallet);
    } catch (err) {
      setError(err instanceof WrongPasswordError ? "Incorrect password." : "Failed to unlock backup.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="qs-app">
      <div className="qs-header">
        <h1 className="qs-title">Import Wallet</h1>
        <button className="link" onClick={props.onBack}>
          Back
        </button>
      </div>
      <p className="qs-muted">Select a QuantumShield wallet backup file (.json), then enter its password.</p>
      <input type="file" accept="application/json" onChange={handleFile} />
      {vault && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="qs-field">
            <label htmlFor="ipw">Password</label>
            <input
              id="ipw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <div className="qs-error">{error}</div>}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Unlocking…" : "Import"}
          </button>
        </form>
      )}
      {!vault && error && <div className="qs-error">{error}</div>}
    </div>
  );
}
