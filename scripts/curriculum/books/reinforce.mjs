import { goNotes } from "./reinforce-go.mjs";
import { jsNotes } from "./reinforce-js.mjs";
import { pyNotes } from "./reinforce-py.mjs";

const notes = { ...pyNotes, ...jsNotes, ...goNotes };

function clip(code) {
  const flat = code.replace(/`/g, "＇").replace(/\s+/g, " ").trim();
  return flat.length > 160 ? `${flat.slice(0, 160)}…` : flat;
}

function shownExpect(expect) {
  return expect.replace(/\n/g, "↵");
}

function sampleLesson(sample, index) {
  const code = clip(sample.code);
  const expect = shownExpect(sample.expect);
  const step = index === 0 ? "先做" : "做完上一个再做";
  return `### 读「${sample.title}」

${step}这一例。代码收成一行是 \`${code}\`。先盖住终端，用手算结果，纸上的文本里要能找到「${expect}」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「${expect}」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。`;
}

function practiceLesson(item, index, spec) {
  const sample = spec.samples[index % spec.samples.length];
  const ways = [
    "删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。",
    "把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。",
    "少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。",
  ];
  return `实践 ${index + 1} 写成一句就是：${item} 用「${sample.title}」当检查对象。${ways[index % ways.length]} 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「${spec.exercise.title}」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。`;
}

/**
 * Chapter-specific reading notes plus a walkthrough of this chapter's new samples.
 * @param {{ id: string, samples: { title: string, code: string, expect: string }[], practices: string[], summary: string, exercise: { prompt: string, title: string } }} spec
 */
export function reinforce(spec) {
  const note = notes[spec.id];
  if (!note) throw new Error(`missing reinforce note ${spec.id}`);
  const text = [
    note.trim(),
    ...spec.samples.map((sample, index) => sampleLesson(sample, index)),
    ...spec.practices.map((item, index) => practiceLesson(item, index, spec)),
    `练习先不看折叠答案。题目是：${spec.exercise.prompt.trim()} 做完再对照「${spec.exercise.title}」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。`,
    `收束时用一句话复述：${spec.summary} 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。`,
  ].join("\n\n");
  const bare = text.replace(/```[\s\S]*?```/g, "");
  if (bare.length < 1500) throw new Error(`${spec.id} reinforce prose is ${bare.length}, need >= 1500`);
  return text;
}
