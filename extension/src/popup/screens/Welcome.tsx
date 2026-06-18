export function Welcome(props: { onCreate: () => void; onImport: () => void }) {
  return (
    <div className="qs-app">
      <div className="qs-header">
        <h1 className="qs-title">QuantumShield Wallet</h1>
      </div>
      <p className="qs-muted">
        A post-quantum (Dilithium2) wallet for the QuantumShield network. Get started by creating a
        new wallet or importing an existing backup.
      </p>
      <button className="primary" onClick={props.onCreate}>
        Create New Wallet
      </button>
      <button onClick={props.onImport}>Import Wallet Backup</button>
    </div>
  );
}
