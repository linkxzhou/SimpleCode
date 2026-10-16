import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { coiReloadDecision, coiUrls } from "../src/coi.ts";
import { en, zh } from "../src/i18n/messages.ts";

describe("coi urls", () => {
  it("keeps the worker under the site root", () => {
    assert.deepEqual(coiUrls("/", "http://127.0.0.1:4173/"), {
      script: "http://127.0.0.1:4173/coi-serviceworker.js",
      scope: "http://127.0.0.1:4173/",
    });
  });

  it("follows a subdirectory base, with or without a trailing slash", () => {
    const href = "http://127.0.0.1:4173/SimpleCode/index.html";
    const expected = {
      script: "http://127.0.0.1:4173/SimpleCode/coi-serviceworker.js",
      scope: "http://127.0.0.1:4173/SimpleCode/",
    };
    assert.deepEqual(coiUrls("/SimpleCode/", href), expected);
    assert.deepEqual(coiUrls("/SimpleCode", href), expected);
  });

  it("resolves a relative base against the page", () => {
    assert.deepEqual(coiUrls("./", "http://127.0.0.1:4173/app/index.html"), {
      script: "http://127.0.0.1:4173/app/coi-serviceworker.js",
      scope: "http://127.0.0.1:4173/app/",
    });
  });
});

describe("coi reload", () => {
  const ready = { isolated: false, canRegister: true, activated: true, alreadyReloaded: false };

  it("does nothing when the document is already isolated", () => {
    assert.equal(coiReloadDecision({ ...ready, isolated: true }), "use-page");
  });

  it("reloads once after the worker activates", () => {
    assert.equal(coiReloadDecision(ready), "reload");
  });

  it("stops after that reload instead of looping", () => {
    assert.equal(coiReloadDecision({ ...ready, alreadyReloaded: true }), "show-error");
  });

  it("shows the error page when service workers cannot run", () => {
    assert.equal(coiReloadDecision({ ...ready, canRegister: false }), "show-error");
    assert.equal(coiReloadDecision({ ...ready, activated: false }), "show-error");
  });
});

describe("coi worker source", () => {
  const src = readFileSync(new URL("../public/coi-serviceworker.js", import.meta.url), "utf8");

  it("sets require-corp and does not load a remote script", () => {
    assert.match(src, /Cross-Origin-Embedder-Policy", "require-corp"/);
    assert.match(src, /Cross-Origin-Opener-Policy", "same-origin"/);
    assert.doesNotMatch(src, /https?:\/\//);
    assert.doesNotMatch(src, /credentialless/);
  });
});

describe("isolation fallback copy", () => {
  it("mentions plain static hosting over localhost and https", () => {
    for (const text of [zh.isolationAfter, en.isolationAfter]) {
      assert.match(text, /http:\/\/localhost/);
      assert.match(text, /https/);
      assert.match(text, /file:\/\//);
    }
  });
});
