use std::{fs, path::Path};
use std::io::Write;

use clap::{Parser, Subcommand};
use serde::{Serialize, Deserialize};
use base64::{engine::general_purpose, Engine as _};
use bech32::{ToBase32, Variant, encode};
use blake3;

use pqcrypto_dilithium::dilithium2 as d2;
// Bring trait methods like from_bytes() / as_bytes() into scope
use pqcrypto_traits::sign::{PublicKey as _, SecretKey as _, DetachedSignature as _};
use pqcrypto_kyber::kyber1024 as k1024;

#[derive(Parser)]
#[command(name="qs", version="0.1.0", about="QuantumShield CLI (demo)")]
struct Cli {
    #[command(subcommand)]
    command: Commands
}

#[derive(Subcommand)]
enum Commands {
    /// Generate a Dilithium2 keypair file (JSON)
    Keygen {
        /// Output file path, e.g. keys/alice.json
        #[arg(long)]
        out: String
    },

    /// Print a Bech32 QS address from a key file or base64 public key
    Address {
        /// Path to keypair JSON produced by `keygen`
        #[arg(long, conflicts_with="pk_b64")]
        key: Option<String>,
        /// Base64-encoded public key
        #[arg(long, conflicts_with="key")]
        pk_b64: Option<String>
    },

    /// Create a transaction JSON
    TxNew {
        /// Recipient Bech32 address (hrp `qs`)
        #[arg(long)]
        to: String,
        /// Amount (u64, demo units)
        #[arg(long)]
        amount: u64,
        /// Nonce (u64)
        #[arg(long)]
        nonce: u64,
        /// Sender key file (gets public key from here)
        #[arg(long)]
        from_key: String,
        /// Output TX json path
        #[arg(long)]
        out: String
    },

    /// Sign a transaction JSON with Dilithium2 (detached)
    Sign {
        /// Secret key file (JSON from `keygen`)
        #[arg(long)]
        key: String,
        /// Transaction JSON file (from `tx-new`)
        #[arg(long)]
        tx: String,
        /// Output envelope JSON (tx_b64 + sig_b64 + from_pk_b64)
        #[arg(long)]
        out: String
    },

    /// Verify a signed envelope JSON
    Verify {
        /// Envelope JSON path (from `sign`)
        #[arg(long)]
        envelope: String
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct KeypairFile {
    pk_b64: String,
    sk_b64: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Transaction {
    from_pk_b64: String,
    to_address: String, // bech32 "qs1..."
    amount: u64,
    nonce: u64,
    hash_hex: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct DetachedSigEnvelope {
    tx_b64: String,     // canonical tx bytes (JSON) in base64
    sig_b64: String,    // Dilithium2 detached signature
    from_pk_b64: String // sender pubkey for verification
}

// ---------- helpers ----------
fn write_json<T: Serialize>(path: &str, value: &T) -> std::io::Result<()> {
    if let Some(parent) = Path::new(path).parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)?;
        }
    }
    let data = serde_json::to_vec_pretty(value).expect("serialize");
    let mut f = fs::File::create(path)?;
    f.write_all(&data)?;
    Ok(())
}

fn read_json<T: for<'de> serde::Deserialize<'de>>(path: &str) -> T {
    let data = fs::read(path).expect("read file");
    serde_json::from_slice::<T>(&data).expect("parse json")
}

fn address_from_pk_b64(pk_b64: &str) -> String {
    let pk_bytes = general_purpose::STANDARD.decode(pk_b64).expect("bad pk b64");
    let h = blake3::hash(&pk_bytes);
    let short = &h.as_bytes()[..20]; // 20 bytes like ETH-style length
    encode("qs", short.to_base32(), Variant::Bech32).expect("bech32 encode")
}

fn tx_bytes(tx: &Transaction) -> Vec<u8> {
    serde_json::to_vec(tx).expect("serialize tx")
}

fn tx_with_hash(mut tx: Transaction) -> Transaction {
    let bytes = tx_bytes(&tx);
    tx.hash_hex = blake3::hash(&bytes).to_hex().to_string();
    tx
}

// ---------- main ----------
fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Keygen { out } => {
            let (pk, sk) = d2::keypair();
            let file = KeypairFile {
                pk_b64: general_purpose::STANDARD.encode(pk.as_bytes()),
                sk_b64: general_purpose::STANDARD.encode(sk.as_bytes()),
            };
            write_json(&out, &file).expect("write key file");
            let addr = address_from_pk_b64(&file.pk_b64);
            println!("Keypair written: {out}");
            println!("Address: {addr}");
            println!("  Demo only: secret key stored in plaintext JSON.");
        }

        Commands::Address { key, pk_b64 } => {
            let pk = if let Some(k) = key {
                let file: KeypairFile = read_json(&k);
                file.pk_b64
            } else {
                pk_b64.expect("--key or --pk-b64 is required")
            };
            let addr = address_from_pk_b64(&pk);
            println!("{addr}");
        }

        Commands::TxNew { to, amount, nonce, from_key, out } => {
            let kf: KeypairFile = read_json(&from_key);
            // sanity: compute & show sender address
            let sender_addr = address_from_pk_b64(&kf.pk_b64);
            println!("From address: {sender_addr}");
            let tx = Transaction {
                from_pk_b64: kf.pk_b64.clone(),
                to_address: to,
                amount,
                nonce,
                hash_hex: String::new(),
            };
            let tx = tx_with_hash(tx);
            write_json(&out, &tx).expect("write tx");
            println!("TX written: {out}");
            println!("TX hash: {}", tx.hash_hex);
        }

        Commands::Sign { key, tx, out } => {
            let kf: KeypairFile = read_json(&key);
            let sk_bytes = general_purpose::STANDARD.decode(&kf.sk_b64).expect("bad sk b64");
            let pk_bytes = general_purpose::STANDARD.decode(&kf.pk_b64).expect("bad pk b64");
            let sk = d2::SecretKey::from_bytes(sk_bytes);
            let pk = d2::PublicKey::from_bytes(pk_bytes);

            let tx_obj: Transaction = read_json(&tx);
            let bytes = tx_bytes(&tx_obj);
            let sig = d2::sign_detached(&bytes, &sk);

            let env = DetachedSigEnvelope {
                tx_b64: general_purpose::STANDARD.encode(&bytes),
                sig_b64: general_purpose::STANDARD.encode(sig.as_bytes()),
                from_pk_b64: general_purpose::STANDARD.encode(pk.as_bytes()),
            };
            write_json(&out, &env).expect("write envelope");
            println!("Envelope written: {out}");
        }

        Commands::Verify { envelope } => {
            let env: DetachedSigEnvelope = read_json(&envelope);
            let tx_bytes = match general_purpose::STANDARD.decode(&env.tx_b64) {
                Ok(b) => b, Err(_) => { eprintln!("bad tx_b64"); return; }
            };
            let pk_bytes = match general_purpose::STANDARD.decode(&env.from_pk_b64) {
                Ok(b) => b, Err(_) => { eprintln!("bad from_pk_b64"); return; }
            };
            let sig_bytes = match general_purpose::STANDARD.decode(&env.sig_b64) {
                Ok(b) => b, Err(_) => { eprintln!("bad sig_b64"); return; }
            };
            let pk = d2::PublicKey::from_bytes(pk_bytes);
            let sig = d2::DetachedSignature::from_bytes(sig_bytes);

            // Verify signature
            if d2::verify_detached(&sig, &tx_bytes, &pk).is_err() {
                eprintln!(" Signature invalid");
                return;
            }

            // Check TX hash consistency
            if let Ok(tx) = serde_json::from_slice::<Transaction>(&tx_bytes) {
                let recomputed = blake3::hash(&tx_bytes).to_hex().to_string();
                if tx.hash_hex != recomputed {
                    eprintln!("  Hash mismatch: stored={} recomputed={}", tx.hash_hex, recomputed);
                }
                println!(" Signature OK. TX hash: {}", tx.hash_hex);
                // Show derived sender address for clarity
                let addr = address_from_pk_b64(&tx.from_pk_b64);
                println!("From address: {addr}");
            } else {
                eprintln!(" Could not decode tx JSON inside envelope");
            }
        }
    }
}
