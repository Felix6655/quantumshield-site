# qs-wasm-dilithium

Compiles the exact `pqcrypto-dilithium` 0.5 `dilithium2` implementation used by
`qs-node` to WebAssembly, so the browser extension can generate keys and sign
transactions that are byte-compatible with the node's verifier.

`pqcrypto-dilithium` wraps PQClean's C reference code, which needs a real libc
to cross-compile to `wasm32-unknown-unknown` (the target has none by
default). `vendor/` carries two minimally-patched dependencies (`libc::size_t`
/ `libc::c_int` swapped for `core::ffi` equivalents, since the `libc` crate
defines no types at all for bare `wasm32-unknown-unknown`) and `pqclean/` is
pruned to just the dilithium2/3/5 sources actually compiled.

## One-time setup

1. Install a clang that can target wasm32 (the `cc` crate needs it to compile
   PQClean's C sources):
   ```
   winget install -e --id LLVM.LLVM
   ```
2. Add the wasm32 Rust target:
   ```
   rustup target add wasm32-unknown-unknown
   ```
3. Install `wasm-bindgen-cli`, matching the `wasm-bindgen` version in
   `Cargo.toml` (currently resolves to 0.2.125):
   ```
   cargo install wasm-bindgen-cli --version 0.2.125
   ```
4. Fetch the wasi-sysroot (provides the libc headers/archive the C sources
   link against) and generate `.cargo/config.toml` for this checkout:
   ```
   bash scripts/setup-sysroot.sh
   ```

## Building

```
cd extension/wasm-dilithium
PATH="/c/Program Files/LLVM/bin:$PATH" cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/qs_wasm_dilithium.wasm --out-dir pkg --target web
cp pkg/qs_wasm_dilithium*.{js,wasm,d.ts} ../src/lib/wasm/
```

Then `npm run build` from `extension/` picks up the refreshed bindings.
