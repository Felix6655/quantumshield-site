// Points the linker at the wasi-sysroot's libc.a so PQClean's C sources
// (compiled for wasm32-unknown-unknown, which has no libc of its own) can
// resolve memcpy/memset/malloc/etc. Uses CARGO_MANIFEST_DIR so the path is
// absolute and independent of the directory cargo is invoked from.
fn main() {
    let target = std::env::var("TARGET").unwrap_or_default();
    if target != "wasm32-unknown-unknown" {
        return;
    }
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    println!(
        "cargo:rustc-link-search=native={manifest_dir}/.wasi-sysroot/wasi-sysroot-33.0+m/lib/wasm32-wasip1"
    );
    println!("cargo:rustc-link-lib=static=c");
}
