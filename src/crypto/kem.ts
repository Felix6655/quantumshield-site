import { randomBytes } from "node:crypto";
import { ml_kem512, ml_kem768, ml_kem1024 } from "@noble/post-quantum/ml-kem.js";

export type KemPublicKey = Uint8Array;
export type KemSecretKey = Uint8Array;
export type KemCipherText = Uint8Array;
export type KemSharedSecret = Uint8Array;

export interface KemSuite {
  name: "ML-KEM-512" | "ML-KEM-768" | "ML-KEM-1024";
  keygen(seed?: Uint8Array): { publicKey: KemPublicKey; secretKey: KemSecretKey };
  encapsulate(pk: KemPublicKey): { cipherText: KemCipherText; sharedSecret: KemSharedSecret };
  decapsulate(ct: KemCipherText, sk: KemSecretKey): KemSharedSecret;
}

function wrap(name: KemSuite["name"], impl: typeof ml_kem512 | typeof ml_kem768 | typeof ml_kem1024): KemSuite {
  return {
    name,
    keygen(seed?: Uint8Array) {
      const s = seed ? seed.slice(0, 32) : undefined;
      const { publicKey, secretKey } = (impl as any).keygen(s);
      return { publicKey, secretKey };
    },
    encapsulate(pk: KemPublicKey) {
      return (impl as any).encapsulate(pk) as { cipherText: KemCipherText; sharedSecret: KemSharedSecret };
    },
    decapsulate(ct: KemCipherText, sk: KemSecretKey) {
      return (impl as any).decapsulate(ct, sk) as KemSharedSecret;
    }
  };
}

const KEM512  = wrap("ML-KEM-512",  ml_kem512);
const KEM768  = wrap("ML-KEM-768",  ml_kem768);
const KEM1024 = wrap("ML-KEM-1024", ml_kem1024);

export function getKemSuite(name = process.env.QS_KEM ?? "mlkem768"): KemSuite {
  switch (name.toLowerCase()) {
    case "mlkem512":  return KEM512;
    case "mlkem1024": return KEM1024;
    case "mlkem768":
    default:          return KEM768;
  }
}
