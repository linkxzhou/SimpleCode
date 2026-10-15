import { pack as basePack } from "./depth-lib.mjs";
import { extras } from "./depth-js-extra.mjs";

function pack(spec) {
  return basePack({ ...spec, extra: extras[spec.id] });
}

const js = (title, code, expect) => ({ lang: "js", title, code, expect });
const ts = (title, code, expect) => ({ lang: "ts", title, code, expect });

const packs = {
  0: pack({
    id: "js-0",
    prose: `这里的 JavaScript 由 QuickJS 执行，没有页面。document、window、fetch、localStorage 都不要写。console.log 把参数用空格拼成一行，这是教程里查看结果的主要办法。程序必须是单个文件，import 和 export 没有加载器可去。

TypeScript 代码块会先去掉类型再执行。编辑器里留下的是 JavaScript，第一行注释说明原文在文档中。工具栏的 JS / TS 开关管的是你自己的草稿，和文档块不是同一条路，但用的是同一个转译函数，避免两套行为。

计时器不可靠。不要写 setTimeout 来证明「稍后发生」。需要顺序时，用已经完成的 Promise，微任务会在这次运行里跑完。死循环会占住引擎，和 Python 一样要点停止。

阅读时先确认示例没有碰浏览器 API，再看输出。期望是子串。多打印一行调试信息通常仍能通过，但你要知道那一行是谁打的。`,
    samples: [
      js("相加", "console.log(19 + 23)", "42"),
      js("拼接", 'console.log(["Java", "Script"].join(""))', "JavaScript"),
    ],
    practices: [
      "不写 document、fetch、import。这个引擎没有页面，也没有模块加载。",
      "需要先后顺序时用已完成的 Promise，不用 setTimeout。",
      "从文档运行 TypeScript 后，编辑器里应看到转译注释和 JavaScript。",
    ],
    summary: "QuickJS 只跑单文件脚本。浏览器 API 和计时器不在范围内，TypeScript 只去掉类型再执行。",
    exercise: {
      prompt: "打印 6 和 7 的乘积。",
      title: "参考答案：乘积",
      lang: "js",
      code: "console.log(6 * 7)",
      expect: "42",
    },
  }),
  1: pack({
    id: "js-1",
    prose: `let 可以重新赋值，const 不能改绑定。const 的对象仍然可以改字段，因为绑定没变，变的是对象里面。var 会提升并且函数作用域很大，新代码不用它。

typeof 对数字、字符串、函数给出预期的名字，对 null 却给出 "object"。这是旧bug，判断空值请和 null 比较，不要看 typeof。undefined 表示还没有赋值，和 null 的「有意为空」不是一回事。

交换两个绑定需要第三个名字，或者用解构 [a, b] = [b, a]。解构读起来短，初学时两种都要认识。数字和字符串用 === 比较，不要用 ==，除非你正在演示类型转换。

模板字符串可以插值。示例为了少写转义，常用加号。效果一样：左边和右边都变成字符串再接上。`,
    samples: [
      js("const 字段", 'const box = { n: 1 };\nbox.n = 2;\nconsole.log(box.n);', "2"),
      js("undefined", "let x;\nconsole.log(typeof x);", "undefined"),
    ],
    practices: [
      "新代码只用 let 和 const，不引入 var。",
      "判断 null 用 === null，不用 typeof。",
      "const 对象要改字段可以，要换整个对象就改用 let。",
    ],
    summary: "let 和 const 控制绑定能不能换，typeof null 是历史例外。比较值用 ===。",
    exercise: {
      prompt: "用解构交换 4 和 5，打印交换后的第一个数。",
      title: "参考答案：解构交换",
      lang: "js",
      code: "let a = 4;\nlet b = 5;\n[a, b] = [b, a];\nconsole.log(a);",
      expect: "5",
    },
  }),
  2: pack({
    id: "js-2",
    prose: `== 会先转换类型再比较，=== 不会。0 == "0" 为真，0 === "0" 为假。教学和业务代码都用 ===，只在你故意讨论转换时才写 ==。

+ 两边只要有字符串，就变成拼接。"6" + 7 是 "67"，不是 13。减号、乘号会把字符串转成数字，"6" * 7 是 42。这种不一致是坑，算术前用 Number() 写清楚。

字符串的 slice 和 Python 类似，结束下标不包含。split 按分隔符切开，join 再拼回去。reverse 会改原数组，要保留顺序就先 slice() 复制。

模板字符串里的表达式写在美元符号和花括号里。文档源码为了少一层反引号，示例更多使用加号。你在编辑器里可以改成模板字符串，输出应该相同。`,
    samples: [
      js("乘法转换", 'console.log("6" * 7);', "42"),
      js("slice", 'console.log("SimpleCode".slice(0, 6));', "Simple"),
    ],
    practices: [
      "相等比较写 ===。需要数字时先 Number，再运算。",
      "reverse 之前如果还要原数组，就先复制。",
      "拼接用加号或模板字符串都可以，同一段代码里不要混用到难以阅读。",
    ],
    summary: "+ 遇到字符串会拼接，其他算术运算符会把字符串转成数字。比较用 ===，切片不包含右端。",
    exercise: {
      prompt: "把字符串 20 和 22 转成数字后相加并打印。",
      title: "参考答案：转数字再加",
      lang: "js",
      code: 'console.log(Number("20") + Number("22"));',
      expect: "42",
    },
  }),
  3: pack({
    id: "js-3",
    prose: `if 的条件只要真值就会进入。0、空字符串、null、undefined、NaN 都是假。其余多数值是真，包括空对象和空数组。不要用 if (arr) 判断数组有没有元素，空数组也是真，要看 arr.length。

for 的三件套是初始、条件、更新。for...of 遍历值，适合数组和字符串。for...in 遍历键，数组上会得到下标字符串，还可能遇到别人加在原型上的键。遍历数组用 of。

switch 用 === 匹配，没有匹配又没有 default 就什么都不做。case 后面不写 break 会继续执行下一支，这叫贯穿。想贯穿时写注释，否则一律 break。

循环里的 const 在每一轮都是新绑定，所以 for (const n of items) 是安全的。不要在循环外面使用那一个 n，它的作用域在循环里。`,
    samples: [
      js("空数组是真", 'const items = [];\nconsole.log(Boolean(items));\nconsole.log(items.length === 0);', "true"),
      js("求和", "let s = 0;\nfor (const n of [1, 2, 3, 4]) s += n;\nconsole.log(s);", "10"),
    ],
    practices: [
      "判断数组是否为空看 length，不看数组对象本身的真值。",
      "遍历数组的值用 for...of，不用 for...in。",
      "switch 的每个 case 都写 break，除非贯穿是有意的并写了注释。",
    ],
    summary: "分支看真值，循环用 for 或 for...of。switch 默认不会自己停下，要写 break。",
    exercise: {
      prompt: "用 for...of 找出 [4, 8, 1] 里的最大值并打印。",
      title: "参考答案：最大值",
      lang: "js",
      code: "let best = 0;\nfor (const n of [4, 8, 1]) if (n > best) best = n;\nconsole.log(best);",
      expect: "8",
    },
  }),
  4: pack({
    id: "js-4",
    prose: `函数声明会被提升，同一作用域里可以先调用后定义。箭头函数和函数表达式不会提升，必须先写出值。箭头函数没有自己的 arguments，也没有自己的 this。需要剩余参数时写 ...args。

默认参数在调用方没传该参数时才计算。传 undefined 也会触发默认值，传 null 则不会。这个差别要记住，否则你以为 null 会换成默认值，结果函数收到了 null。

闭包让内层函数看见外层的 let。计数器每次调用都改同一个 n。在循环里创建闭包时，用 let 而不是 var，每一轮才有自己的绑定。

递归要有停止条件。记忆化用 Map 把算过的参数存起来。Map 的键可以是数字，普通对象的键会被转成字符串。本章的斐波那契用 Map 或对象都可以，因为键是小整数。`,
    samples: [
      js("剩余参数", "function sum(...nums) {\n  return nums.reduce((s, n) => s + n, 0);\n}\nconsole.log(sum(1, 2, 3));", "6"),
      js("默认值不接受 null", "function orOne(n = 1) {\n  return n;\n}\nconsole.log(orOne(null));", "null"),
    ],
    practices: [
      "箭头函数不依赖 arguments 和 this。需要它们时用 function。",
      "默认参数不要假设 null 会触发，只有省略或 undefined 才会。",
      "循环里创建函数使用 let，避免所有函数看见最后一轮的值。",
    ],
    summary: "函数声明会提升，箭头函数不会。闭包记住外层变量，默认参数只在没传或传入 undefined 时启用。",
    exercise: {
      prompt: "写箭头函数，返回参数减 1，用 43 调用并打印。",
      title: "参考答案：减一",
      lang: "js",
      code: "const pred = (n) => n - 1;\nconsole.log(pred(43));",
      expect: "42",
    },
  }),
  5: pack({
    id: "js-5",
    prose: `map、filter、reduce 都返回新值，不改原数组。map 一对一变换，filter 按条件留下，reduce 收成一个值。reduce 如果数组可能为空，一定给初始值，否则会抛错。

sort 会改原数组，而且默认按字符串比较。数字要传 (a, b) => a - b。想保留原数组就先 slice 再 sort。返回的是同一个数组，所以可以接着 join。

展开运算符可以把数组拆进另一个数组。[...a, ...b] 是浅拷贝拼接。嵌套的数组仍是原来的引用。flat 只摊开一层，除非你给深度。本章用循环展开一层，避免依赖较新的默认行为讨论。

链式调用读起来像流水。每一段都短的时候很好，一段里塞进复杂 if 时就改回中间变量。中间变量也方便你 console.log 半成品。`,
    samples: [
      js("空数组 reduce", "console.log([].reduce((s, n) => s + n, 0));", "0"),
      js("不改原数组", "const nums = [3, 1];\nconst copy = nums.slice().sort((a, b) => a - b);\nconsole.log(nums[0], copy[0]);", "3 1"),
    ],
    practices: [
      "reduce 总是传入初始值。",
      "数字排序提供比较函数，并且在需要时先复制再排序。",
      "链式调用里一旦不好读，就拆成中间变量。",
    ],
    summary: "map、filter、reduce 产生新结果，sort 修改原数组。数字排序必须给比较函数，reduce 要有初始值。",
    exercise: {
      prompt: "用 filter 留下大于 2 的数，打印个数。数组是 [1, 2, 3, 4]。",
      title: "参考答案：大于 2",
      lang: "js",
      code: "console.log([1, 2, 3, 4].filter((n) => n > 2).length);",
      expect: "2",
    },
  }),
  6: pack({
    id: "js-6",
    prose: `对象字面量的键是字符串或 Symbol。数字键会被转成字符串，所以 obj[1] 和 obj["1"] 是同一格。展开 { ...a, ...b } 是浅合并，b 的同名键覆盖 a。嵌套对象仍共享。

可选链 ?. 在左边是 null 或 undefined 时短路并得到 undefined。再配合 ?? 可以给默认值。?? 只在 null 或 undefined 时取右边，0 和空字符串会保留。不要用 || 给数字默认值，否则 0 会被换成默认值。

解构可以给默认值，并且可以改名。const { a: width = 1 } = obj 把 a 读进 width。模式对不上时，从 undefined 上解构会抛错，先确认对象存在。

JSON.stringify 丢掉函数、undefined 和 Symbol。日期会变成字符串。parse 得到的是普通对象，没有方法。环状引用会抛错。用户输入的 JSON 要放进 try。`,
    samples: [
      js("空值合并", "console.log(0 ?? 5);\nconsole.log(null ?? 5);", "0"),
      js("键是字符串", "const obj = {};\nobj[1] = 'one';\nconsole.log(obj['1']);", "one"),
    ],
    practices: [
      "数字默认值用 ??，不用 ||，避免把 0 吃掉。",
      "展开只做浅合并，嵌套对象要单独复制。",
      "JSON 只拿来存数据，不拿来存函数。",
    ],
    summary: "对象按字符串键存值，展开做浅合并。可选链和 ?? 处理缺失，不要用 || 给 0 做默认值。",
    exercise: {
      prompt: "合并 {a:1, b:1} 和 {b:2}，打印 b。",
      title: "参考答案：后者覆盖",
      lang: "js",
      code: "const cfg = { a: 1, b: 1, ...{ b: 2 } };\nconsole.log(cfg.b);",
      expect: "2",
    },
  }),
  7: pack({
    id: "js-7",
    prose: `class 是原型的语法。方法放在原型上，实例之间共享同一份函数。字段写在构造函数的 this 上，每个实例各有一份。不要把会变的数据放在原型上。

extends 把原型连起来。子类构造函数如果要写自己的 this，必须先 super。否则还没初始化就使用 this，会抛错。覆盖方法不会自动调用父类，需要时写 super.method()。

instanceof 沿原型链判断。跨窗口或不同副本的类可能失败，本环境只有一个全局，可以放心用。typeof 对实例给出 "object"，区分不了是哪一个类。

私有字段用 #name，类外面访问不到。本章示例用普通字段，方便打印。你如果加上 #，记得在类内部读取，不要在 console.log 里从外面点它。`,
    samples: [
      js("原型方法", "class Box {\n  value() { return 7; }\n}\nconsole.log(new Box().value());", "7"),
      js("先 super", "class A { constructor(n) { this.n = n; } }\nclass B extends A {\n  constructor() { super(42); }\n}\nconsole.log(new B().n);", "42"),
    ],
    practices: [
      "会变的数据放在 this 上，方法放在原型上。",
      "子类构造函数先 super，再使用 this。",
      "判断实例用 instanceof，不用 typeof。",
    ],
    summary: "class 把方法放在原型上，extends 连接原型链。子类要先 super，instanceof 用来识别实例。",
    exercise: {
      prompt: "写一个类 Counter，构造时把 n 设为 0，方法 inc 加一并返回。连续调用两次后打印。",
      title: "参考答案：计数两次",
      lang: "js",
      code: "class Counter {\n  constructor() { this.n = 0; }\n  inc() { this.n += 1; return this.n; }\n}\nconst c = new Counter();\nc.inc();\nconsole.log(c.inc());",
      expect: "2",
    },
  }),
  8: pack({
    id: "js-8",
    prose: `throw 可以抛任何值，习惯抛 Error。自定义错误继承 Error，这样 instanceof 才好用。抛字符串时，catch 里的 instanceof Error 为假，栈也不完整。

try 只包可能失败的那几行。catch 里要么处理，要么再抛出去。空的 catch 会把失败吞掉，后面的代码以为成功了。

JSON.parse 对坏文本抛 SyntaxError。这是可预期的输入错误，适合就地变成一句提示。程序自己的 bug，例如读了未定义的变量，不应该被同一个 catch (e) 悄悄吃掉。可以先判断 e instanceof SyntaxError。

finally 总会执行，适合清理。不要在 finally 里 return，它会盖住 try 里的返回值。本环境没有必须关闭的句柄，示例很少用 finally，知道它的顺序即可：try，然后 catch，然后 finally。`,
    samples: [
      js("再抛", "function boom() { throw new Error('x'); }\ntry {\n  boom();\n} catch (err) {\n  console.log(err instanceof Error);\n}", "true"),
      js("区分类型", "try {\n  JSON.parse('no');\n} catch (err) {\n  console.log(err instanceof SyntaxError ? 'syntax' : 'other');\n}", "syntax"),
    ],
    practices: [
      "抛 Error 或其子类，不抛裸字符串。",
      "catch 要处理或再抛，不要写空块。",
      "解析 JSON 时只把 SyntaxError 当成输入错误。",
    ],
    summary: "用类型区分错误，try 只包住可能失败的代码。空的 catch 和抛字符串都会让失败难以追查。",
    exercise: {
      prompt: "throw 一个 Error，catch 后打印消息 oops。",
      title: "参考答案：打印消息",
      lang: "js",
      code: "try {\n  throw new Error('oops');\n} catch (err) {\n  console.log(err.message);\n}",
      expect: "oops",
    },
  }),
  9: pack({
    id: "js-9",
    prose: `for...of 要求对象有 Symbol.iterator。数组、字符串、Map、生成器都有。普通对象默认没有，用 for...of 会抛错。想遍历对象的键，用 Object.keys。

生成器函数 function* 返回生成器。yield 暂停并交出一个值。生成器只能走一遍。无限生成器必须在循环里 break，不能展开成数组。

自定义迭代器要提供 next 方法，返回 { value, done }。done 为 true 时 for 停止。value 在结束时可以省略。把这个对象从 Symbol.iterator 返回，for...of 就会用它。

解构和展开也会消费迭代器。[...gen] 会把剩余值全部取出。对无限生成器这样做不会结束。先取有限个，再展开那一部分。`,
    samples: [
      js("Object.keys", 'console.log(Object.keys({ b: 1, a: 2 }).length);', "2"),
      js("有限展开", "function* two() { yield 1; yield 2; }\nconsole.log([...two()].join(','));", "1,2"),
    ],
    practices: [
      "普通对象不要 for...of，用 Object.keys 或 Object.entries。",
      "无限生成器必须限制次数，禁止直接展开。",
      "生成器走完就空了，需要再来一遍就重新调用函数。",
    ],
    summary: "for...of 依赖迭代器。生成器按需产出值，只能走一遍，无限序列必须在取用时停下来。",
    exercise: {
      prompt: "生成器产出 3 和 4，打印它们的积。",
      title: "参考答案：两数相乘",
      lang: "js",
      code: "function* pair() { yield 3; yield 4; }\nconst [a, b] = pair();\nconsole.log(a * b);",
      expect: "12",
    },
  }),
  10: pack({
    id: "js-10",
    prose: `Promise 代表一份将来的结果。本环境不把进程留住等计时器，所以示例只用 Promise.resolve 和 Promise.reject。它们的 then 和 await 会在当前这次运行的微任务里完成，console.log 能看见结果。

async 函数总是返回 Promise。里面 return 的值会被包起来，抛出的异常会变成拒绝。await 取出成功的值，拒绝则抛到 await 所在的 try。忘记 await，你拿到的是 Promise 对象，打印出来不是数字。

Promise.all 等全部成功。其中一个拒绝，整个 all 拒绝。all 适合一批互不依赖的已完成任务。有先后依赖时写成前后两个 await，不要用 all 硬凑。

不要写 setTimeout(..., 0) 来「等到最后」。这里它可能根本不会跑。顺序如果重要，就写在同一个 async 函数里，从上往下 await。`,
    samples: [
      js("忘记 await 的对比", "async function main() {\n  const p = Promise.resolve(42);\n  console.log(await p);\n}\nmain();", "42"),
      js("all 拒绝", "async function main() {\n  try {\n    await Promise.all([Promise.resolve(1), Promise.reject(new Error('x'))]);\n  } catch (err) {\n    console.log('rejected');\n  }\n}\nmain();", "rejected"),
    ],
    practices: [
      "不用 setTimeout。顺序写在 async 函数里。",
      "await 每一个你关心结果的 Promise，不要打印 Promise 对象本身。",
      "互不依赖才用 Promise.all，有先后就分开 await。",
    ],
    summary: "这里只用已经完成的 Promise。async 和 await 把它们写成顺序语句，计时器不在本环境的保证之内。",
    exercise: {
      prompt: "await Promise.resolve(21)，乘 2 后打印。",
      title: "参考答案：乘二",
      lang: "js",
      code: "async function main() {\n  const n = await Promise.resolve(21);\n  console.log(n * 2);\n}\nmain();",
      expect: "42",
    },
  }),
  11: pack({
    id: "js-11",
    prose: `类型标注在转译后会被删掉。Sucrase 不做检查：你把 number 标在字符串上，程序仍会跑。类型是写给读者和将来的编译器看的，在这个抽屉里它改变不了运行结果。

interface 描述对象有哪些字段。多一个字段在转译后不会被删掉，因为那是值；少一个字段也不会报错。运行时该缺还是缺，读字段得到 undefined。

联合类型在运行时就是普通的值。收窄要自己写 typeof 或比较。写了收窄，转译后 if 还在，所以分支仍然有效。泛型同样会被抹掉，identity 就是把参数原样返回。

不要在 ts 块里 import。转译不会帮你加载模块。一个文件里写完类型和值。编辑器里第一行注释提醒你：看见的 JavaScript 不是文档原文。`,
    samples: [
      ts("字段还在", "interface Item { name: string }\nconst item: Item = { name: 'pen' };\nconsole.log(item.name);", "pen"),
      ts("收窄保留", "function show(x: string | number): string {\n  return typeof x === 'number' ? 'n' : 's';\n}\nconsole.log(show('a'));", "s"),
    ],
    practices: [
      "把类型当文档。需要真的拒绝错误类型时，用本地的 tsc，不要指望这里。",
      "收窄逻辑写成真正的 if，转译后它仍然保护运行结果。",
      "ts 块保持单文件，不写 import。",
    ],
    summary: "TypeScript 在这里只被去掉类型。标注帮助阅读，收窄用的 if 会留下来，错误标注不会被拦住。",
    exercise: {
      prompt: "写一个带返回类型 number 的函数，返回 20+22 并打印。",
      title: "参考答案：标注加法",
      lang: "ts",
      code: "function add(a: number, b: number): number {\n  return a + b;\n}\nconsole.log(add(20, 22));",
      expect: "42",
    },
  }),
  12: pack({
    id: "js-12",
    prose: `枚举在转译后变成对象。数字枚举可以相加，也可以当状态编号。打印整个枚举对象会同时看见名字和反向映射，测试时打印具体成员，不要打印整个对象。

字符串联合类型适合状态机。转译后它就是字符串，拼写错误不会被拦住，所以分支要有默认：不认识的事件保持原状态，而不是崩溃。把转移写成函数，输入状态和事件，返回新状态，比在界面代码里散落 if 更容易测。

接口描述参数形状。函数只读取自己声明的字段，调用方可以多给字段，转译后那些字段还在对象上，只是函数不看。这和「类型会删掉多余字段」不是一回事，删的是标注，不是值。

小项目到此为止：一个状态、一种事件、一个纯函数。不要加 DOM，也不要加计时器。打印每一次转移后的状态，期望输出就是那几个单词。`,
    samples: [
      ts("保持原状态", "type State = 'idle' | 'run';\nfunction step(state: State): State {\n  return state;\n}\nconsole.log(step('idle'));", "idle"),
      ts("绝对值曼哈顿", "function len(dx: number, dy: number): number {\n  return Math.abs(dx) + Math.abs(dy);\n}\nconsole.log(len(2, -5));", "7"),
    ],
    practices: [
      "打印枚举的成员，不打印整个枚举对象。",
      "状态转移写成纯函数，不认识的事件保持原状态。",
      "类型删不掉对象上的值，函数只读取自己用到的字段。",
    ],
    summary: "枚举变成对象，联合类型变成字符串。状态机用纯函数表达，转译后逻辑仍在，类型检查不在。",
    exercise: {
      prompt: "从 idle 遇到 start 进入 run，打印结果。用普通函数即可，参数写成联合类型。",
      title: "参考答案：进入 run",
      lang: "ts",
      code: "type State = 'idle' | 'run';\nfunction go(state: State): State {\n  return state === 'idle' ? 'run' : state;\n}\nconsole.log(go('idle'));",
      expect: "run",
    },
  }),
};

export function jsPack(chapter) {
  const found = packs[chapter];
  if (!found) throw new Error(`missing js depth for chapter ${chapter}`);
  return found;
}
