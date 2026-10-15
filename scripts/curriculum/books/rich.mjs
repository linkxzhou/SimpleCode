import { answer, fence, page } from "../lib.mjs";

function clip(code) {
  const flat = code.replace(/`/g, "＇").replace(/\s+/g, " ").trim();
  return flat.length > 150 ? `${flat.slice(0, 150)}…` : flat;
}

function shown(expect) {
  return String(expect).replace(/\n/g, "↵");
}

function block(lang, sample) {
  if (sample.norun) return fence(lang, sample.code, { norun: true, title: sample.title });
  return fence(lang, sample.code, {
    expect: sample.expect,
    title: sample.title,
    stdin: sample.stdin,
    smoke: sample.smoke,
  });
}

function drills(spec) {
  return spec.samples
    .map((sample, index) => {
      const pit = spec.mistakes[index] ?? spec.mistakes[0];
      const practice = spec.practices[index] ?? spec.practices[0];
      if (sample.norun) {
        return `### 限制：${sample.title}

这一段故意不能运行。旁边的限制是：${pit}。做法是：${practice}。把它留在抽屉里对照，不要粘进主编辑器再点工具栏的 Run。能运行的例子在它前后，改那些例子时不要把这里的调用加进去。`;
      }
      return `### 只改一处：${sample.title}

这一例要避开的失误是：${pit}。对应的做法是：${practice}。

把代码收成一行来核对：\`${clip(sample.code)}\`。盖住终端，先写下预测，里面要能找到「${shown(sample.expect)}」。然后点这个代码块上的 Run。结果不同时，只改产生该值的那一行，再用工具栏的 Run 看新结果。不要把两处不相关的改动叠在一起。确认之后点撤销，下一例才会从文档里的代码开始。

若出现报错，先看错误类型的名字，再回到本章的常见错误。期望是子串，多出来的说明行不算失败，缺了「${shown(sample.expect)}」才算失败。`;
    })
    .join("\n\n");
}

function closeNote(spec) {
  const goals = spec.goals.map((goal) => `「${goal}」`).join("、");
  return `## 读完再动手

本章要留下的是 ${goals}。合上抽屉之前，用自己的话说出每一项目标对应哪一个示例的标题。对不上标题，就还没有把目标和代码连起来，先别展开练习答案。

练习的答案默认折着。先在编辑器里自己写，再展开对照。对照时只看输出是否包含期望的那几个字。两道都过了再进入下一章。下一次运行是新进程，这次的变量不会留下。

把这一章当成一次可以反复撤销的实验。点代码块上的 Run 会用示例覆盖编辑器，原来的草稿先备份。你改过的内容如果还想留着，先复制到别处，再点下一例。工具栏的 Run 不会从文档重写编辑器，所以它用来看你改过的版本。两种按钮各做各的事。下载进度写在按钮旁边，第一次打开这种语言时要等它结束，再判断示例是不是写错了。

记录你预测错的那一次。写下你以为会打印的文字，以及实际多出来或少掉的部分。进入下一章之前，要能用一句话说清差在哪。通过只说明期望的那几个字还在，不说明你已经看懂产生它的那一行。章节标题下的目标就是这份验收清单。差两个字也不要靠改期望凑过去。`;
}

function walk(sample, index) {
  if (sample.norun) {
    return `「${sample.title}」故意不能运行。先读它旁边的限制，再回到能点 Run 的例子上改一个值。不要把只读块当成坏掉的按钮。`;
  }
  const code = clip(sample.code);
  const expect = shown(sample.expect);
  const step = index === 0 ? "先做" : "做完上一例再做";
  return `### 读「${sample.title}」

${step}这一例。把代码收成一行来记：\`${code}\`。先盖住终端，写下你预测的输出，里面要能找到「${expect}」。这是子串：前面可以有别的字，后面通常有换行。

然后点这个代码块上的 Run，不要点工具栏。代码块会备份草稿、写入示例再执行。找不到这段文字时，先看退出码。不是 0 就读错误类型，不要改期望。是 0 但内容不对，就只改产生该值的那一处。改完用工具栏的 Run，因为再点代码块会把修改盖掉。预测对了之后点撤销。`;
}

/**
 * One original chapter: prose, runnable samples, pitfalls, practices, summary, two answers.
 * @param {string} language
 * @param {string[]} sources
 * @param {object} spec
 */
export function emit(language, sources, spec) {
  const minutes = Math.max(spec.chapter === 0 ? 12 : 18, spec.minutes ?? 0);
  const level = spec.chapter === 0 ? spec.level : spec.level ?? "beginner";
  const exercises = spec.exercises.map(
    (ex) => `${ex.prompt.trim()}\n\n${answer(ex.title, block(language, { title: "参考答案", code: ex.code, expect: ex.expect, stdin: ex.stdin }))}`,
  );
  const body = [
    spec.prose.trim(),
    spec.samples.map((sample) => block(language, sample)).join("\n\n"),
    spec.samples.map((sample, index) => walk(sample, index)).join("\n\n"),
    drills(spec),
    closeNote(spec),
    `## 常见错误\n\n${spec.mistakes.map((item) => `- ${item}`).join("\n")}`,
    `## 最佳实践\n\n${spec.practices.map((item) => `- ${item}`).join("\n")}`,
    `## 小结\n\n${spec.summary.trim()}`,
    `## 练习\n\n${exercises.join("\n\n")}`,
    `## 延伸阅读\n\n${spec.links.trim()}`,
    `## 参考与致谢\n\n${spec.credit.trim()}`,
  ].join("\n\n");
  const prose = body.replace(/```[\s\S]*?```/g, "");
  const minProse = spec.chapter === 0 ? 900 : 1500;
  const minBody = spec.chapter === 0 ? 2800 : 3200;
  if (prose.length < minProse || body.length < minBody) {
    throw new Error(`${language} ch ${spec.chapter} prose ${prose.length} body ${body.length} (need prose ${minProse}, body ${minBody})`);
  }
  const runnable = spec.samples.filter((s) => !s.norun).length + spec.exercises.length;
  const minRun = spec.chapter === 0 ? 3 : 5;
  if (runnable < minRun) throw new Error(`${language} ch ${spec.chapter} runnable ${runnable} < ${minRun}`);
  if (spec.exercises.length < 2) throw new Error(`${language} ch ${spec.chapter} needs 2 exercises`);
  return page(
    {
      language,
      sources,
      chapter: spec.chapter,
      slug: spec.slug,
      title: spec.title,
      level,
      minutes,
      goals: spec.goals,
    },
    body,
  );
}

export function book(language, sources, chapters) {
  const pages = [];
  const problems = [];
  for (const spec of chapters) {
    try {
      pages.push(emit(language, sources, spec));
    } catch (err) {
      problems.push(err.message);
    }
  }
  if (problems.length) throw new Error(problems.join("\n"));
  return pages;
}
