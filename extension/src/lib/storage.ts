import type { EncryptedVault, UnlockedWallet } from "./types";

const VAULT_KEY = "qs_vault";
const SESSION_WALLET_KEY = "qs_unlocked_wallet";

export async function saveVault(vault: EncryptedVault): Promise<void> {
  await chrome.storage.local.set({ [VAULT_KEY]: vault });
}

export async function loadVault(): Promise<EncryptedVault | null> {
  const result = await chrome.storage.local.get(VAULT_KEY);
  return (result[VAULT_KEY] as EncryptedVault | undefined) ?? null;
}

export async function clearVault(): Promise<void> {
  await chrome.storage.local.remove(VAULT_KEY);
}

/** Session storage is in-memory and cleared when the browser closes, used to avoid re-prompting for the password on every popup open. */
export async function cacheUnlockedWallet(wallet: UnlockedWallet): Promise<void> {
  await chrome.storage.session.set({ [SESSION_WALLET_KEY]: wallet });
}

export async function getCachedUnlockedWallet(): Promise<UnlockedWallet | null> {
  const result = await chrome.storage.session.get(SESSION_WALLET_KEY);
  return (result[SESSION_WALLET_KEY] as UnlockedWallet | undefined) ?? null;
}

export async function lockSession(): Promise<void> {
  await chrome.storage.session.remove(SESSION_WALLET_KEY);
}
