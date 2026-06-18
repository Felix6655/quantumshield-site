use wasm_bindgen::prelude::*;
use pqcrypto_dilithium::dilithium2 as d2;
use pqcrypto_traits::sign::{PublicKey as _, SecretKey as _, DetachedSignature as _};

#[wasm_bindgen]
pub fn dilithium_keypair() -> Vec<u8> {
    let (pk, sk) = d2::keypair();
    let pkb = pk.as_bytes();
    let skb = sk.as_bytes();
    let mut out = Vec::with_capacity(4 + pkb.len() + skb.len());
    out.extend_from_slice(&(pkb.len() as u32).to_le_bytes());
    out.extend_from_slice(pkb);
    out.extend_from_slice(skb);
    out
}

#[wasm_bindgen]
pub fn dilithium_sign_detached(msg: &[u8], sk_bytes: &[u8]) -> Result<Vec<u8>, JsValue> {
    let sk = d2::SecretKey::from_bytes(sk_bytes).map_err(|e| JsValue::from_str(&format!("{e:?}")))?;
    let sig = d2::detached_sign(msg, &sk);
    Ok(sig.as_bytes().to_vec())
}

#[wasm_bindgen]
pub fn dilithium_verify_detached(sig_bytes: &[u8], msg: &[u8], pk_bytes: &[u8]) -> Result<bool, JsValue> {
    let pk = d2::PublicKey::from_bytes(pk_bytes).map_err(|e| JsValue::from_str(&format!("{e:?}")))?;
    let sig = d2::DetachedSignature::from_bytes(sig_bytes).map_err(|e| JsValue::from_str(&format!("{e:?}")))?;
    Ok(d2::verify_detached_signature(&sig, msg, &pk).is_ok())
}
