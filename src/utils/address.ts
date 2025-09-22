import { keccak256 } from "js-sha3";
export function addressFromPubKey(pubKeyHex: string): string {
  const hash = keccak256(pubKeyHex);
  return "qs1" + hash.slice(0, 32);
}
export function isValidAddress(addr: string): boolean {
  return /^qs1[0-9a-f]{32}$/.test(addr);
}
