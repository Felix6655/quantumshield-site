/**
 * Placeholder Post-Quantum interfaces + stub impl.
 * Swap stubs with real PQ (e.g., Dilithium/Kyber) when you add the libs.
 */
import { randomBytes } from "node:crypto";

export type PQPublicKey = Uint8Array;
export type PQSecretKey = Uint8Array;
export type PQSignature = Uint8Array;

export interface PQSuite {
  name: string;                    // e.g., "Dilithium2"
  keygen(): { pk: PQPublicKey; sk: PQSecretKey };
  sign(sk: PQSecretKey, msg: Uint8Array): PQSignature;
  verify(pk: PQPublicKey, msg: Uint8Array, sig: PQSignature): boolean;
}

/**
 * STUB suite (NOT secure). For wiring only.
 * Generates random bytes and “signs” by concatenation.
 */
export const StubPQ: PQSuite = {
  name: "QS-STUB",
  keygen() {
    const pk = randomBytes(32);
    const sk = randomBytes(64);
    return { pk: new Uint8Array(pk), sk: new Uint8Array(sk) };
  },
  sign(sk: PQSecretKey, msg: Uint8Array): PQSignature {
    const sig = new Uint8Array(sk.length + msg.length);
    sig.set(sk);
    sig.set(msg, sk.length);
    return sig;
  },
  verify(pk: PQPublicKey, msg: Uint8Array, sig: PQSignature): boolean {
    // Always true in stub. Replace with real verification.
    return pk.byteLength > 0 && msg.byteLength > 0 && sig.byteLength > 0;
  }
};
