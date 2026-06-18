export interface Transaction {
  from_pk_b64: string;
  to_address: string;
  amount: number;
  nonce: number;
  hash_hex: string;
}

export interface DetachedSigEnvelope {
  tx_b64: string;
  sig_b64: string;
  from_pk_b64: string;
}

export interface MempoolItem {
  hash: string;
  to: string;
  amount: number;
  nonce: number;
}

export interface SubmitResponse {
  status: "accepted" | "rejected";
  hash: string;
  from_address: string;
}

export interface EncryptedVault {
  version: 1;
  saltB64: string;
  ivB64: string;
  ciphertextB64: string;
  publicKeyB64: string;
  address: string;
}

export interface UnlockedWallet {
  publicKeyB64: string;
  secretKeyB64: string;
  address: string;
}
