import { answerRun, fence, lesson, mistakes, note, run } from "../format.mjs";

const SRC = ["lxiy-python", "byte-of-python", "python-tutorial"];
const P = (meta, body) => lesson({ language: "python", sources: SRC }, meta, body);

const tail = (items) => `${mistakes(items)}

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。`;

export const pages = [
  P(
    {
      chapter: 0,
      slug: "index",
      file: "index.md",
      title: "概览：Python 是什么",
      minutes: 8,
      goals: ["知道本环境每次运行都是新进程", "分清可运行示例和只读示例", "用运行按钮把代码放进编辑器"],
      sources: ["python-tutorial", "lxiy-python", "norvig-ten"],
    },
    `
Python 在这里由 CPython 3.11 解释执行。点击代码块上的「运行」，示例会替换主编辑器里的内容，并立刻执行。编辑器原来的草稿会先备份，可以撤销。

每次运行都从空白内存开始：没有网络，写过的文件也不会留到下一次。适合学习语法，不适合安装第三方包。

${fence("text", "这段没有对应的运行时，所以没有运行按钮。", { run: false, title: "纯文本" })}

${fence("python", "# 只读示例：本环境没有网络，不要在可运行代码里访问外网。\n# import urllib.request", { norun: true, title: "不执行" })}

${run("python", 'print("你好")', "你好", { title: "第一声问候" })}

同一本书里也可以放别的语言。下面这段会切换到 Ruby，并在需要时下载 Ruby 运行时。

${run("ruby", 'puts "来自 Ruby 的 42"', "来自 Ruby 的 42", { title: "跨语言示例" })}

## 练习

把问候改成你所在的城市，再运行一次。

${answerRun("参考答案：城市问候", "python", 'print("你好，杭州")', "你好，杭州")}

${tail(["把 Python 2 的 print 语句写进来。3.11 里 print 是函数，必须加括号。", "以为上一次运行的变量还在。每次运行都是新进程。"])}
`,
  ),
  P(
    {
      chapter: 1,
      slug: "hello",
      title: "你好，Python",
      level: "beginner",
      goals: ["用 print 输出文本", "写出注释", "用缩进表示代码块"],
    },
    `
\`print\` 把对象变成文本写到标准输出，默认在末尾加换行。\`#\` 后面直到行尾是注释，解释器会跳过。

缩进在 Python 里是语法，不是装饰。同一块里的行必须使用相同的空格数。本教程统一用 4 个空格。

${run("python", 'print("Ada Lovelace")\nprint("数学家")\n# 这一行不会出现在输出里\nprint(2026)', "Ada Lovelace", { title: "名片" })}

${run(
  "python",
  'print("*")\nprint("**")\nprint("***")',
  "*\n**\n***",
  { title: "三行星号" },
)}

${note("输出里的引号属于源代码，不会打印出来。要打印引号，需要写在字符串里面。")}

${run("python", 'print("她说：你好")', "她说：你好", { title: "字符串内容" })}

## 练习

打印一个三行的直角三角形，每行分别是 1、2、3 个加号。

${answerRun("参考答案：加号三角形", "python", 'print("+")\nprint("++")\nprint("+++")', "+++")}

${tail(["混用 Tab 和空格。缩进不一致会直接报 IndentationError。", "忘记字符串两端的引号，解释器会把文字当成变量名。"])}
`,
  ),
  P(
    {
      chapter: 2,
      slug: "types",
      title: "变量与类型",
      level: "beginner",
      goals: ["区分 int、float、str、bool", "用 type 查看类型", "在数字和文本之间转换"],
    },
    `
名字指向对象。\`=\` 是绑定，不是数学里的相等。\`type\` 告诉你对象属于哪一类。

整数除法 \`/\` 得到浮点数；只要整数商用 \`//\`。\`int\`、\`float\`、\`str\` 负责转换，转换失败会抛出异常。

${run(
  "python",
  'celsius = 100\nfahrenheit = celsius * 9 / 5 + 32\nprint(int(fahrenheit))\nprint(type(celsius).__name__)',
  "212",
  { title: "温度换算" },
)}

${run(
  "python",
  'flag = True\nprint(type(flag).__name__)\nprint(int("36") + 1)\nprint(str(6) + "7")',
  "bool",
  { title: "类型转换" },
)}

${run("python", 'print(7 // 2)\nprint(7 % 2)', "3\n1", { title: "整除与余数" })}

## 练习

从标准输入读入身高（米）和体重（千克）两行，按 BMI = 体重 / 身高² 打印一位小数。

${answerRun(
  "参考答案：BMI",
  "python",
  'height = float(input())\nweight = float(input())\nbmi = weight / (height * height)\nprint(f"{bmi:.1f}")',
  "23.5",
  { stdin: "1.7\n68\n" },
)}

${tail(["用 == 给变量赋值。比较用 ==，绑定用 =。", "把还没转换的文本和数字相加。文本 6 和数字 7 不能直接相加，先 int 或先 str。"])}
`,
  ),
  P(
    {
      chapter: 3,
      slug: "strings",
      title: "字符串与输入输出",
      level: "beginner",
      goals: ["用 f-string 拼出句子", "用切片取出一段文本", "用 input 读取一行"],
    },
    `
字符串是不可变的字符序列。f-string 在花括号里写表达式，运行时再填上结果。\`input\` 读入一行并去掉末尾换行；提示文字会先写到输出。

${run(
  "python",
  'name = input("名字？")\nprint(f"你好，{name}！")',
  "你好，Ada！",
  { title: "问候", stdin: "Ada\n" },
)}

${run(
  "python",
  'word = "SimpleCode"\nprint(word[:6])\nprint(word[-4:])\nprint(len(word))',
  "Simple",
  { title: "切片" },
)}

${run(
  "python",
  'text = "abba"\nprint("是回文" if text == text[::-1] else "不是")',
  "是回文",
  { title: "回文" },
)}

${note("样例输入显示在代码块下方。取消「使用样例输入」后，程序会改从终端读取你键入的内容。")}

## 练习

读入一行文本，忽略大小写后判断是不是回文，打印「是」或「否」。

${answerRun(
  "参考答案：忽略大小写",
  "python",
  'text = input().strip().lower()\nprint("是" if text == text[::-1] else "否")',
  "是",
  { stdin: "Level\n" },
)}

${tail(["把 input 的结果直接当数字用。它永远是字符串，计算前要 float 或 int。", "切片的右端点是开区间：word[:6] 不含下标 6。"])}
`,
  ),
  P(
    {
      chapter: 4,
      slug: "control",
      title: "条件与循环",
      level: "beginner",
      goals: ["用 if / elif / else 分支", "用 for 和 while 重复", "让随机数在固定种子下可复现"],
    },
    `
条件后面的冒号和缩进组成一个块。\`for\` 常配合 \`range\`：\`range(3)\` 产生 0、1、2。\`break\` 立刻离开循环。

随机数只要种子相同，序列就相同。下面不打印具体骰子点数，只检查同一颗种子是否给出同一个数，这样换 Python 小版本也不会把测试绑死。

${run(
  "python",
  'score = 86\nif score >= 90:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)',
  "B",
  { title: "等级" },
)}

${run(
  "python",
  'import random\na = random.Random(1).randrange(1, 100)\nb = random.Random(1).randrange(1, 100)\nprint("稳定" if a == b else "不稳")\nprint("范围内" if 1 <= a < 100 else "越界")',
  "稳定",
  { title: "固定种子" },
)}

下面这个循环不会自己停。自动化测试会跳过它；你在页面上运行后，请点击停止。

${fence(
  "python",
  "# 故意不停。运行后请按停止，否则后面的示例需要先确认才能接手。\nwhile True:\n    pass",
  { smoke: "skip", title: "死循环" },
)}

${run(
  "python",
  'lines = []\nfor n in range(1, 8):\n    if n % 15 == 0:\n        lines.append("FizzBuzz")\n    elif n % 3 == 0:\n        lines.append("Fizz")\n    elif n % 5 == 0:\n        lines.append("Buzz")\n    else:\n        lines.append(str(n))\nprint(" ".join(lines))',
  "1 2 Fizz 4 Buzz Fizz 7",
  { title: "FizzBuzz" },
)}

## 练习

用 while 打印 3 到 1，最后一行是「出发」。

${answerRun(
  "参考答案：倒计时",
  "python",
  'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("出发")',
  "出发",
)}

${tail(["在 if 同一行后面再写本该缩进的语句。那一行会无条件执行。", "range(1, 8) 不含 8。右端点永远到不了。"])}
`,
  ),
  P(
    {
      chapter: 5,
      slug: "lists",
      title: "列表与元组",
      level: "beginner",
      goals: ["增删改查列表", "用切片复制一段", "用推导式变换每一项"],
    },
    `
列表可以改。元组一旦建好就不能替换其中的项，适合当一组固定记录。两者都支持下标和切片。

推导式 \`[表达式 for 变量 in 序列]\` 用来生成新列表，比先建空列表再 append 更直接。

${run(
  "python",
  'scores = [80, 95, 70, 88]\nprint(sum(scores) / len(scores))\nprint(max(scores))\nprint(scores[:2])',
  "83.25",
  { title: "成绩统计" },
)}

${run(
  "python",
  'nums = [3, 1, 3, 2, 1]\nseen = []\nfor n in nums:\n    if n not in seen:\n        seen.append(n)\nprint(seen)',
  "[3, 1, 2]",
  { title: "去重保序" },
)}

${run(
  "python",
  'pair = ("Ada", 36)\nname, age = pair\nprint(f"{name}:{age}")\nprint([n * n for n in range(1, 4)])',
  "Ada:36",
  { title: "元组与推导式" },
)}

## 练习

把 \`[1, 2, 3, 4]\` 里的偶数平方列出来。

${answerRun("参考答案：偶数平方", "python", 'print([n * n for n in [1, 2, 3, 4] if n % 2 == 0])', "[4, 16]")}

${tail(["用 scores.sort() 之后还指望它返回新列表。sort 原地修改并返回 None。", "把元组和列表的括号写反。小括号不是列表。"])}
`,
  ),
  P(
    {
      chapter: 6,
      slug: "dicts",
      title: "字典与集合",
      level: "beginner",
      goals: ["用字典按键查找", "做集合的交与并", "统计词频"],
    },
    `
字典把键映射到值，查找不需要从头扫描。集合只关心「在不在」，重复元素会自动丢掉。

遍历字典时默认走键。要同时拿到值，用 \`.items()\`。

${run(
  "python",
  'text = "to be or not to be"\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts["to"])\nprint(counts["be"])',
  "2",
  { title: "词频" },
)}

${run(
  "python",
  'a = {1, 2, 3}\nb = {3, 4}\nprint(sorted(a & b))\nprint(sorted(a | b))',
  "[3]",
  { title: "集合运算" },
)}

${run(
  "python",
  'from collections import Counter\nprint(Counter("aab").most_common(1))',
  "[('a', 2)]",
  { title: "Counter" },
)}

## 练习

判断两个词是不是字母异位词：排序后的字母相同。

${answerRun(
  "参考答案：异位词",
  "python",
  'left, right = "listen", "silent"\nprint("是" if sorted(left) == sorted(right) else "否")',
  "是",
)}

${tail(["用列表当字典的键。键必须可哈希，列表不行，元组可以。", "集合是无序的。要稳定输出，先 sorted。"])}
`,
  ),
  P(
    {
      chapter: 7,
      slug: "functions",
      title: "函数",
      level: "intermediate",
      goals: ["定义带默认值的参数", "用 *args 收集多余位置参数", "理解局部变量和返回值"],
    },
    `
函数把一段计算收成名字。参数默认值在定义时求值一次，所以默认值不要用可变对象。没有 \`return\` 时结果是 \`None\`。

\`*args\` 把多出来的位置参数收成元组。lambda 只能写一个表达式，适合很短的变换。

${run(
  "python",
  'def apply(op, a, b):\n    if op == "+":\n        return a + b\n    if op == "*":\n        return a * b\n    return None\n\nprint(apply("+", 20, 22))\nprint(apply("*", 6, 7))',
  "42",
  { title: "计算器" },
)}

${run(
  "python",
  'def total(*nums, scale=1):\n    return sum(nums) * scale\n\nprint(total(1, 2, 3))\nprint(total(1, 2, 3, scale=10))',
  "6\n60",
  { title: "可变参数" },
)}

${run(
  "python",
  'def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(5))\nprint((lambda n: n + 1)(41))',
  "120",
  { title: "递归与 lambda" },
)}

## 练习

写一个函数，返回斐波那契数列的第 n 项（0, 1, 1, 2, 3, 5…），并打印第 8 项。

${answerRun(
  "参考答案：斐波那契",
  "python",
  'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint(fib(8))',
  "21",
)}

${tail(["默认参数写成 def add(item, bag=[])。这个列表会在多次调用之间共享。", "递归没有终止条件，最后会 RecursionError。"])}
`,
  ),
  P(
    {
      chapter: 8,
      slug: "exceptions",
      title: "异常处理",
      level: "intermediate",
      goals: ["用 try / except 接住失败", "用 finally 做收尾", "抛出自己的异常类型"],
    },
    `
异常是一种控制流：出错的地方 \`raise\`，愿意处理的地方 \`except\`。只接住你准备处理的类型，不要写裸的 \`except:\`。

\`finally\` 无论是否出错都会执行。自定义异常继承 \`Exception\`，这样调用者可以按类型区分。

${run(
  "python",
  'def divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "undefined"\n\nprint(divide(10, 2))\nprint(divide(1, 0))',
  "5.0",
  { title: "安全除法" },
)}

${run(
  "python",
  'class EmptyInput(Exception):\n    pass\n\ndef parse(text):\n    if text.strip() == "":\n        raise EmptyInput("空白")\n    return int(text)\n\ntry:\n    parse("  ")\nexcept EmptyInput as err:\n    print(err)',
  "空白",
  { title: "自定义异常" },
)}

${run(
  "python",
  'import sys\nprint("bad")\nsys.exit(2)',
  "bad",
  { title: "非零退出", exit: 2 },
)}

## 练习

读入一行，能转成整数就打印它，否则打印「不是整数」。

${answerRun(
  "参考答案：解析整数",
  "python",
  'try:\n    print(int(input()))\nexcept ValueError:\n    print("不是整数")',
  "不是整数",
  { stdin: "3.14\n" },
)}

${tail(["用异常代替普通的 if。找不到键可以先用 in 判断，不必每次 KeyError。", "except Exception 把 KeyboardInterrupt 以外几乎所有错误都吞掉，真实的缺陷会被藏住。"])}
`,
  ),
  P(
    {
      chapter: 9,
      slug: "stdlib",
      title: "模块与标准库",
      level: "intermediate",
      goals: ["导入 math、datetime、itertools", "固定随机序列", "只用标准库完成小计算"],
    },
    `
\`import\` 只在当前进程里生效，而且这里没有 pip。日期、数学、排列这些常见需求，标准库已经够用。

\`datetime.date\` 做日历运算不需要时区数据。\`itertools.islice\` 可以从无限计数器里只取前几项。

${run(
  "python",
  'from datetime import date\nstart = date(2026, 10, 1)\nend = date(2026, 10, 15)\nprint((end - start).days)',
  "14",
  { title: "日期差" },
)}

${run(
  "python",
  'import math\nprint(math.gcd(24, 36))\nprint(round(math.sqrt(2), 3))',
  "12",
  { title: "math" },
)}

${run(
  "python",
  'import itertools\nprint(list(itertools.islice(itertools.count(1), 3)))\nprint(list(itertools.product("AB", "12")))',
  "[1, 2, 3]",
  { title: "itertools" },
)}

## 练习

用 \`itertools.permutations\` 打印 \`"AB"\` 的全部排列，每行一个。

${answerRun(
  "参考答案：排列",
  "python",
  'import itertools\nfor item in itertools.permutations("AB"):\n    print("".join(item))',
  "AB\nBA",
)}

${tail(["import requests。这个环境没有第三方包，也没有网络。", "依赖 random.random() 的具体小数。换版本可能变化，测试应比较同一颗种子的两次结果。"])}
`,
  ),
  P(
    {
      chapter: 10,
      slug: "oop",
      title: "面向对象",
      level: "intermediate",
      goals: ["定义类和构造方法", "用继承复用行为", "用 dataclass 少写样板"],
    },
    `
类把数据和操作放在一起。\`__init__\` 初始化实例属性。方法的第一个参数是实例自己，习惯叫 \`self\`。

子类可以覆盖方法。\`dataclass\` 会按字段自动生成初始化方法和可读的 \`repr\`。

${run(
  "python",
  'class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\nacc = Account("Ada", 100)\nacc.deposit(25)\nprint(acc.owner, acc.balance)',
  "Ada 125",
  { title: "账户" },
)}

${run(
  "python",
  'class Shape:\n    def area(self):\n        return 0\n\nclass Rect(Shape):\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    def area(self):\n        return self.w * self.h\n\nprint(Rect(3, 4).area())',
  "12",
  { title: "多态" },
)}

${run(
  "python",
  'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nprint(Point(1, 2))',
  "Point(x=1, y=2)",
  { title: "dataclass" },
)}

## 练习

写一个 \`Circle\`，\`area\` 返回 \`3 * r * r\`（不用圆周率，方便核对），打印半径 3 的面积。

${answerRun(
  "参考答案：圆形",
  "python",
  'class Circle:\n    def __init__(self, r):\n        self.r = r\n\n    def area(self):\n        return 3 * self.r * self.r\n\nprint(Circle(3).area())',
  "27",
)}

${tail(["忘记 self。实例方法的第一个参数必须接收对象本身。", "在类体里用可变默认值当全体实例共享的名单，却以为每人一份。"])}
`,
  ),
  P(
    {
      chapter: 11,
      slug: "iterators",
      title: "迭代器与生成器",
      level: "advanced",
      goals: ["用 yield 暂停函数", "只取无限序列的前几项", "把生成器串成管道"],
    },
    `
含有 \`yield\` 的函数返回生成器。每次 \`next\` 或 for 循环才往下走一步，做到哪算到哪，不会先把无限序列放进内存。

生成器表达式和列表推导式很像，只是用圆括号，而且是惰性的。

${run(
  "python",
  'def squares(limit):\n    n = 0\n    while n < limit:\n        yield n * n\n        n += 1\n\nprint(list(squares(4)))',
  "[0, 1, 4, 9]",
  { title: "有限生成器" },
)}

${run(
  "python",
  'def positives():\n    n = 1\n    while True:\n        yield n\n        n += 1\n\ndef take(source, count):\n    result = []\n    for item in source:\n        if len(result) == count:\n            break\n        result.append(item)\n    return result\n\nprint(take(positives(), 3))',
  "[1, 2, 3]",
  { title: "只取前几项" },
)}

${run(
  "python",
  'def window(items, size):\n    for i in range(len(items) - size + 1):\n        yield tuple(items[i:i + size])\n\nprint(list(window([1, 2, 3, 4], 2)))',
  "[(1, 2), (2, 3), (3, 4)]",
  { title: "滑动窗口" },
)}

## 练习

写一个生成器，依次产出前 4 个偶数：0 2 4 6。

${answerRun(
  "参考答案：偶数",
  "python",
  'def evens(count):\n    n = 0\n    while n < count:\n        yield n * 2\n        n += 1\n\nprint(list(evens(4)))',
  "[0, 2, 4, 6]",
)}

${tail(["对无限生成器直接 list()。它永远不会结束。先限制次数。", "生成器只能向前走。用过一次再 for，不会重新开始，需要再调用函数。"])}
`,
  ),
  P(
    {
      chapter: 12,
      slug: "decorators",
      title: "装饰器与上下文管理器",
      level: "advanced",
      goals: ["用闭包记住外层变量", "用装饰器包住函数", "用 with 管理进入和离开"],
    },
    `
装饰器是「接收函数、返回函数」的函数。\`@twice\` 写在 def 上面，等价于 \`inc = twice(inc)\`。

\`with\` 会调用对象的 \`__enter__\` 和 \`__exit__\`。适合成对出现的动作：打开然后一定关闭。这里不碰真实文件，只用打印把顺序展示出来。

${run(
  "python",
  'def twice(fn):\n    def inner(x):\n        return fn(fn(x))\n    return inner\n\n@twice\ndef inc(n):\n    return n + 1\n\nprint(inc(1))',
  "3",
  { title: "调用两次" },
)}

${run(
  "python",
  'def cache(fn):\n    saved = {}\n    def inner(n):\n        if n not in saved:\n            saved[n] = fn(n)\n        return saved[n]\n    return inner\n\n@cache\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(10))',
  "55",
  { title: "缓存" },
)}

${run(
  "python",
  'class Box:\n    def __enter__(self):\n        print("open")\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        print("close")\n        return False\n\nwith Box():\n    print("in")',
  "open\nin\nclose",
  { title: "with" },
)}

## 练习

写一个装饰器 \`shout\`，让函数的字符串返回值变成大写。

${answerRun(
  "参考答案：大写装饰器",
  "python",
  'def shout(fn):\n    def inner():\n        return fn().upper()\n    return inner\n\n@shout\ndef greet():\n    return "hello"\n\nprint(greet())',
  "HELLO",
)}

${tail(["装饰器里忘记 return inner。被装饰的名字会变成 None。", "__exit__ 返回 True 会把异常吞掉。只有确实处理了错误才返回真。"])}
`,
  ),
  P(
    {
      chapter: 13,
      slug: "project",
      title: "类型标注与小项目",
      level: "advanced",
      minutes: 16,
      goals: ["给函数加上类型标注", "用标注描述数据结构", "把前面的知识收成一个小判定"],
    },
    `
类型标注不改变 CPython 的运行结果，它是给人和检查工具看的说明。本环境不会做类型检查，写错标注程序仍会运行。

最后用一个固定棋盘判断井字棋胜负。输入可以换成别的九格，但示例本身不依赖随机。

${run(
  "python",
  'def add(a: int, b: int) -> int:\n    return a + b\n\nprint(add(20, 22))',
  "42",
  { title: "标注" },
)}

${run(
  "python",
  'def average(nums: list[int]) -> float:\n    return sum(nums) / len(nums)\n\nprint(average([2, 4, 6]))',
  "4.0",
  { title: "列表标注" },
)}

${note("3.11 可以直接写 list[int]。标注不会在运行时拒绝错误类型。")}

${run(
  "python",
  'def winner(cells: str) -> str:\n    lines = (\n        (0, 1, 2), (3, 4, 5), (6, 7, 8),\n        (0, 3, 6), (1, 4, 7), (2, 5, 8),\n        (0, 4, 8), (2, 4, 6),\n    )\n    for a, b, c in lines:\n        if cells[a] == cells[b] == cells[c] and cells[a] != ".":\n            return cells[a]\n    return "平"\n\nprint(winner("XXXOO...."))',
  "X",
  { title: "井字棋" },
)}

## 练习

读入九个字符的棋盘（点表示空），打印胜者或「平」。

${answerRun(
  "参考答案：读入棋盘",
  "python",
  'cells = input().strip()\nprint("O" if cells[0] == cells[1] == cells[2] == "O" else "其他")',
  "O",
  { stdin: "OOO......\n" },
)}

${tail(["以为标注会在运行时拒绝错误类型。CPython 默认不检查，3 仍然可以传给标注成 str 的参数。", "井字棋只查一行。对角线和列也要列进胜负组合。"])}
`,
  ),
];
