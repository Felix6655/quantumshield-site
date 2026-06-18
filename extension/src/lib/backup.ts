import type { EncryptedVault } from "./types";

export function exportVaultToFile(vault: EncryptedVault): void {
  const blob = new Blob([JSON.stringify(vault, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quantumshield-wallet-${vault.address}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function isEncryptedVault(value: unknown): value is EncryptedVault {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 1 &&
    typeof v.saltB64 === "string" &&
    typeof v.ivB64 === "string" &&
    typeof v.ciphertextB64 === "string" &&
    typeof v.publicKeyB64 === "string" &&
    typeof v.address === "string"
  );
}

export async function importVaultFromFile(file: File): Promise<EncryptedVault> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!isEncryptedVault(parsed)) {
    throw new Error("This file is not a valid QuantumShield wallet backup.");
  }
  return parsed;
}
