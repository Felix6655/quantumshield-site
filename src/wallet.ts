import "dotenv/config";
import { hkdfSync, randomBytes } from "node:crypto";
import { mnemonicToSeedSync, generateMnemonic } from "bip39";
import { getSuite, PQPublicKey, PQSecretKey, PQSignature } from "./crypto/suites.js";
import { u8ToHex, hexToU8, toBytes } from "./utils/codec.js";
import { addressFromPubKey } from "./utils/address.js";

export type QSKeypair = { scheme: string; publicKeyHex: string; secretKeyHex: string; address: string; };

function deriveSeedFromMnemonic(mnemonic: string, index = 0): Uint8Array {
  const seed = mnemonicToSeedSync(mnemonic); // 64 bytes
  // Derivation salt includes index so you can get multiple accounts from one mnemonic
  const salt = Buffer.from(`QS-STUB-salt-${index}`, "utf8");
  const info = Buffer.from("QS-KEYGEN-v1", "utf8");
  const okm = hkdfSync("sha256", seed, salt, info, 96);
  return new Uint8Array(okm); // 96 = 32 pk + 64 sk (stub suite)
}

export class QSWallet {
  private pk: PQPublicKey;
  private sk: PQSecretKey;
  readonly scheme: string;

  constructor(pk?: PQPublicKey, sk?: PQSecretKey) {
    const suite = getSuite(process.env.QS_SCHEME);
    if (pk && sk) { this.pk = pk; this.sk = sk; }
    else { const { pk: genPk, sk: genSk } = suite.keygen(); this.pk = genPk; this.sk = genSk; }
    this.scheme = suite.name;
  }

  static newRandom(): QSWallet {
    const suite = getSuite(process.env.QS_SCHEME);
    const { pk, sk } = suite.keygen();
    return new QSWallet(pk, sk);
  }

  static fromMnemonic(mnemonic: string, index = 0): QSWallet {
    const suite = getSuite(process.env.QS_SCHEME);
    const seed = deriveSeedFromMnemonic(mnemonic, index);
    const { pk, sk } = suite.keygen(seed);
    return new QSWallet(pk, sk);
  }

  static generateMnemonic(words = 24): string {
    const strength = words === 12 ? 128 : 256;
    return generateMnemonic(strength);
  }

  static fromSecretKeyHex(secretKeyHex: string): QSWallet {
    const sk = hexToU8(secretKeyHex);
    const pk = new Uint8Array(randomBytes(32)); // stub pk
    return new QSWallet(pk, sk);
  }

  export(): QSKeypair {
    const publicKeyHex = u8ToHex(this.pk);
    const secretKeyHex = u8ToHex(this.sk);
    const address = addressFromPubKey(publicKeyHex);
    return { scheme: this.scheme, publicKeyHex, secretKeyHex, address };
  }

  sign(message: string): { signatureHex: string; ok: boolean } {
    const suite = getSuite(process.env.QS_SCHEME);
    const sig: PQSignature = suite.sign(this.sk, toBytes(message));
    const ok = suite.verify(this.pk, toBytes(message), sig);
    return { signatureHex: u8ToHex(sig), ok };
  }

  get publicKeyHex(): string { return this.export().publicKeyHex; }
  get address(): string { return this.export().address; }
}
