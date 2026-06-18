#!/usr/bin/env bash
# Downloads the wasi-sysroot (headers + libc.a) needed to cross-compile
# PQClean's C sources (used by pqcrypto-dilithium) to wasm32-unknown-unknown,
# and (re)writes .cargo/config.toml with an absolute path to it so the build
# works regardless of which directory `cargo build` is invoked from, or
# where this repo is checked out. Safe to re-run.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
CRATE_DIR="$(pwd -W 2>/dev/null || pwd)"

SYSROOT_DIR=".wasi-sysroot"
VERSION="33.0+m"
URL="https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-33/wasi-sysroot-33.0%2Bm.tar.gz"

if [ ! -d "$SYSROOT_DIR/wasi-sysroot-$VERSION" ]; then
  mkdir -p "$SYSROOT_DIR"
  echo "Downloading wasi-sysroot $VERSION (~125MB)..."
  curl -sL -o "$SYSROOT_DIR/sysroot.tar.gz" "$URL"
  tar xzf "$SYSROOT_DIR/sysroot.tar.gz" -C "$SYSROOT_DIR"
  rm "$SYSROOT_DIR/sysroot.tar.gz"
fi

mkdir -p .cargo
cat > .cargo/config.toml <<EOF
[target.wasm32-unknown-unknown]
rustflags = ["--cfg", "getrandom_backend=\"wasm_js\""]

[env]
CFLAGS_wasm32_unknown_unknown = "-isystem ${CRATE_DIR}/${SYSROOT_DIR}/wasi-sysroot-${VERSION}/include/wasm32-wasip1"
EOF

echo "wasi-sysroot ready at $SYSROOT_DIR/wasi-sysroot-$VERSION"
echo "wrote .cargo/config.toml with absolute include path for this checkout"
