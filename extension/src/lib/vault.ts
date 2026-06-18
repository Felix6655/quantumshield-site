import { bytesToBase64, base64ToBytes, utf8ToBytes } from "./codec";
import type { EncryptedVault, UnlockedWallet } from "./types";

const PBKDF2_ITERATIONS = 250_000;

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey("raw", utf8ToBytes(password), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function createVault(
  password: string,
  wallet: UnlockedWallet,
): Promise<EncryptedVault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const plaintext = utf8ToBytes(JSON.stringify({ secretKeyB64: wallet.secretKeyB64 }));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  return {
    version: 1,
    saltB64: bytesToBase64(salt),
    ivB64: bytesToBase64(iv),
    ciphertextB64: bytesToBase64(new Uint8Array(ciphertext)),
    publicKeyB64: wallet.publicKeyB64,
    address: wallet.address,
  };
}

export class WrongPasswordError extends Error {
  constructor() {
    super("Incorrect password");
  }
}

export async function unlockVault(password: string, vault: EncryptedVault): Promise<UnlockedWallet> {
  const salt = base64ToBytes(vault.saltB64);
  const iv = base64ToBytes(vault.ivB64);
  const key = await deriveKey(password, salt);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64ToBytes(vault.ciphertextB64));
  } catch {
    throw new WrongPasswordError();
  }

  const { secretKeyB64 } = JSON.parse(new TextDecoder().decode(plaintext)) as { secretKeyB64: string };
  return { publicKeyB64: vault.publicKeyB64, secretKeyB64, address: vault.address };
}
