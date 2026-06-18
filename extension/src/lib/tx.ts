import { signDetached } from "./dilithium";
import { base64ToBytes, bytesToBase64, utf8ToBytes } from "./codec";
import type { DetachedSigEnvelope, Transaction, UnlockedWallet } from "./types";

/**
 * Builds and signs a transaction exactly as qs-node's verify_env expects:
 * the signature covers the literal JSON bytes sent as tx_b64.
 */
export async function buildSignedEnvelope(
  wallet: UnlockedWallet,
  toAddress: string,
  amount: number,
  nonce: number,
): Promise<DetachedSigEnvelope> {
  const tx: Transaction = {
    from_pk_b64: wallet.publicKeyB64,
    to_address: toAddress,
    amount,
    nonce,
    hash_hex: "",
  };
  const txBytes = utf8ToBytes(JSON.stringify(tx));
  const secretKey = base64ToBytes(wallet.secretKeyB64);
  const signature = await signDetached(txBytes, secretKey);

  return {
    tx_b64: bytesToBase64(txBytes),
    sig_b64: bytesToBase64(signature),
    from_pk_b64: wallet.publicKeyB64,
  };
}
