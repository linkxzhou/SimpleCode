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

/** Insert fuller explanation, extra examples, a second exercise, practices, and a summary. */
export function deepen(body, extra) {
  if (!body.includes("## 练习") || !body.includes("## 常见错误")) {
    throw new Error("chapter is missing 练习 or 常见错误");
  }
  const practices = extra.practices.map((item) => `- ${item}`).join("\n");
  const withMiddle = body.replace("## 练习", `${extra.prose.trim()}\n\n${extra.examples.trim()}\n\n## 练习`);
  const ending = `${extra.exercise.trim()}\n\n## 最佳实践\n\n${practices}\n\n## 小结\n\n${extra.summary.trim()}\n\n## 常见错误`;
  return withMiddle.replace("## 常见错误", ending);
}

export { fence, note, answer };
