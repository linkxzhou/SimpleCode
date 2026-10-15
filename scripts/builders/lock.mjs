// Read one scalar from scripts/sources.lock.json.
// bash 3.2 has no associative arrays, and macOS does not always have python3.
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
let optional = false;
if (args[0] === "--optional") {
  optional = true;
  args.shift();
}
const [lockPath, key] = args;
if (!lockPath || !key) {
  console.error("usage: lock.mjs [--optional] <lock.json> <dotted.key>");
  process.exit(2);
}

const data = JSON.parse(readFileSync(lockPath, "utf8"));
let cur = data;
for (const part of key.split(".")) {
  if (cur == null || typeof cur !== "object" || !Object.prototype.hasOwnProperty.call(cur, part)) {
    if (optional) process.exit(0);
    console.error(`missing lock key ${key}`);
    process.exit(1);
  }
  cur = cur[part];
}
if (cur == null || typeof cur === "object") {
  if (optional && cur == null) process.exit(0);
  console.error(`lock key ${key} is not a scalar`);
  process.exit(1);
}
process.stdout.write(String(cur));
