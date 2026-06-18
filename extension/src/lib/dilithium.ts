import init, {
  dilithium_keypair,
  dilithium_sign_detached,
  dilithium_verify_detached,
} from "./wasm/qs_wasm_dilithium.js";

let ready: Promise<unknown> | null = null;

function ensureInit(): Promise<unknown> {
  if (!ready) ready = init();
  return ready;
}

export interface DilithiumKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

/** Generates a fresh Dilithium2 keypair, byte-compatible with the qs-node verifier. */
export async function generateKeyPair(): Promise<DilithiumKeyPair> {
  await ensureInit();
  const packed = dilithium_keypair();
  const pkLen = new DataView(packed.buffer, packed.byteOffset, 4).getUint32(0, true);
  const publicKey = packed.slice(4, 4 + pkLen);
  const secretKey = packed.slice(4 + pkLen);
  return { publicKey, secretKey };
}

export async function signDetached(message: Uint8Array, secretKey: Uint8Array): Promise<Uint8Array> {
  await ensureInit();
  return dilithium_sign_detached(message, secretKey);
}

export async function verifyDetached(
  signature: Uint8Array,
  message: Uint8Array,
  publicKey: Uint8Array,
): Promise<boolean> {
  await ensureInit();
  return dilithium_verify_detached(signature, message, publicKey);
}
