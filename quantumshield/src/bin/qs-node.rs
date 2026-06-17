use std::sync::Arc;
use axum::{routing::{get, post}, Router, extract::State, Json};
use axum::http::StatusCode;
use tokio::sync::RwLock;
use serde::{Serialize, Deserialize};
use base64::{engine::general_purpose, Engine as _};
use blake3;
use pqcrypto_dilithium::dilithium2 as d2;
use bech32::{ToBase32, Variant, encode};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Transaction { from_pk_b64: String, to_address: String, amount: u64, nonce: u64, hash_hex: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct DetachedSigEnvelope { tx_b64: String, sig_b64: String, from_pk_b64: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct MempoolItem { hash: String, to: String, amount: u64, nonce: u64 }
#[derive(Clone)] struct AppState { mempool: Arc<RwLock<Vec<MempoolItem>>> }
#[derive(Serialize)]
struct SubmitResponse { status: &'static str, hash: String, from_address: String }

fn address_from_pk_b64(pk_b64: &str) -> String {
    let pk_bytes = general_purpose::STANDARD.decode(pk_b64).expect("bad pk");
    let h = blake3::hash(&pk_bytes); let short = &h.as_bytes()[..20];
    encode("qs", short.to_base32(), Variant::Bech32).expect("bech32")
}
fn verify_env(env: &DetachedSigEnvelope) -> Option<Transaction> {
    let tx_bytes = general_purpose::STANDARD.decode(&env.tx_b64).ok()?;
    let pk_bytes = general_purpose::STANDARD.decode(&env.from_pk_b64).ok()?;
    let sig_bytes = general_purpose::STANDARD.decode(&env.sig_b64).ok()?;
    let pk = d2::PublicKey::from_bytes(pk_bytes);
    let sig = d2::DetachedSignature::from_bytes(sig_bytes);
    if d2::verify_detached(&sig, &tx_bytes, &pk).is_err() { return None; }
    serde_json::from_slice::<Transaction>(&tx_bytes).ok()
}
async fn health() -> &'static str { "ok" }
async fn get_mempool(State(state): State<AppState>) -> Json<Vec<MempoolItem>> {
    let mp = state.mempool.read().await; Json(mp.clone())
}
async fn submit_tx(State(state): State<AppState>, Json(env): Json<DetachedSigEnvelope>)
  -> (StatusCode, Json<SubmitResponse>) {
    if let Some(tx) = verify_env(&env) {
        let tx_bytes = serde_json::to_vec(&tx).unwrap();
        let recomputed = blake3::hash(&tx_bytes).to_hex().to_string();
        { let mut mp = state.mempool.write().await;
          mp.push(MempoolItem{ hash: recomputed.clone(), to: tx.to_address.clone(), amount: tx.amount, nonce: tx.nonce }); }
        let from_addr = address_from_pk_b64(&tx.from_pk_b64);
        (StatusCode::ACCEPTED, Json(SubmitResponse{ status: "accepted", hash: recomputed, from_address: from_addr }))
    } else {
        (StatusCode::BAD_REQUEST, Json(SubmitResponse{ status: "rejected", hash: String::new(), from_address: String::new() }))
    }
}
#[tokio::main]
async fn main() {
    let state = AppState { mempool: Arc::new(RwLock::new(Vec::new())) };
    let app = Router::new()
        .route("/health", get(health))
        .route("/mempool", get(get_mempool))
        .route("/submit", post(submit_tx))
        .with_state(state);
    let addr = std::net::SocketAddr::from(([127,0,0,1], 8080));
    println!("QS node listening on http://{addr}");
    axum::Server::bind(&addr).serve(app.into_make_service()).aw
cargo run --bin qs-node
# go to your QS root
cd C:\Users\luis\quantumshield

# find the first Rust crate we created (the one with Cargo.toml)
$toml = Get-ChildItem -Recurse -Filter Cargo.toml -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $toml) { Write-Host "No Cargo.toml found. Say: I need to re-init." ; exit }
cd $toml.DirectoryName

pwd
dir Cargo.toml
notepad .\src\bin\qs-node.rs
# At the bottom of the file you should have:
# println!("QS node listening on http://{addr}");
# axum::Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
# (no extra text after that; especially no "cargo run ..." inside the file)
# build everything
cargo build --bins

# run the node (leave this terminal open after it prints the listening line)
cargo run --bin qs-node
# new terminal, same crate folder:
cd C:\Users\luis\quantumshield
cd $toml.DirectoryName

# health check (should return "ok")
Invoke-RestMethod -Uri http://127.0.0.1:8080/health -Method GET

# build the CLI if needed
cargo build

# pick the CLI exe name (one of these will exist)
$exe = ".\target\debug\qs.exe"; if (-not (Test-Path $exe)) { $exe = ".\target\debug\quantumshield.exe" }

# 1) keypair
& $exe keygen --out .\keys\alice.json

# 2) address
$addr = & $exe address --key .\keys\alice.json
$addr

# 3) new tx (send to yourself)
& $exe txnew --to $addr --amount 100 --nonce 1 --from-key .\keys\alice.json --out .\tx.json

# 4) sign
& $exe sign --key .\keys\alice.json --tx .\tx.json --out .\env.json

# 5) submit to the running node
$envJson = Get-Content .\env.json -Raw
Invoke-RestMethod -Uri http://127.0.0.1:8080/submit -Method POST -ContentType "application/json" -Body $envJson

# 6) check mempool
Invoke-RestMethod -Uri http://127.0.0.1:8080/mempool -Method GET
# confirm the node is listening
netstat -ano | findstr :8080
Test-NetConnection 127.0.0.1 -Port 8080
cargo run --bin qs-node
# and use http://127.0.0.1:3008/health etc.
# confirm the node is listening
netstat -ano | findstr :8080
Test-NetConnection 127.0.0.1 -Port 8080
cargo run --bin qs-node
# and use http://127.0.0.1:3008/health etc.

# enter the crate that has Cargo.toml
cd C:\Users\luis\quantumshield
$proj = (Get-ChildItem -Recurse -Filter Cargo.toml | Select-Object -First 1).DirectoryName
Set-Location $proj

# sanity
Get-Item .\Cargo.toml
dir .\src\bin\qs-node.rs

# build and RUN the node (no # at the start)
cargo build --bins
cargo run --bin qs-node
QS node listening on http://127.0.0.1:8080
netstat -ano | findstr :8080
Test-NetConnection 127.0.0.1 -Port 8080
let addr = std::net::SocketAddr::from(([127,0,0,1], 3008));
cargo run --bin qs-node
netstat -ano | findstr :8080
Test-NetConnection 127.0.0.1 -Port 8080
# Go to your QS project root (the folder that has Cargo.toml)
cd C:\Users\luis\quantumshield
$proj = (Get-ChildItem -Recurse -Filter Cargo.toml | Select-Object -First 1).DirectoryName
if (-not $proj) { Write-Host "No Cargo.toml found. Stop here and tell me." ; exit }
Set-Location $proj

# Re-create the node file cleanly (port 3008)
New-Item -ItemType Directory -Force .\src\bin | Out-Null
@'
use std::sync::Arc;
use axum::{routing::{get, post}, Router, extract::State, Json};
use axum::http::StatusCode;
use tokio::sync::RwLock;
use serde::{Serialize, Deserialize};
use base64::{engine::general_purpose, Engine as _};
use blake3;
use pqcrypto_dilithium::dilithium2 as d2;
use bech32::{ToBase32, Variant, encode};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Transaction { from_pk_b64: String, to_address: String, amount: u64, nonce: u64, hash_hex: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct DetachedSigEnvelope { tx_b64: String, sig_b64: String, from_pk_b64: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct MempoolItem { hash: String, to: String, amount: u64, nonce: u64 }
#[derive(Clone)] struct AppState { mempool: Arc<RwLock<Vec<MempoolItem>>> }
#[derive(Serialize)]
struct SubmitResponse { status: &'static str, hash: String, from_address: String }

fn address_from_pk_b64(pk_b64: &str) -> String {
    let pk_bytes = general_purpose::STANDARD.decode(pk_b64).expect("bad pk");
    let h = blake3::hash(&pk_bytes); let short = &h.as_bytes()[..20];
    encode("qs", short.to_base32(), Variant::Bech32).expect("bech32")
}
fn verify_env(env: &DetachedSigEnvelope) -> Option<Transaction> {
    let tx_bytes = general_purpose::STANDARD.decode(&env.tx_b64).ok()?;
    let pk_bytes = general_purpose::STANDARD.decode(&env.from_pk_b64).ok()?;
    let sig_bytes = general_purpose::STANDARD.decode(&env.sig_b64).ok()?;
    let pk = d2::PublicKey::from_bytes(pk_bytes);
    let sig = d2::DetachedSignature::from_bytes(sig_bytes);
    if d2::verify_detached(&sig, &tx_bytes, &pk).is_err() { return None; }
    serde_json::from_slice::<Transaction>(&tx_bytes).ok()
}
async fn health() -> &'static str { "ok" }
async fn get_mempool(State(state): State<AppState>) -> Json<Vec<MempoolItem>> {
    let mp = state.mempool.read().await; Json(mp.clone())
}
async fn submit_tx(State(state): State<AppState>, Json(env): Json<DetachedSigEnvelope>)
  -> (StatusCode, Json<SubmitResponse>) {
    if let Some(tx) = verify_env(&env) {
        let tx_bytes = serde_json::to_vec(&tx).unwrap();
        let recomputed = blake3::hash(&tx_bytes).to_hex().to_string();
        { let mut mp = state.mempool.write().await;
          mp.push(MempoolItem{ hash: recomputed.clone(), to: tx.to_address.clone(), amount: tx.amount, nonce: tx.nonce }); }
        let from_addr = address_from_pk_b64(&tx.from_pk_b64);
        (StatusCode::ACCEPTED, Json(SubmitResponse{ status: "accepted", hash: recomputed, from_address: from_addr }))
    } else {
        (StatusCode::BAD_REQUEST, Json(SubmitResponse{ status: "rejected", hash: String::new(), from_address: String::new() }))
    }
}
#[tokio::main]
async fn main() {
    let state = AppState { mempool: Arc::new(RwLock::new(Vec::new())) };
    let app = Router::new()
        .route("/health", get(health))
        .route("/mempool", get(get_mempool))
        .route("/submit", post(submit_tx))
        .with_state(state);
    let addr = std::net::SocketAddr::from(([127,0,0,1], 3008));
    println!("QS node listening on http://{addr}");
    axum::Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
}
