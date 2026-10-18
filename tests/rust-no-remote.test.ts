import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const HOST = "weblings.forest-anderson.ca";

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

describe("rust runtime has no remote weblings host", () => {
  it("does not name the demo host in code the page loads", () => {
    const files = [
      ...walk("src"),
      ...walk("public"),
      "scripts/sources.lock.json",
      "scripts/languages.config.mjs",
      "scripts/write-manifest.mjs",
      "scripts/vendor-rust.mjs",
    ];
    const hits = files.filter((path) => readFileSync(path, "utf8").includes(HOST));
    assert.deepEqual(hits, []);
  });
});
