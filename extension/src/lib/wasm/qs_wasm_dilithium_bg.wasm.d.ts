/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const dilithium_keypair: () => [number, number];
export const dilithium_sign_detached: (a: number, b: number, c: number, d: number) => [number, number, number, number];
export const dilithium_verify_detached: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
export const PQCRYPTO_RUST_randombytes: (a: number, b: number) => number;
export const __wbindgen_exn_store_command_export: (a: number) => void;
export const __externref_table_alloc_command_export: () => number;
export const __wbindgen_externrefs: WebAssembly.Table;
export const __wbindgen_free_command_export: (a: number, b: number, c: number) => void;
export const __wbindgen_malloc_command_export: (a: number, b: number) => number;
export const __externref_table_dealloc_command_export: (a: number) => void;
export const __wbindgen_start: () => void;
