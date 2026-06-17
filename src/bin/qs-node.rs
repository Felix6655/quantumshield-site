use std::sync::Arc;
use axum::{routing::{get, post}, Router, extract::State, Json};
use axum::http::StatusCode;
use tokio::sync::RwLock;
use serde::{Serialize, Deserialize};
use base64::{engine::general_purpose, Engine as _};
use blake3;
use pqcrypto_dilithium::dilithium2 as d2;
// Bring trait methods like from_bytes() / as_bytes() into scope
use pqcrypto_traits::sign::{PublicKey as _, DetachedSignature as _};
use bech32::{ToBase32, Variant, encode};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Transaction { from_pk_b64: String, to_address: String, amount: u64, nonce: u64, hash_hex: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct DetachedSigEnvelope { tx_b64: String, sig_b64: String, from_pk_b64: String }
#[derive(Serialize, Deserialize, Debug, Clone)]
struct MempoolItem { hash: String, to: String, amount: u64, nonce: u64 }
#[derive(Clone)] struct AppState { mempool: Arc<RwLock<Vec<MempoolItem>>> }
#[derive(Serialize)] struct SubmitResponse { status: &'static str, hash: String, from_address: String }

fn address_from_pk_b64(pk_b64: &str) -> String {
    let pk_bytes = general_purpose::STANDARD.decode(pk_b64).expect("bad pk");
    let h = blake3::hash(&pk_bytes); let short = &h.as_bytes()[..20];
    encode("qs", short.to_base32(), Variant::Bech32).expect("bech32")
}
fn verify_env(env: &DetachedSigEnvelope) -> Option<Transaction> {
    let tx_bytes = general_purpose::STANDARD.decode(&env.tx_b64).ok()?;
    let pk_bytes = general_purpose::STANDARD.decode(&env.from_pk_b64).ok()?;
    let sig_bytes = general_purpose::STANDARD.decode(&env.sig_b64).ok()?;
    let pk = d2::PublicKey::from_bytes(&pk_bytes).ok()?;
    let sig = d2::DetachedSignature::from_bytes(&sig_bytes).ok()?;
    if d2::verify_detached_signature(&sig, &tx_bytes, &pk).is_err() { return None; }
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
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
