import { answerRun, deepen, fence, lesson, mistakes, note, run } from "../format.mjs";
import { jsPack } from "./depth-js.mjs";

const SRC = ["mdn-js", "lxiy-js"];
const J = (meta, body) =>
  lesson(
    { language: "js", sources: SRC },
    { ...meta, minutes: Math.max(meta.chapter === 0 ? 12 : 18, meta.minutes ?? 0) },
    deepen(body, jsPack(meta.chapter)),
  );
const tail = (items) => `${mistakes(items)}

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。`;

export const pages = [
  J({ chapter: 0, file: "index.md", title: "概览：没有页面的 JavaScript", minutes: 8, goals: ["区分引擎和浏览器", "用 console.log 输出", "不使用 DOM、fetch 和 import"], sources: ["mdn-js", "lxiy-js", "javascript-info"] }, `
这里的 JavaScript 跑在 QuickJS 上，不是浏览器页面。没有 \`document\`、\`window\`、\`fetch\`，也不能 \`import\` 别的文件。\`console.log\` 的多个参数会用空格拼在一起。

TypeScript 章节会先去掉类型再运行，编辑器里看到的是转译后的 JavaScript，并带一行说明注释。工具栏上的 JS / TS 开关是另一条路：你自己写的 \`.ts\` 草稿会在点击 Run 时用同一套转译。

${run("js", 'console.log("你好")', "你好", { title: "问候" })}

${fence("js", "// 只读：这里没有页面，也没有网络。\n// document.querySelector('#app')\n// fetch('https://example.com')", { norun: true, title: "不存在的 API" })}

${run("js", "console.log(6 * 7)", "42", { title: "运算" })}

## 练习

打印一行你自己的问候。

${answerRun("参考答案", "js", 'console.log("你好，杭州")', "你好，杭州")}

${tail(["把教程里的浏览器示例原样贴进来。document 在这里是未定义的。", "用 import 或 export。程序必须是单个文件。"])}`),

  J({ chapter: 1, slug: "values", title: "值与变量", level: "beginner", goals: ["用 let 和 const", "用 typeof 辨认类型", "交换两个绑定"] }, `
\`let\` 可以重新赋值，\`const\` 不能改绑定，但对象的内容仍可改。\`typeof null\` 是 \`"object"\`，这是历史遗留，判断空值请直接和 \`null\` 比较。

${run("js", 'const name = "Ada";\nlet year = 2026;\nyear = year + 1;\nconsole.log(typeof name);\nconsole.log(year);', "string", { title: "类型" })}

${run("js", "let a = 1;\nlet b = 2;\nconst t = a;\na = b;\nb = t;\nconsole.log(a, b);", "2 1", { title: "交换" })}

${run("js", 'console.log(typeof null);\nconsole.log(typeof 1);\nconsole.log(typeof undefined);', "object", { title: "typeof" })}

## 练习

交换后打印第二个变量，确认它变成了 1。

${answerRun("参考答案", "js", "let a = 1;\nlet b = 2;\n[a, b] = [b, a];\nconsole.log(b);", "1")}

${tail(["用 var 并依赖提升。新代码用 let 和 const，作用域更好懂。", "const 对象就以为字段也不能改。冻结的是绑定，不是对象内容。"])}`),

  J({ chapter: 2, slug: "strings", title: "运算与字符串", level: "beginner", goals: ["区分 == 和 ===", "拼接字符串", "按单词反转"] }, `
\`===\` 不转换类型，\`==\` 会。\`"6" + 7\` 是拼接，\`"6" * 7\` 才变成数字运算。教学示例一律用 \`===\`。

模板字符串能插值，但为了少一层转义，示例用加号拼接，效果一样。

${run("js", 'console.log("6" + 7);\nconsole.log(Number("6") + 7);\nconsole.log(1 === 1);', "67", { title: "转换" })}

${run("js", 'const name = "Ada";\nconsole.log("你好，" + name);', "你好，Ada", { title: "拼接" })}

${run("js", 'const words = "one two".split(" ");\nconsole.log(words.reverse().join(" "));', "two one", { title: "反转单词" })}

## 练习

判断 \`0 == "0"\` 和 \`0 === "0"\`，各打印 true 或 false。

${answerRun("参考答案", "js", 'console.log(0 == "0");\nconsole.log(0 === "0");', "true")}

${tail(["用 == 比较用户输入。类型一转换，空字符串和 0 会变成同一件事。", "reverse 会改原数组。要保留原顺序就先 slice。"])}`),

  J({ chapter: 3, slug: "control", title: "控制流", level: "beginner", goals: ["写 if 和 switch", "用 for 与 for...of", "打印九九乘法表的一行"] }, `
代码块用花括号。\`for...of\` 遍历值，\`for...in\` 遍历键，数组请用 of。\`switch\` 要用 \`break\`，否则会继续掉进下一支。

${run("js", 'const lines = [];\nfor (let n = 1; n <= 7; n++) {\n  if (n % 15 === 0) lines.push("FizzBuzz");\n  else if (n % 3 === 0) lines.push("Fizz");\n  else if (n % 5 === 0) lines.push("Buzz");\n  else lines.push(String(n));\n}\nconsole.log(lines.join(" "));', "1 2 Fizz 4 Buzz Fizz 7", { title: "FizzBuzz" })}

${run("js", 'let row = "";\nfor (let i = 1; i <= 3; i++) row += "2x" + i + "=" + 2 * i + " ";\nconsole.log(row.trim());', "2x1=2 2x2=4 2x3=6", { title: "乘法表一行" })}

${run("js", 'const n = 2;\nswitch (n) {\n  case 1:\n    console.log("一");\n    break;\n  case 2:\n    console.log("二");\n    break;\n  default:\n    console.log("其他");\n}', "二", { title: "switch" })}

## 练习

用 for...of 求 \`[1, 2, 3]\` 的和。

${answerRun("参考答案", "js", "let s = 0;\nfor (const n of [1, 2, 3]) s += n;\nconsole.log(s);", "6")}

${tail(["case 后面忘记 break。", "for...in 遍历数组。它给出的是下标字符串，还可能带上额外的键。"])}`),

  J({ chapter: 4, slug: "functions", title: "函数", level: "beginner", goals: ["写函数声明和箭头函数", "使用默认参数", "用闭包做计数器"] }, `
函数声明会被提升，箭头函数不会。箭头函数没有自己的 \`arguments\`。默认参数在调用时、且调用者没传该参数时才求值。

闭包让内部函数记住外部的 \`let\`。

${run("js", "function add(a, b = 1) {\n  return a + b;\n}\nconst mul = (a, b) => a * b;\nconsole.log(add(41));\nconsole.log(mul(6, 7));", "42", { title: "两种函数" })}

${run("js", "function counter() {\n  let n = 0;\n  return () => {\n    n += 1;\n    return n;\n  };\n}\nconst next = counter();\nconsole.log(next());\nconsole.log(next());", "1", { title: "计数器" })}

${run("js", "function memo(fn) {\n  const saved = new Map();\n  return (n) => {\n    if (!saved.has(n)) saved.set(n, fn(n));\n    return saved.get(n);\n  };\n}\nconst fib = memo((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));\nconsole.log(fib(8));", "21", { title: "记忆化" })}

## 练习

写一个箭头函数，把数字乘 2，打印 21 的结果。

${answerRun("参考答案", "js", "const twice = (n) => n * 2;\nconsole.log(twice(21));", "42")}

${tail(["在箭头函数里用 arguments。改用剩余参数 ...args。", "递归的 const fib = (n) => fib(...) 在记忆化包装之前调用自身。上面先写成依赖外部名字的形式。"])}`),

  J({ chapter: 5, slug: "arrays", title: "数组", level: "intermediate", goals: ["用 map、filter、reduce", "排序时提供比较函数", "把一层嵌套摊平"] }, `
\`map\` 产生新数组，\`filter\` 留下通过测试的项，\`reduce\` 收成一个值。它们都不改原数组；\`sort\` 会改。

数字排序必须给比较函数，否则会按文本排，\`10\` 会排在 \`2\` 前面。

${run("js", "const scores = [40, 80, 90];\nconst passed = scores.filter((n) => n >= 60);\nconst avg = passed.reduce((s, n) => s + n, 0) / passed.length;\nconsole.log(avg);", "85", { title: "及格平均" })}

${run("js", "const nums = [10, 2, 1];\nconsole.log(nums.slice().sort((a, b) => a - b).join(\",\"));", "1,2,10", { title: "数字排序" })}

${run("js", "const nested = [[1], [2, 3]];\nconst flat = [];\nfor (const row of nested) flat.push(...row);\nconsole.log(flat.join(\",\"));", "1,2,3", { title: "摊平一层" })}

## 练习

map 出平方，打印 \`1,4,9\`。

${answerRun("参考答案", "js", 'console.log([1, 2, 3].map((n) => n * n).join(","));', "1,4,9")}

${tail(["sort() 不带比较函数就排序数字。", "reduce 忘记初始值，空数组会抛错。"])}`),

  J({ chapter: 6, slug: "objects", title: "对象与解构", level: "intermediate", goals: ["用展开合并对象", "用可选链读取可能缺失的字段", "用 JSON 编解码"] }, `
对象是键值集合。展开 \`{ ...a, ...b }\` 后者覆盖前者的同名键。可选链 \`?.\` 在左边是 null 或 undefined 时短路。

\`JSON.stringify\` 只保留可序列化的数据，函数和 \`undefined\` 会被丢掉。

${run("js", 'const base = { theme: "light", size: 12 };\nconst extra = { size: 14 };\nconst cfg = { ...base, ...extra };\nconsole.log(cfg.theme, cfg.size);', "light 14", { title: "合并配置" })}

${run("js", 'const user = { name: "Ada" };\nconsole.log(user.city?.name ?? "未知");\nconsole.log(JSON.stringify({ name: user.name, n: 1 }));', "未知", { title: "可选链与 JSON" })}

${run("js", 'const { a, b = 2 } = { a: 1 };\nconsole.log(a + b);', "3", { title: "解构" })}

## 练习

把 JSON 文本 \`{"n":41}\` 解析后加 1。

${answerRun("参考答案", "js", 'const data = JSON.parse(\'{"n":41}\');\nconsole.log(data.n + 1);', "42")}

${tail(["用展开做深拷贝。嵌套对象仍然是同一份。", "JSON.parse 用户输入却不 try。坏文本会抛 SyntaxError。"])}`),

  J({ chapter: 7, slug: "classes", title: "类与原型", level: "intermediate", goals: ["用 class 声明方法", "用 extends 复用", "知道方法找得到是因为原型链"] }, `
\`class\` 是原型的语法。方法放在原型上，实例自己的字段放在对象上。\`extends\` 把原型连起来，子类构造函数要先 \`super\`。

\`instanceof\` 沿着这条链判断。

${run("js", "class Rect {\n  constructor(w, h) {\n    this.w = w;\n    this.h = h;\n  }\n  area() {\n    return this.w * this.h;\n  }\n}\nconsole.log(new Rect(3, 4).area());", "12", { title: "矩形" })}

${run("js", "class Stack {\n  constructor() {\n    this.items = [];\n  }\n  push(v) {\n    this.items.push(v);\n  }\n  pop() {\n    return this.items.pop();\n  }\n}\nconst s = new Stack();\ns.push(7);\nconsole.log(s.pop());", "7", { title: "栈" })}

${run("js", 'class Animal {\n  speak() {\n    return "...";\n  }\n}\nclass Cat extends Animal {\n  speak() {\n    return "meow";\n  }\n}\nconst pet = new Cat();\nconsole.log(pet.speak());\nconsole.log(pet instanceof Animal);', "meow", { title: "继承" })}

## 练习

写一个 Queue，enqueue 再 dequeue，打印先放进去的 1。

${answerRun("参考答案", "js", "class Queue {\n  constructor() { this.items = []; }\n  enqueue(v) { this.items.push(v); }\n  dequeue() { return this.items.shift(); }\n}\nconst q = new Queue();\nq.enqueue(1);\nq.enqueue(2);\nconsole.log(q.dequeue());", "1")}

${tail(["在子类构造函数里先用 this 再 super。", "把方法直接赋到实例上却以为改的是所有对象。那只影响这一个实例。"])}`),

  J({ chapter: 8, slug: "errors", title: "错误处理", level: "intermediate", goals: ["用 try / catch 接住 throw", "区分错误类型", "解析可能损坏的 JSON"] }, `
\`throw\` 可以抛任何值，习惯抛 \`Error\` 或其子类，这样有消息和堆栈。\`catch\` 接住后程序继续。不要空 catch。

JSON 损坏是可预期的失败，适合就地告诉调用者。

${run("js", 'function parse(text) {\n  try {\n    return JSON.parse(text).n;\n  } catch (err) {\n    return "坏 JSON";\n  }\n}\nconsole.log(parse(\'{"n":1}\'));\nconsole.log(parse("nope"));', "1", { title: "解析 JSON" })}

${run("js", 'class EmptyInput extends Error {}\nfunction need(text) {\n  if (text.trim() === "") throw new EmptyInput("空白");\n  return text;\n}\ntry {\n  need("  ");\n} catch (err) {\n  console.log(err instanceof EmptyInput ? "空" : "其他");\n}', "空", { title: "自定义错误" })}

${run("js", 'function divide(a, b) {\n  if (b === 0) throw new Error("zero");\n  return a / b;\n}\nconsole.log(divide(10, 2));', "5", { title: "先检查再算" })}

## 练习

catch 住一次 throw，打印「接住了」。

${answerRun("参考答案", "js", 'try {\n  throw new Error("x");\n} catch (err) {\n  console.log("接住了");\n}', "接住了")}

${tail(["catch 之后不记录就继续。失败原因会消失。", "用字符串 throw。instanceof Error 会失败。"])}`),

  J({ chapter: 9, slug: "iterators", title: "迭代器与生成器", level: "advanced", goals: ["让对象能被 for...of", "用 function* 产出序列", "只取前几项"] }, `
\`for...of\` 会找 \`Symbol.iterator\`。生成器函数返回的对象自带这个方法，\`yield\` 一次给一个值。

不要依赖 \`setTimeout\`。需要「稍后」时，用已经完成的 Promise，下一章再讲。

${run("js", "function* range(start, end) {\n  for (let n = start; n <= end; n++) yield n;\n}\nlet sum = 0;\nfor (const n of range(1, 3)) sum += n;\nconsole.log(sum);", "6", { title: "范围" })}

${run("js", "function* fibs() {\n  let a = 0;\n  let b = 1;\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\nconst out = [];\nfor (const n of fibs()) {\n  if (out.length === 6) break;\n  out.push(n);\n}\nconsole.log(out.join(\",\"));", "0,1,1,2,3,5", { title: "斐波那契" })}

${run("js", "const bag = {\n  data: [3, 1],\n  [Symbol.iterator]() {\n    let i = 0;\n    const data = this.data;\n    return {\n      next() {\n        if (i < data.length) return { value: data[i++], done: false };\n        return { done: true };\n      },\n    };\n  },\n};\nconsole.log([...bag].join(\",\"));", "3,1", { title: "自定义迭代" })}

## 练习

生成器产出 2 和 4，打印它们的和。

${answerRun("参考答案", "js", "function* evens() {\n  yield 2;\n  yield 4;\n}\nlet s = 0;\nfor (const n of evens()) s += n;\nconsole.log(s);", "6")}

${tail(["对无限生成器直接展开成数组。先限制次数。", "生成器只能走一遍。再 for 一次不会重新开始，需要再调用函数。"])}`),

  J({ chapter: 10, slug: "promises", title: "Promise 与 async", level: "advanced", goals: ["链接已经完成的 Promise", "用 async / await 写顺序", "用 Promise.all 等待多项"] }, `
Promise 表示一个将来的结果。这里没有计时器，也不要写 \`setTimeout\`：QuickJS 可能不会为它把进程留住。示例只用已经有结果的 Promise，微任务会在本次运行里完成。

\`async\` 函数返回 Promise。\`await\` 取出里面的值。

${run("js", "Promise.resolve(21)\n  .then((n) => n * 2)\n  .then((n) => console.log(n));", "42", { title: "链接" })}

${run("js", "async function main() {\n  const n = await Promise.resolve(21);\n  console.log(n * 2);\n}\nmain();", "42", { title: "async" })}

${run("js", "async function main() {\n  const parts = await Promise.all([Promise.resolve(2), Promise.resolve(3)]);\n  console.log(parts[0] + parts[1]);\n}\nmain();", "5", { title: "Promise.all" })}

${fence("js", "// 只读：不要靠 setTimeout 制造先后。\n// setTimeout(() => console.log(1), 0);", { norun: true, title: "不用计时器" })}

## 练习

await 一个拒绝的 Promise，catch 后打印「失败」。

${answerRun("参考答案", "js", "async function main() {\n  try {\n    await Promise.reject(new Error(\"x\"));\n  } catch (err) {\n    console.log(\"失败\");\n  }\n}\nmain();", "失败")}

${tail(["忘记从 async 函数返回，调用者拿不到结果。", "Promise 构造函数里同步抛错却没 reject。用 reject 或让函数抛到 then 链外之前先包住。"])}`),

  J({ chapter: 11, slug: "typescript", title: "TypeScript 入门", level: "advanced", minutes: 14, goals: ["给参数和返回值加类型", "用 interface 描述对象", "知道这里只去类型、不做检查"], sources: ["mdn-js", "ts-handbook", "lxiy-js"] }, `
\`ts\` 代码块会用项目里的 Sucrase 去掉类型，再交给 QuickJS。没有类型检查：错误的标注也会跑。编辑器里放的是转译后的 JavaScript，第一行注释说明原文在文档里。

联合类型在运行时就是普通的值，收窄要自己判断。

${run("ts", "interface Todo {\n  title: string;\n  done: boolean;\n}\nconst item: Todo = { title: \"买笔\", done: false };\nconsole.log(item.title);", "买笔", { title: "待办" })}

${run("ts", "function add(a: number, b: number): number {\n  return a + b;\n}\nconsole.log(add(20, 22));", "42", { title: "标注函数" })}

${run("ts", "type Id = string | number;\nfunction show(x: Id): string {\n  if (typeof x === \"number\") return \"n:\" + x;\n  return \"s:\" + x;\n}\nconsole.log(show(7));", "n:7", { title: "联合类型" })}

## 练习

写一个泛型函数 identity，传入 42 再打印。类型参数会被去掉，运行结果与普通函数相同。

${answerRun("参考答案", "ts", "function identity<T>(value: T): T {\n  return value;\n}\nconsole.log(identity(42));", "42")}

${tail(["指望转译器拒绝错误类型。Sucrase 只删除类型。", "在 ts 块里写 import。转译后仍然是单文件，没有模块加载。"])}`),

  J({ chapter: 12, slug: "typescript-project", title: "TS 进阶与小项目", level: "advanced", minutes: 16, goals: ["用枚举表示有限状态", "在联合类型上收窄", "把状态机写成一张表"], sources: ["ts-handbook", "mdn-js"] }, `
Sucrase 会把枚举编成一个对象。数字枚举可以拿来做状态编号。状态机用当前状态加事件决定下一状态，不需要类也能写清楚。

下面的机器从 \`idle\` 遇到 \`start\` 进入 \`run\`，再遇到 \`stop\` 回到 \`idle\`。

${run("ts", "enum Phase {\n  Idle = 0,\n  Run = 1,\n}\nconsole.log(Phase.Idle + Phase.Run);", "1", { title: "枚举" })}

${run("ts", "type State = \"idle\" | \"run\";\ntype Event = \"start\" | \"stop\";\nfunction step(state: State, event: Event): State {\n  if (state === \"idle\" && event === \"start\") return \"run\";\n  if (state === \"run\" && event === \"stop\") return \"idle\";\n  return state;\n}\nlet state: State = \"idle\";\nstate = step(state, \"start\");\nconsole.log(state);\nstate = step(state, \"stop\");\nconsole.log(state);", "run", { title: "状态机" })}

${run("ts", "interface Move {\n  dx: number;\n  dy: number;\n}\nfunction length(m: Move): number {\n  return Math.abs(m.dx) + Math.abs(m.dy);\n}\nconsole.log(length({ dx: 1, dy: -2 }));", "3", { title: "对象参数" })}

${note("枚举编译后的赋值细节不用背。要确认的是：数字成员能相加，字符串成员能当键。复杂的 const enum 不必在这里用。")}

## 练习

从 run 状态接收 stop，打印 idle。

${answerRun("参考答案", "ts", "type State = \"idle\" | \"run\";\nfunction stop(state: State): State {\n  return state === \"run\" ? \"idle\" : state;\n}\nconsole.log(stop(\"run\"));", "idle")}

${tail(["数字枚举的反向映射让对象上同时有名字和数字。打印整个枚举对象时会看到两套键。", "把状态写成任意字符串。联合类型在转译后不会帮你挡掉拼写错误。"])}`),
];
