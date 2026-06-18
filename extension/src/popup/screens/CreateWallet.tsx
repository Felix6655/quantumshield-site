import { useState } from "react";
import { generateKeyPair } from "../../lib/dilithium";
import { addressFromPublicKey } from "../../lib/address";
import { createVault } from "../../lib/vault";
import { saveVault } from "../../lib/storage";
import { bytesToBase64 } from "../../lib/codec";
import type { EncryptedVault, UnlockedWallet } from "../../lib/types";

const MIN_PASSWORD_LENGTH = 8;

export function CreateWallet(props: {
  onBack: () => void;
  onCreated: (vault: EncryptedVault, wallet: UnlockedWallet) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const keyPair = await generateKeyPair();
      const address = await addressFromPublicKey(keyPair.publicKey);
      const wallet: UnlockedWallet = {
        publicKeyB64: bytesToBase64(keyPair.publicKey),
        secretKeyB64: bytesToBase64(keyPair.secretKey),
        address,
      };
      const vault = await createVault(password, wallet);
      await saveVault(vault);
      props.onCreated(vault, wallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wallet.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="qs-app">
      <div className="qs-header">
        <h1 className="qs-title">Create Wallet</h1>
        <button className="link" onClick={props.onBack}>
          Back
        </button>
      </div>
      <p className="qs-muted">
        This generates a new Dilithium2 keypair and a QuantumShield (bech32 "qs1...") address, then
        encrypts the secret key with your password.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="qs-field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        <div className="qs-field">
          <label htmlFor="pw2">Confirm Password</label>
          <input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <div className="qs-error">{error}</div>}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Generating keys…" : "Create Wallet"}
        </button>
      </form>
    </div>
  );
}
