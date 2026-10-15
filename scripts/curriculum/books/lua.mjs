import { book } from "./rich.mjs";

const links = `- [Programming in Lua](https://www.lua.org/pil/)（仅链接）
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)（MIT，仅链接）
- [Learn X in Y minutes — Lua](https://learnxinyminutes.com/lua/)（CC BY-SA 3.0，仅链接）`;
const credit = "正文为原创。知识点范围参考了 Programming in Lua、Lua 5.4 参考手册与 Learn X in Y minutes — Lua，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：Lua 在这个抽屉里",
    goals: ["用 print 看见结果", "知道 0 为真", "不调用 os.execute 或另一份文件"],
    prose: `Lua 在这里由随仓库提供的 Lua 5.4 解释器执行。点代码块上的 Run，示例在新进程里跑完。上一次的全局变量不会留下。

没有办法启动外部程序。不要调用 os.execute、io.popen 或 os.tmpname，也不要 require 另一份磁盘上的文件。模块写成同一个文件里的表。

print 会换行。多个参数之间是制表符，不是空格。期望是输出里的子串。第一次打开 Lua 要等运行时准备好，再判断脚本是不是写错了。`,
    samples: [
      s("只读", "-- 不要调用 os.execute、io.popen、os.tmpname。\n-- 也不要 require 另一份文件。", "", { norun: true }),
      s("相加", "print(19 + 23)", "42"),
      s("问候", "print(\"你好\")", "你好"),
    ],
    mistakes: [
      "调用 os.execute 或 require 别的文件。",
      "以为 print 的多个参数用空格隔开。",
      "把上一次运行的全局变量当成还在。",
    ],
    practices: [
      "每个示例都是一份能单独运行的脚本。",
      "要核对的值用 print 打成一行。",
      "做不到的事用只读块标出来。",
    ],
    summary: "Lua 101 的例子在一次新的 Lua 5.4 进程里运行。结果靠 print。不启动外部程序，也不加载别的文件。",
    exercises: [
      { title: "参考答案：语言名", prompt: "打印一行 Lua。", code: "print(\"Lua\")", expect: "Lua" },
      { title: "参考答案：乘积", prompt: "打印 6 和 7 的乘积。", code: "print(6 * 7)", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "print",
    title: "print",
    level: "beginner",
    goals: ["用 print 打出文本和数字", "写出注释", "知道多个参数之间是制表符"],
    prose: `print 把参数转成文本，参数之间放制表符，最后换行。只要一个参数时，没有制表符。教学里多数时候只打印一个值，期望才稳。

注释从 -- 开始直到行尾。长注释用 --[[ ]]。注释不会出现在输出里。

局部变量用 local。不写 local 的赋值会变成全局变量，容易在长脚本里互相踩到。示例一律用 local。改完用工具栏的 Run 看结果，代码块上的 Run 会把修改盖掉。预测时不要把制表符当成空格。要紧挨的两个字，先拼成一个字符串再打印。不要靠打印两个参数来拼词。`,
    samples: [
      s("两行", "print(\"Ada\")\nprint(\"Lovelace\")", "Ada"),
      s("一个值", "print(\"A\" .. \"B\")", "AB"),
      s("注释", "print(\"可见\")\n-- 这一行不会出现\nprint(2026)", "可见"),
    ],
    mistakes: [
      "print(\"A\", \"B\") 以为得到 AB，实际中间有制表符。",
      "不写 local，名字泄漏成全局。",
      "注释写了和代码相反的话。",
    ],
    practices: [
      "一次 print 一个需要核对的值。",
      "要连在一起的文本用 .. 。",
      "变量写成 local。",
    ],
    summary: "print 会换行。多个参数用制表符分开。要紧挨的文本先用 .. 拼成一个值。",
    exercises: [
      { title: "参考答案：两行数字", prompt: "打印 1 和 2，各占一行。", code: "print(1)\nprint(2)", expect: "1" },
      { title: "参考答案：连写", prompt: "打印 AB，中间没有制表符。", code: "print(\"A\" .. \"B\")", expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "types",
    title: "类型与 nil",
    level: "beginner",
    goals: ["区分 / 和 //", "知道只有 nil 和 false 为假", "用 type 看类型名"],
    prose: `Lua 5.4 里，/ 是浮点除法，20 / 6 得到大约 3.333。整数除法用 //，20 // 6 得到 3。余数用 %。

条件里只有 false 和 nil 为假。0 和空字符串都是真。这和 C、PHP 相反，和 Ruby 相同。不要用 if n 判断数字是不是 0。

nil 表示没有值。没有赋值的局部变量是 nil。type 返回类型名的字符串，例如 number、string、nil。比较 nil 用 == nil。`,
    samples: [
      s("整除", "print(20 // 6)\nprint(20 % 6)", "3"),
      s("零是真", "local n = 0\nif n then print(\"yes\") else print(\"no\") end", "yes"),
      s("类型", "print(type(42))", "number"),
    ],
    mistakes: [
      "以为 / 得到整数。",
      "把 0 当成假。",
      "用 if s 判断空字符串。空字符串是真。",
    ],
    practices: [
      "要整数商时用 //。",
      "判断 0 用 == 0。",
      "看不清时 print(type(...))。",
    ],
    summary: "/ 是浮点除法，// 才是整数除法。只有 nil 和 false 为假，0 是真。",
    exercises: [
      { title: "参考答案：商", prompt: "打印 17 除以 5 的整数商。", code: "print(17 // 5)", expect: "3" },
      { title: "参考答案：空串", prompt: "判断空字符串为真时打印 yes。", code: "local s = \"\"\nif s then print(\"yes\") else print(\"no\") end", expect: "yes" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "strings",
    title: "字符串",
    level: "beginner",
    goals: ["用 .. 拼接", "用 1 起的下标切片", "记住 # 对中文数的是字节"],
    prose: `字符串用 .. 拼接。数字和字符串用 .. 时，数字会转成文本。用 + 会按数字相加，文本必须能转成数。

下标从 1 开始。string.sub(s, 起, 止) 的止是包含的结束位置，不是长度。string.sub(\"SimpleCode\", 1, 4) 得到 Simp。#s 是字节数。"Ada" 是 3。"你好" 是 6。正文里要写明这一点，示例用 print 核对。

字符串不能原地改某一个字节后还以为别的变量没变。连接会得到新字符串。`,
    samples: [
      s("拼接", "local name = \"Ada\"\nprint(\"你好，\" .. name)", "你好，Ada"),
      s("前四个", "print(string.sub(\"SimpleCode\", 1, 4))", "Simp"),
      s("字节", "print(#\"Ada\")\nprint(#\"你好\")", "3"),
    ],
    mistakes: [
      "下标从 0 开始取，拿到的是 nil 或错字。",
      "把 #\"你好\" 当成 2。",
      "用 + 拼接两段文本。",
    ],
    practices: [
      "切片用 string.sub，并记住结束位置包含在内。",
      "拼接用 .. 。",
      "中文长度写明是字节。",
    ],
    summary: "拼接用 .. 。下标从 1 开始，sub 的结束位置包含在内。# 按字节计数。",
    exercises: [
      { title: "参考答案：替换", prompt: "把横线换成斜线。可以用 gsub，只打印第一个返回值。", code: "local s = string.gsub(\"2026-10-15\", \"-\", \"/\")\nprint(s)", expect: "2026/10/15" },
      { title: "参考答案：长度", prompt: "打印 Simple 的字节数。", code: "print(#\"Simple\")", expect: "6" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "control",
    title: "控制流",
    level: "beginner",
    goals: ["用 if 和 else 分支", "用数字 for 做有限次数", "写出能停下来的 while"],
    prose: `if ... then ... elseif ... else ... end。条件只有 nil 和 false 为假。0 会走进 then。

数字 for 写成 for n = 1, 5 do。结束值包含在内。for 的循环变量是局部的。while 在条件为真时重复，每一轮都要让条件靠近结束。

循环里用 local total = 0 再累加。在循环里 print 每一次，期望就要包含每一行。能在外面打印总和就在外面打印。`,
    samples: [
      s("奇数和", "local total = 0\nfor n = 1, 5 do\n  if n % 2 == 1 then total = total + n end\nend\nprint(total)", "9"),
      s("数到三", "local n = 0\nwhile n < 3 do\n  n = n + 1\nend\nprint(n)", "3"),
      s("零仍为真", "local n = 0\nif n then print(\"yes\") else print(\"no\") end", "yes"),
    ],
    mistakes: [
      "把数字 for 的结束值理解成不包含。",
      "while 里不改变条件。",
      "用 if n 判断 n 是不是 0。",
    ],
    practices: [
      "次数清楚时用数字 for。",
      "判断零用 == 0。",
      "循环外打印总和。",
    ],
    summary: "if 只把 nil 和 false 当假。数字 for 包含结束值。while 必须有变量靠近结束。",
    exercises: [
      { title: "参考答案：一到四", prompt: "把 1 到 4 加起来并打印。包含 4。", code: "local total = 0\nfor n = 1, 4 do total = total + n end\nprint(total)", expect: "10" },
      { title: "参考答案：三次", prompt: "从 0 加三次并打印。", code: "local n = 0\nfor _ = 1, 3 do n = n + 1 end\nprint(n)", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "functions",
    title: "函数与闭包",
    level: "intermediate",
    goals: ["定义函数并返回值", "让闭包看见外层的 local", "知道 print 不会自动打印返回值"],
    prose: `函数是值。写成 local function add(a, b) 或 local add = function(a, b)。return 交回结果，不会自动打印。调用后 print。

闭包可以看见外层的 local，并且能改它。多次调用同一个闭包，会看见上一次留下的那个变量。这是计数器的常见写法。不要把这种状态放进全局。

参数按位置传入。少传了就是 nil。需要默认值时，在函数里写 n = n or 0。注意 or 会把 false 也换成默认值，所以只对「nil 表示没传」的数字使用。`,
    samples: [
      s("相加", "local function add(a, b)\n  return a + b\nend\nprint(add(41, 1))", "42"),
      s("闭包", "local function counter()\n  local n = 0\n  return function()\n    n = n + 1\n    return n\n  end\nend\nlocal nextn = counter()\nnextn()\nprint(nextn())", "2"),
      s("默认", "local function add(a, b)\n  b = b or 1\n  return a + b\nend\nprint(add(41))", "42"),
    ],
    mistakes: [
      "以为函数最后一行会自己打印。",
      "计数器不用 local，写成全局，下一次逻辑互相看见。",
      "用 or 给可能是 false 的参数做默认。",
    ],
    practices: [
      "函数写成 local。",
      "要核对的结果 print 出来。",
      "闭包里要记住的状态用外层 local。",
    ],
    summary: "函数用 return 交回结果。闭包能记住外层的 local。print 才把结果送到终端。",
    exercises: [
      { title: "参考答案：平方", prompt: "写函数返回平方，打印 6 的平方。", code: "local function sq(n) return n * n end\nprint(sq(6))", expect: "36" },
      { title: "参考答案：两倍", prompt: "写函数返回两倍，打印 21 的结果。", code: "local function twice(n) return n * 2 end\nprint(twice(21))", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "tables",
    title: "表",
    level: "intermediate",
    goals: ["用 1 起的数组部分", "用字符串键保存映射", "用 # 时避开空洞"],
    prose: `表是 Lua 的数组和映射。数组部分从 1 开始，t[1] 是第一个。#t 是数组部分的长度，中间如果有 nil，长度会在空洞处停住。教学例子不往数组里塞 nil。

映射用字符串键，t[\"Ada\"] 或 t.Ada。缺失的键是 nil。给默认值写成 t[name] or 0，再做加法。

ipairs 按 1、2、3 遍历直到 nil。pairs 遍历全部键，顺序不要写进期望。要稳定输出时，只 print 某一个键或一个算好的总数。`,
    samples: [
      s("求和", "local t = {1, 2, 3, 4}\nlocal total = 0\nfor i = 1, #t do total = total + t[i] end\nprint(total)", "10"),
      s("映射", "local scores = {}\nscores.Ada = (scores.Ada or 0) + 1\nscores.Ada = scores.Ada + 2\nprint(scores.Ada)", "3"),
      s("长度", "local t = {\"a\", \"b\", \"c\"}\nprint(#t)", "3"),
    ],
    mistakes: [
      "数组从 0 开始放，# 和 ipairs 对不上。",
      "在数组中间放 nil，# 提前结束。",
      "依赖 pairs 的遍历顺序。",
    ],
    practices: [
      "列表从 1 连续存放。",
      "缺失的映射用 or 0。",
      "只打印算好的一个数。",
    ],
    summary: "表的数组部分从 1 开始。# 在 nil 空洞处停住。字符串键用来做映射，缺失是 nil。",
    exercises: [
      { title: "参考答案：最小", prompt: "从表 {3, 1, 2} 找出最小并打印。", code: "local t = {3, 1, 2}\nlocal m = t[1]\nfor i = 2, #t do if t[i] < m then m = t[i] end end\nprint(m)", expect: "1" },
      { title: "参考答案：默认", prompt: "缺失键按 0 打印。", code: "local t = {}\nprint(t.a or 0)", expect: "0" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "meta",
    title: "元表",
    level: "advanced",
    goals: ["用 __index 提供默认字段", "知道元表不是继承的复制", "不在可运行示例里做复杂运算元方法"],
    prose: `元表给表附加行为。setmetatable(表, 元表) 把它们连起来。__index 是另一张表时，原来的表没有的键会到这张表里找。已经有的键不会被遮住。

这不是把字段复制过来。改原型上的值，通过 __index 能看见新值；对象自己写入同名字段后，就不再去原型里找。

本教程只用 __index 做默认字段。不写 __add 之类的运算，避免示例变成一堆隐式规则。`,
    samples: [
      s("默认字段", "local proto = { n = 2 }\nlocal obj = setmetatable({}, { __index = proto })\nprint(obj.n)", "2"),
      s("自己的字段优先", "local proto = { n = 1 }\nlocal obj = setmetatable({ n = 2 }, { __index = proto })\nprint(obj.n)", "2"),
      s("写入后", "local proto = { n = 1 }\nlocal obj = setmetatable({}, { __index = proto })\nobj.n = 41\nprint(obj.n + 1)", "42"),
    ],
    mistakes: [
      "以为 setmetatable 会把字段复制一份。",
      "对象已经有的键还指望原型覆盖它。",
      "在元方法里再改元表，读起来无法预测。",
    ],
    practices: [
      "默认字段放在 __index 指向的表。",
      "对象自己的数据直接写在对象上。",
      "这一章只演示 __index。",
    ],
    summary: "__index 在键缺失时提供另一张表。对象自己的键优先。它不是复制。",
    exercises: [
      { title: "参考答案：默认", prompt: "通过 __index 读到 n 为 7 并打印。", code: "local proto = { n = 7 }\nlocal obj = setmetatable({}, { __index = proto })\nprint(obj.n)", expect: "7" },
      { title: "参考答案：覆盖", prompt: "对象自己的 n 是 4，打印它而不是原型的 1。", code: "local proto = { n = 1 }\nlocal obj = setmetatable({ n = 4 }, { __index = proto })\nprint(obj.n)", expect: "4" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "pcall",
    title: "pcall",
    level: "advanced",
    goals: ["用 pcall 接住 error", "按第一个返回值判断成败", "不把错误消息全文写进期望"],
    prose: `error 抛出错误，若不接住，整份脚本停在那里。pcall(函数) 的第一个返回值是 true 或 false。失败时第二个返回值是错误对象。打印时只打「失败」或成功的数字，不打错误消息，消息里可能有行号。

能用 if 判断的情况不必 error。除数是不是零可以先看。pcall 适合「调用了一段可能失败的代码，调用前看不出来」。

pcall 接住之后，脚本还可以继续 print。不要接住了却什么都不做，看起来像成功。`,
    samples: [
      s("接住", "local ok = pcall(function()\n  error(\"boom\")\nend)\nif ok then print(\"ok\") else print(\"失败\") end", "失败"),
      s("成功", "local ok, value = pcall(function()\n  return 19 + 23\nend)\nif ok then print(value) else print(\"失败\") end", "42"),
      s("除零先判断", "local function div(a, b)\n  if b == 0 then return nil end\n  return a // b\nend\nlocal q = div(20, 6)\nif q == nil then print(\"失败\") else print(q) end", "3"),
    ],
    mistakes: [
      "不看 pcall 的第一个返回值，把错误对象当结果打印。",
      "把错误消息全文写进期望。",
      "能 if 判断的情况故意 error。",
    ],
    practices: [
      "失败打印固定短词。",
      "成功时打印第二个返回值里的数字。",
      "除零用 if，而不是靠错误消息。",
    ],
    summary: "pcall 的第一个返回值表示是否成功。失败时打印固定的词，不依赖错误消息的全文。",
    exercises: [
      { title: "参考答案：失败", prompt: "pcall 一段会 error 的函数，失败时打印失败。", code: "local ok = pcall(function() error(\"x\") end)\nif not ok then print(\"失败\") end", expect: "失败" },
      { title: "参考答案：成功", prompt: "pcall 返回 7 并打印。", code: "local ok, value = pcall(function() return 7 end)\nif ok then print(value) end", expect: "7" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "module",
    title: "不跨文件的模块",
    level: "advanced",
    goals: ["用表装函数", "不 require 另一份文件", "把数据放在参数里而不是模块的全局状态"],
    prose: `这里不能 require 磁盘上的另一个文件。模块就是同一个文件里的一张表，函数挂在表上。调用时把表名写出来，读代码时能看见函数从哪来。

不要把用户的分数存在模块表自己身上又让所有调用共享，除非你故意要共享。分数放在调用者传入的另一张表里，模块只提供操作。这样测试可以准备一张空表。

文件末尾不需要 return 模块给别人 require。脚本直接调用并 print。`,
    samples: [
      s("加分", "local M = {}\nfunction M.add(box, name, n)\n  box[name] = (box[name] or 0) + n\nend\nlocal box = {}\nM.add(box, \"Ada\", 1)\nM.add(box, \"Ada\", 2)\nprint(box.Ada)", "3"),
      s("条数", "local M = {}\nfunction M.count(items)\n  local n = 0\n  for i = 1, #items do\n    if items[i] ~= \"\" then n = n + 1 end\n  end\n  return n\nend\nprint(M.count({\"买笔\", \"\"}))", "1"),
      s("读取", "local M = {}\nfunction M.get(box, name)\n  return box[name] or 0\nend\nlocal box = { Ada = 4 }\nprint(M.get(box, \"Ada\"))", "4"),
      s("只读", "-- require(\"other\") 会去找另一份文件，这里没有。\n-- 把函数放进本文件的表。", "", { norun: true }),
    ],
    mistakes: [
      "require 一个不存在的文件。",
      "把每份数据都写进模块表，调用之间互相留下。",
      "函数不用 local 的模块表，名字变成全局。",
    ],
    practices: [
      "模块是本文件里的 local 表。",
      "数据由参数传入。",
      "只 print 函数算出的结果。",
    ],
    summary: "模块是同一文件里的表。不 require 别的文件。数据放在参数里，函数放在表上。",
    exercises: [
      { title: "参考答案：两倍", prompt: "表上的函数返回两倍，打印 21 的结果。", code: "local M = {}\nfunction M.twice(n) return n * 2 end\nprint(M.twice(21))", expect: "42" },
      { title: "参考答案：空表", prompt: "对空表取值，没有就打印 0。", code: "local M = {}\nfunction M.get(box, name) return box[name] or 0 end\nprint(M.get({}, \"Ada\"))", expect: "0" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "libs",
    title: "string、math 与 table",
    level: "advanced",
    goals: ["用 string.sub 和 string.format", "用 math.min 和 math.floor", "用 table.sort 时接受原表被改"],
    prose: `string、math、table 是语言自带的表，不是要安装的库。string.format 用 %d 和 %s，得到一个字符串，再 print。string.sub 做切片。

math.min 和 math.max 接收多个数字。math.floor 朝更小的整数走。整数除法仍优先用 //，少绕一层。

table.sort 会改原来的表。排序后 t[1] 是最小的，如果比较函数是默认的。需要旧顺序时，先造一张新表再排序。table.concat 把字符串数组收成一行，分隔符由你指定。`,
    samples: [
      s("最小", "print(math.min(3, 1, 2))", "1"),
      s("格式", "print(string.format(\"%s %d\", \"Ada\", 42))", "Ada 42"),
      s("排序", "local t = {3, 1, 2}\ntable.sort(t)\nprint(t[1])", "1"),
    ],
    mistakes: [
      "sort 之后还以为原来的第一个元素留在原位。",
      "string.format 的 %d 配了字符串。",
      "用 math.floor(20/6) 代替 //，却忘了负数的方向。正数示例可以用，正文仍推荐 //。",
    ],
    practices: [
      "切片用 string.sub，格式化用 string.format。",
      "要最小的数用 math.min。",
      "sort 之前确认可以改这张表。",
    ],
    summary: "string、math 和 table 随解释器提供。sort 会改原表。格式化的结果再 print。",
    exercises: [
      { title: "参考答案：最大", prompt: "打印 1、4、2 里的最大数。", code: "print(math.max(1, 4, 2))", expect: "4" },
      { title: "参考答案：连接", prompt: "用逗号连接 a 和 b。", code: "print(table.concat({\"a\", \"b\"}, \",\"))", expect: "a,b" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "todo",
    title: "待办小项目",
    level: "advanced",
    goals: ["用表保存待办文本", "跳过空字符串", "从一行输入加入一条"],
    prose: `待办是一次运行里的表。没有网络，也不写文件。下次运行列表是空的。数组部分从 1 连续存放，空字符串不要放进去，否则它会占一个位置。

计数写成函数，参数是表。读入用 io.read(\"*l\")，读到 nil 就是没有输入。空行不加。输出只打条数，或打出指定位置的那一条。位置先和 #items 比较。

示例可以不读键盘，直接构造表，让规则先被 print 核对。需要演示读入时单独写一条 stdin。`,
    samples: [
      s("非空条数", "local function count(items)\n  local n = 0\n  for i = 1, #items do\n    if items[i] ~= \"\" then n = n + 1 end\n  end\n  return n\nend\nprint(count({\"买笔\", \"\"}))", "1"),
      s("第一条", "local items = {\"买笔\", \"写信\"}\nprint(items[1])", "买笔"),
      s("读一条", "local items = {}\nlocal line = io.read(\"*l\")\nif line == nil or line == \"\" then\n  print(\"失败\")\nelse\n  items[#items + 1] = line\n  print(#items)\nend", "1", { stdin: "买笔\n" }),
    ],
    mistakes: [
      "从 0 插入，# 和读取对不上。",
      "把空字符串放进数组还指望 # 表示有效条数。",
      "以为列表会留到下一次运行。",
    ],
    practices: [
      "只把非空行插入表。",
      "条数用函数算，或在插入时就排除空行后用 #。",
      "只打印条数或某一条。",
    ],
    summary: "待办是一次运行内从 1 开始的表。空行不加。io.read(\"*l\") 读一条。下次运行不会还在。",
    exercises: [
      { title: "参考答案：两条", prompt: "两件待办，打印条数。", code: "local items = {\"a\", \"b\"}\nprint(#items)", expect: "2" },
      { title: "参考答案：第二", prompt: "打印第二条。", code: "local items = {\"买笔\", \"写信\"}\nprint(items[2])", expect: "写信" },
    ],
    ...tail,
  },
];

export const pages = book("lua", ["pil", "lua-manual", "lxiy-lua"], chapters);
