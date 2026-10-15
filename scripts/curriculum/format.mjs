import { answer, fence, note, page } from "./lib.mjs";

export function run(lang, code, expect, attrs = {}) {
  return fence(lang, code, { expect, ...attrs });
}

export function lesson(defaults, meta, body) {
  return page({ minutes: 12, ...defaults, ...meta }, body.trim() + "\n");
}

export function mistakes(items) {
  return `## 常见错误\n\n${items.map((item) => `- ${item}`).join("\n")}`;
}

export function answerRun(title, lang, code, expect, attrs = {}) {
  return answer(title, run(lang, code, expect, { title: "参考答案", ...attrs }));
}

export { fence, note, answer };
