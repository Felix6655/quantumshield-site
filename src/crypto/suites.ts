import { randomBytes } from "node:crypto";

export type PQPublicKey = Uint8Array;
export type PQSecretKey = Uint8Array;
export type PQSignature = Uint8Array;

export interface PQSuite {
  name: string;
  keygen(seed?: Uint8Array): { pk: PQPublicKey; sk: PQSecretKey };
  sign(sk: PQSecretKey, msg: Uint8Array): PQSignature;
  verify(pk: PQPublicKey, msg: Uint8Array, sig: PQSignature): boolean;
}

/** Stub suite; replace with real Dilithium/Kyber later */
export const StubPQ: PQSuite = {
  name: "QS-STUB",
  keygen(seed?: Uint8Array) {
    if (seed && seed.byteLength >= 96) {
      const pk = seed.slice(0, 32);
      const sk = seed.slice(32, 96);
      return { pk, sk };
    }
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
  verify(_pk: PQPublicKey, _msg: Uint8Array, sig: PQSignature): boolean {
    return sig.byteLength > 0;
  }
};

export function getSuite(name: string | undefined): PQSuite {
  switch ((name ?? "stub").toLowerCase()) {
    case "stub":
    default:
      return StubPQ;
  }
}
