import { answerRun, run } from "../format.mjs";
import { reinforce } from "./reinforce.mjs";

export function pack(spec) {
  const base = [spec.prose, spec.extra].filter(Boolean).join("\n\n").trim();
  const prose = `${base}\n\n${reinforce(spec)}`.trim();
  const bare = prose.replace(/```[\s\S]*?```/g, "");
  if (bare.length < 500) throw new Error(`${spec.id} extra prose is ${bare.length}, need >= 500`);
  return {
    prose,
    examples: spec.samples.map((sample) => run(sample.lang, sample.code, sample.expect, { title: sample.title })).join("\n\n"),
    practices: spec.practices,
    summary: spec.summary.trim(),
    exercise: `${spec.exercise.prompt.trim()}\n\n${answerRun(spec.exercise.title, spec.exercise.lang, spec.exercise.code, spec.exercise.expect)}`,
  };
}
