import { cpSync, copyFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = resolve(root, "dist");

copyFileSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));

mkdirSync(resolve(dist, "icons"), { recursive: true });
cpSync(resolve(root, "public/icons"), resolve(dist, "icons"), { recursive: true });

console.log("Copied manifest.json and icons into dist/");
