use std::{fs, path::Path};
use std::io::Write;
use clap::{Parser, Subcommand};
use serde::{Serialize, Deserialize};
use base64::{engine::general_purpose, Engine as _};
use bech32::{ToBase32, Variant, encode};
use blake3;
use pqcrypto_dilithium::dilithium2 as d2;
use pqcrypto_kyber::kyber1024 as k1024;

#[derive(Parser)]
#[command(name="qs", version="0.1.0", about="QuantumShield CLI (demo)")]
struct Cli { #[command(subcommand)] command: Commands }

#[derive(Subcommand)]
enum Commands {
    Keygen { #[arg(long)] out: String },
    Address { #[arg(long, conflicts_with="pk_b64")] key: Option<String>,
              #[arg(long, conflicts_with="key")] pk_b64: Option<String> },
    TxNew { #[arg(long)] to: String, #[arg(long)] amount: u64, #[arg(long)] nonce: u64,
            #[arg(long)] from_key: String, #[arg(long)] out: String },
    Sign { #[arg(long)] key: String, #[arg(long)] tx: String, #[arg(long)] out: String },
    Verify { #[arg(long)] envelope: String },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct KeypairFile { pk_b64: String, sk_b64: String }

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Transaction {
    from_pk_b64: String, to_address: String, amount: u64, nonce: u64, hash_hex: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct DetachedSigEnvelope { tx_b64: String, sig_b64: String, from_pk_b64: String }

fn write_json<T: Serialize>(path: &str, value: &T) -> std::io::Result<()> {
    if let Some(parent) = Path::new(path).parent() { if !parent.as_os_str().is_empty() { fs::create_dir_all(parent)?; } }
    let data = serde_json::to_vec_pretty(value).expect("serialize");
    let mut f = fs::File::create(path)?; f.write_all(&data)?; Ok(())
}
fn read_json<T: for<'de> serde::Deserialize<'de>>(path: &str) -> T {
    let data = fs::read(path).expect("read file"); serde_json::from_slice::<T>(&data).expect("parse json")
}
fn address_from_pk_b64(pk_b64: &str) -> String {
    let pk_bytes = general_purpose::STANDARD.decode(pk_b64).expect("bad pk b64");
    let h = blake3::hash(&pk_bytes); let short = &h.as_bytes()[..20];
    encode("qs", short.to_base32(), Variant::Bech32).expect("bech32 encode")
}
fn tx_bytes(tx: &Transaction) -> Vec<u8> { serde_json::to_vec(tx).expect("serialize tx") }
fn tx_with_hash(mut tx: Transaction) -> Transaction { let b = tx_bytes(&tx); tx.hash_hex = blake3::hash(&b).to_hex().to_string(); tx }

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
            println!("Keypair written: {out}");
            println!("Address: {}", address_from_pk_b64(&file.pk_b64));
            println!("WARNING: demo stores secret key in plaintext JSON.");
        }
        Commands::Address { key, pk_b64 } => {
            let pk = if let Some(k) = key { read_json::<KeypairFile>(&k).pk_b64 } else { pk_b64.expect("--key or --pk-b64") };
            println!("{}", address_from_pk_b64(&pk));
        }
        Commands::TxNew { to, amount, nonce, from_key, out } => {
            let kf: KeypairFile = read_json(&from_key);
            let tx = tx_with_hash(Transaction {
                from_pk_b64: kf.pk_b64.clone(), to_address: to, amount, nonce, hash_hex: String::new(),
            });
            write_json(&out, &tx).expect("write tx");
            println!("TX written: {out}"); println!("TX hash: {}", tx.hash_hex);
        }
        Commands::Sign { key, tx, out } => {
            let kf: KeypairFile = read_json(&key);
            let sk = d2::SecretKey::from_bytes(general_purpose::STANDARD.decode(&kf.sk_b64).expect("bad sk"));
            let pk = d2::PublicKey::from_bytes(general_purpose::STANDARD.decode(&kf.pk_b64).expect("bad pk"));
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
            let tx_bytes = match general_purpose::STANDARD.decode(&env.tx_b64) { Ok(b)=>b, Err(_)=>{ eprintln!("bad tx_b64"); return; } };
            let pk_bytes = match general_purpose::STANDARD.decode(&env.from_pk_b64) { Ok(b)=>b, Err(_)=>{ eprintln!("bad from_pk_b64"); return; } };
            let sig_bytes = match general_purpose::STANDARD.decode(&env.sig_b64) { Ok(b)=>b, Err(_)=>{ eprintln!("bad sig_b64"); return; } };
            let pk = d2::PublicKey::from_bytes(pk_bytes);
            let sig = d2::DetachedSignature::from_bytes(sig_bytes);
            if d2::verify_detached(&sig, &tx_bytes, &pk).is_err() { eprintln!("Signature invalid"); return; }
            if let Ok(tx) = serde_json::from_slice::<Transaction>(&tx_bytes) {
                let recomputed = blake3::hash(&tx_bytes).to_hex().to_string();
                if tx.hash_hex != recomputed { eprintln!("Hash mismatch: stored={} recomputed={}", tx.hash_hex, recomputed); }
                println!("Signature OK. TX hash: {}", tx.hash_hex);
                println!("From address: {}", address_from_pk_b64(&tx.from_pk_b64));
            } else { eprintln!("Could not decode tx JSON"); }
        }
    }
}
