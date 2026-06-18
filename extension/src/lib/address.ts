import { blake3 } from "hash-wasm";
import { bech32 } from "bech32";
import { hexToBytes } from "./codec";

/**
 * Mirrors qs-node's address_from_pk_b64: blake3(pk)[0..20] bech32-encoded
 * with hrp "qs" (original bech32 variant, not bech32m).
 */
export async function addressFromPublicKey(publicKey: Uint8Array): Promise<string> {
  const hashHex = await blake3(publicKey, 256);
  const short = hexToBytes(hashHex).slice(0, 20);
  const words = bech32.toWords(short);
  return bech32.encode("qs", words);
}
