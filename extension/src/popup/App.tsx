import { useEffect, useState } from "react";
import type { EncryptedVault, UnlockedWallet } from "../lib/types";
import { loadVault, getCachedUnlockedWallet, cacheUnlockedWallet, lockSession, clearVault } from "../lib/storage";
import { Welcome } from "./screens/Welcome";
import { CreateWallet } from "./screens/CreateWallet";
import { ImportWallet } from "./screens/ImportWallet";
import { Unlock } from "./screens/Unlock";
import { Dashboard } from "./screens/Dashboard";

type Screen =
  | { name: "loading" }
  | { name: "welcome" }
  | { name: "create" }
  | { name: "import" }
  | { name: "unlock"; vault: EncryptedVault }
  | { name: "dashboard"; vault: EncryptedVault; wallet: UnlockedWallet };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "loading" });

  useEffect(() => {
    void bootstrap();
  }, []);

  async function bootstrap() {
    const vault = await loadVault();
    if (!vault) {
      setScreen({ name: "welcome" });
      return;
    }
    const cached = await getCachedUnlockedWallet();
    if (cached) {
      setScreen({ name: "dashboard", vault, wallet: cached });
    } else {
      setScreen({ name: "unlock", vault });
    }
  }

  async function onUnlocked(vault: EncryptedVault, wallet: UnlockedWallet) {
    await cacheUnlockedWallet(wallet);
    setScreen({ name: "dashboard", vault, wallet });
  }

  async function onForgetWallet() {
    await lockSession();
    await clearVault();
    setScreen({ name: "welcome" });
  }

  async function onLock() {
    await lockSession();
    const vault = await loadVault();
    if (vault) setScreen({ name: "unlock", vault });
    else setScreen({ name: "welcome" });
  }

  if (screen.name === "loading") {
    return <div className="qs-app">Loading…</div>;
  }
  if (screen.name === "welcome") {
    return (
      <Welcome
        onCreate={() => setScreen({ name: "create" })}
        onImport={() => setScreen({ name: "import" })}
      />
    );
  }
  if (screen.name === "create") {
    return (
      <CreateWallet
        onBack={() => setScreen({ name: "welcome" })}
        onCreated={onUnlocked}
      />
    );
  }
  if (screen.name === "import") {
    return (
      <ImportWallet
        onBack={() => setScreen({ name: "welcome" })}
        onImported={onUnlocked}
      />
    );
  }
  if (screen.name === "unlock") {
    return (
      <Unlock
        vault={screen.vault}
        onUnlocked={(wallet) => onUnlocked(screen.vault, wallet)}
        onForgetWallet={onForgetWallet}
      />
    );
  }
  return <Dashboard vault={screen.vault} wallet={screen.wallet} onLock={onLock} />;
}
