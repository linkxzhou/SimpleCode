import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";

describe("minitorch", () => {
  it("matches numeric gradients on CPython", () => {
    const result = spawnSync("python3", ["tests/minitorch_grad.py"], { encoding: "utf8" });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /minitorch ok/);
  });
});
