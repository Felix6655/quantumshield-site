export function u8ToHex(u8: Uint8Array): string {
  return Buffer.from(u8).toString("hex");
}
export function hexToU8(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, "hex"));
}
export function toBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}
