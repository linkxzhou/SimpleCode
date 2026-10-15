import { pack as basePack } from "./depth-lib.mjs";
import { extras } from "./depth-python-extra.mjs";

function pack(spec) {
  return basePack({ ...spec, extra: extras[spec.id] });
}

const py = (title, code, expect) => ({ lang: "python", title, code, expect });

const packs = {
  0: pack({
    id: "python-0",
    prose: `这个抽屉里的 Python 跑在 CPython 3.11 上。点 Run 时，示例会先把编辑器里的草稿备份下来，再替换成文档里的代码并执行。撤销能把草稿找回来，所以你可以放心把示例跑一遍，再改成自己的版本。每次运行都是新进程：变量、打开的文件、import 进来的模块都不会留到下一次。教程里的例子因此都写成「从零开始也能跑」的完整脚本。

这里没有网络，也装不了第三方包。标准库里随解释器带来的模块可以用，requests、numpy 这一类不行。一次运行内部可以创建文件，进程结束这些文件就消失。学习语法够用，不适合拿来做需要持久化的项目。

代码块有三种。带 Run 的会真正执行，期望输出是输出文本里的一段子串，测试用它判断示例有没有跑对。只读块故意不能运行，用来展示这个环境做不到的事，例如访问外网。纯文本块没有对应的运行时，所以没有运行按钮。同一章也可以放别的语言：运行时会切换侧栏选中的语言，第一次使用会下载对应的 wasm，进度显示在按钮旁边，按钮本身仍然写着 Run。

阅读顺序建议是：先看这段话在讲哪一个限制，再看示例如何把限制变成可以观察的输出，最后改一个字重跑。输出比期望多一行通常仍然包含期望子串，但你要能指出多出来的那一行是哪句 print 打的。不要把浏览器里能跑的代码原样贴进来，这个解释器没有网页，也没有 pip。`,
    samples: [
      py("相加", "print(19 + 23)", "42"),
      py("分隔符", 'print("Py", "thon", sep="")', "Python"),
    ],
    practices: [
      "每个可运行示例都写成完整脚本，不依赖上一次运行留下的变量。",
      "需要外网或第三方包时改成只读块，并在旁边说明为什么不能跑。",
      "期望输出写成稳定的子串，不把整段解释器横幅写进 expect。",
    ],
    summary: "Python 101 的例子都在一次全新的 CPython 3.11 进程里运行。Run 会替换编辑器并可以撤销；没有网络和第三方包；只读块用来标出做不到的事。",
    exercise: {
      prompt: "打印一行，内容是语言名和 3.11，中间用一个空格分开。",
      title: "参考答案：版本一行",
      lang: "python",
      code: 'print("Python", "3.11")',
      expect: "Python 3.11",
    },
  }),
  1: pack({
    id: "python-1",
    prose: `print 把对象转成文本写到标准输出。多个参数之间默认加空格，结尾默认加换行。你可以用 sep 改分隔符，用 end 改结尾。教学里多数时候保持默认，这样每一行输出对应一次 print，读终端时不容易串行。注释从 # 开始直到行尾，解释器直接跳过，所以注释里写错字不会让程序失败，但会让下一周的你读不懂。

缩进是语法的一部分。同一个块里的语句必须使用相同数量的空格，本教程统一四个空格。Tab 和空格混在一起时，看起来对齐，解释器却报 IndentationError。编辑器里请打开「用空格代替 Tab」。空行可以随便留，它不开始新的块，只是让眼睛休息。

字符串字面量外面的引号不属于输出。要在句子里出现引号，外层用单引号、内层用双引号，或者反过来。print 本身不负责对齐和表格，复杂的排版留给格式化，下一章再细说。现在先保证：你写在引号里的字，会原样出现在终端里。

运行按钮把这段代码放进编辑器之后，你仍然可以在编辑器里再加一行 print。那一次点击工具栏上的 Run，跑的是你改过的版本，不再自动对照文档里的期望。文档块上的期望只在从文档运行时才比较。`,
    samples: [
      py("不换行", 'print("A", end="")\nprint("B")', "AB"),
      py("平方", "print(2 ** 10)", "1024"),
    ],
    practices: [
      "同一代码块只用空格缩进，并且统一成四个空格。",
      "注释解释为什么，不重复代码已经写出的动作。",
      "一次 print 对应一行输出，调试时更容易对上终端。",
    ],
    summary: "print 负责把值写到标准输出，# 开头的文字会被跳过，缩进决定语句属于哪一块。先把这三件事写对，后面的类型和循环才有地方落脚。",
    exercise: {
      prompt: "用两次 print 打出两行：上一行是 1，下一行是 2。",
      title: "参考答案：两行数字",
      lang: "python",
      code: "print(1)\nprint(2)",
      expect: "1\n2",
    },
  }),
  2: pack({
    id: "python-2",
    prose: `名字是贴在对象上的标签，不是盒子里的一份拷贝。a = b 之后，两个名字先指向同一个对象；接下来给 a 重新赋值，只是把标签 a 挪走，b 仍指向原来的对象。不可变对象（数字、字符串）看起来像「改了就变」，其实是新对象换了标签。列表这类可变对象才会在原地被修改，两个名字会一起看见变化。分清这两件事，能少掉一类「我明明只改了一处」的 bug。

type(x) 返回类型对象，打印它的 __name__ 能得到 int、float、str、bool 这样的短名字。bool 是 int 的子类，True 加 True 等于 2，这是历史事实，不要在业务代码里依赖它。比较相等用 ==，比较是不是同一个对象用 is。None 这种单例才用 is，数字和字符串用 ==。

转换函数 int、float、str 会做出新对象。int("08") 得到 8，int("3.2") 会失败，因为小数点不属于整数字面量。先 float 再 int 会丢掉小数部分，而且是朝零截断，不是四舍五入。round 才负责舍入。文本和数字不能用 + 直接相加，解释器无法猜测你想拼接还是相加。

除法 / 的结果总是 float，即使整除得尽。只要整数商用 //，余数用 %。负数的余数方向和有些语言不同，初学阶段用非负数练习，避免把语言差异当成自己算错。`,
    samples: [
      py("截断", "print(int(3.9))\nprint(round(3.5))", "3"),
      py("整除", "print(20 // 6)\nprint(20 % 6)", "3\n2"),
    ],
    practices: [
      "数字和文本相加之前，先明确是要计算还是要拼接，并写出 int 或 str。",
      "和 None 比较用 is，和普通值比较用 ==。",
      "需要整数商时写 //，不要依赖 float 再取整。",
    ],
    summary: "赋值是贴标签，类型决定能做哪些运算。转换要显式，除法默认得到浮点数，整除和余数分别用 // 与 %。",
    exercise: {
      prompt: "把字符串 12 和 30 转成整数后相加并打印。",
      title: "参考答案：文本转整数",
      lang: "python",
      code: 'print(int("12") + int("30"))',
      expect: "42",
    },
  }),
  3: pack({
    id: "python-3",
    prose: `字符串一旦创建就不能改其中某一个字符。s[0] = "A" 会直接报错。要「修改」就做出新字符串：切片、拼接、replace、大小写转换都返回新对象，原来的 s 不变。这让字符串可以安全地当作字典的键，也让函数收到字符串时不必担心调用方的变量被悄悄改掉。

切片写成 s[起:止:步长]。起包含在内，止不包含，和 range 的习惯一样。省略起就是从头，省略止就是直到末尾。负数从末尾数，-1 是最后一个字符。步长为 -1 时从后往前取，于是 s[::-1] 是反转后的新字符串。中文也按字符计，不是按字节。len("你好") 是 2。

f-string 在引号前写 f，花括号里放表达式。表达式先求值，再转成文本嵌进去。格式写在冒号后面，{value:.1f} 表示保留一位小数，它只影响显示，不改变 value 的类型。要输出花括号本身，就写成双花括号。f-string 里不要塞太长的逻辑，算好之后再嵌进去，读的人不用在引号里面找 if。

input 读入一整行并去掉末尾换行，返回值永远是 str。提示语会先出现在输出里，然后程序停下来等输入。文档运行时，样例输入由测试填好；你在编辑器里自己跑，就要在终端键入。计算之前记得 int 或 float，否则你是在拼接文本。`,
    samples: [
      py("拼接", 'print("ab" + "cd")\nprint(len("你好"))', "abcd"),
      py("替换", 'print("2026-10-15".replace("-", "/"))', "2026/10/15"),
    ],
    practices: [
      "循环里拼接大量片段时，先放进列表，最后用 join，避免反复复制。",
      "input 的结果先转换类型，再参加算术。",
      "切片右端当成「到这里为止但不包括」。",
    ],
    summary: "字符串不可变，切片和 f-string 都产生新文本。input 给出的是去掉换行后的一行字符串，数值运算要先转换。",
    exercise: {
      prompt: "取字符串 SimpleCode 的前四个字符并打印。",
      title: "参考答案：前四个字符",
      lang: "python",
      code: 'print("SimpleCode"[:4])',
      expect: "Simp",
    },
  }),
  4: pack({
    id: "python-4",
    prose: `if、elif、else 组成一条互斥的链：上面的条件成立，下面的分支就不再看。条件表达式的结果要是真值。空字符串、0、空列表和 None 都当作假，其余多数对象当作真。不要写 if flag == True，直接写 if flag。相等比较用 ==，一个等号是赋值，写在 if 里会成为语法错误。

for 用来遍历一个序列，range(n) 产生 0 到 n-1。range(1, 8) 才包含 1 不包含 8。while 在条件为真时重复。循环里的 break 立刻离开这一层循环，continue 跳到下一轮。else 子句可以挂在循环后面，表示循环没有被 break 打断，初学时少用，读起来容易和 if 的 else 搞混。

随机数只要种子相同，后面的序列就相同。本环境不保证和你电脑上某一次 random.random() 的具体小数一致，所以示例比较两次 Random(同一个种子) 的结果，而不是把某个点数写死。需要「看起来随机、测试仍稳定」时，都用这个办法。

死循环会占住运行时。文档里那一段 while True 被标成跳过自动测试，你在页面上点了它，就要再点停止，否则下一个示例会先问你要不要中断。写自己的循环时，先想清楚每一轮哪一个变量在靠近结束条件。`,
    samples: [
      py("奇数和", "print(sum(n for n in range(1, 6) if n % 2))", "9"),
      py("数到三", "n = 0\nwhile n < 3:\n    n += 1\nprint(n)", "3"),
    ],
    practices: [
      "循环变量每轮都要向结束条件靠近，写完先用小范围在纸上走两轮。",
      "随机结果用固定种子互相比对，不把某一次的小数写进期望输出。",
      "多层条件从最具体的情况写到最一般的情况，避免前面的分支把后面盖住。",
    ],
    summary: "分支靠缩进和冒号组成块，for 遍历序列，while 靠条件停下来。随机数用种子固定下来，死循环要能停。",
    exercise: {
      prompt: "用 for 把 1 到 4 的整数加起来并打印。",
      title: "参考答案：一到四的和",
      lang: "python",
      code: "total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)",
      expect: "10",
    },
  }),
  5: pack({
    id: "python-5",
    prose: `列表是有序、可变的序列。下标从 0 开始，负数从末尾数。append 在末尾加一个元素，extend 把另一个序列里的元素逐个加进来。append 一个列表，得到的是嵌套，而不是更长的一层。切片读列表时得到新列表，改切片的结果不会影响原来的列表；按下标赋值则会改原来的那一格。

元组用圆括号，创建之后不能增删元素，但可以当作字典的键（前提是里面的元素都可哈希）。一个元素的元组必须写成 (x,)，否则括号只是分组。函数返回多个值时，实际上返回的就是一个元组，调用方可以一次解开。

列表推导把「对每个元素做变换、按条件留下」写成一行。它产生新列表，不改输入。推导里可以嵌套，但超过一层就不如普通 for 清楚。排序用 sorted 得到新列表，用 list.sort 在原地排。数字会按数值排；字符串按码点排，大写字母在小写前面。

拷贝要看深度。nums2 = nums 只是第二个名字。nums2 = nums[:] 或 list(nums) 是浅拷贝，内层列表仍共享。需要完全分开时用 copy.deepcopy。初学阶段如果列表里只放数字和字符串，浅拷贝就够。`,
    samples: [
      py("浅拷贝", "a = [1, 2]\nb = a[:]\nb.append(3)\nprint(len(a), len(b))", "2 3"),
      py("推导", 'print([n * n for n in range(1, 4)])', "[1, 4, 9]"),
    ],
    practices: [
      "要独立的一份列表时写切片或 list()，不要只多起一个名字。",
      "append 和 extend 的区别在调用前想清楚：加一个元素，还是加多个元素。",
      "单元素元组加上逗号，避免被括号当成普通分组。",
    ],
    summary: "列表可变、元组不可变。切片和推导产生新序列，多个名字指向同一列表时会一起看见修改。",
    exercise: {
      prompt: "从 [3, 1, 2] 做出排序后的新列表，打印第一个元素。",
      title: "参考答案：排序后的最小",
      lang: "python",
      code: "print(sorted([3, 1, 2])[0])",
      expect: "1",
    },
  }),
  6: pack({
    id: "python-6",
    prose: `字典把键映射到值。键必须可哈希，所以列表不能当键，元组里如果只含可哈希对象就可以。查找是均摊常数时间，比在列表里线性扫描适合「按名字找」。键不存在时，d[key] 抛 KeyError，d.get(key, default) 返回默认值。先用 in 判断再读取，和 get 是同一类意图：缺失是正常情况，不是事故。

遍历字典默认走键。items() 同时给出键和值，values() 只给值。插入顺序会被记住，但不要把「我插入的顺序」当成业务上的排序规则，需要顺序时用 sorted。更新另一个字典用 update，同名键会被覆盖。

集合里的元素唯一且可哈希。适合做去重和成员测试。| 是并集，& 是交集，- 是差集。空集合必须写 set()，{} 是空字典。集合没有下标，也不能切片。

计数字典是常见模式：counts[word] = counts.get(word, 0) + 1。collections.Counter 做同样的事，标准库里就有。本章先把 get 写熟，下一阶段再换 Counter，两种写法的结果应该一样。`,
    samples: [
      py("默认值", 'print({"a": 1}.get("b", 0))', "0"),
      py("交集", 'print(len({"a", "b"} & {"b", "c"}))', "1"),
    ],
    practices: [
      "缺失的键如果是正常情况，用 get 或 in，不要靠 KeyError 来分支。",
      "空集合写 set()，花括号留给字典。",
      "需要稳定顺序时排序键，不依赖遍历字典时的偶然顺序做断言。",
    ],
    summary: "字典按键取值，集合保证元素唯一。缺失键用 get，空集合不要写成花括号。",
    exercise: {
      prompt: "统计字符串 aab 里字母 a 出现的次数并打印。可以用字典。",
      title: "参考答案：数 a",
      lang: "python",
      code: 'text = "aab"\nprint(text.count("a"))',
      expect: "2",
    },
  }),
  7: pack({
    id: "python-7",
    prose: `def 定义函数。参数是调用时传入的名字，返回值用 return 交回去。没有 return 的函数返回 None。默认参数在定义时求值一次，而不是每次调用。默认值如果是列表或字典，所有调用会共享那一个对象，往里面 append 会越积越多。可变默认值写成 None，在函数体内再创建新列表。

位置参数按顺序对应，关键字参数按名字对应，关键字必须写在位置参数后面。*args 把多出来的位置参数收成元组，**kwargs 把多出来的关键字收成字典。调用时也可以用 * 把序列拆开传进去。

函数是对象，可以放进列表、当参数传递。lambda 适合写很短的表达式，超过一行就改回 def，方便断点和名字。闭包让内层函数记住外层的变量。要在内层重新绑定外层名字，用 nonlocal，否则你只是创建了一个同名的局部变量。

递归要有明显变小的参数和停下来的条件。记忆化可以把算过的结果存进字典，避免同一题算很多遍。递归深度有限制，能写成循环时循环更稳，尤其在这个单次运行、没有调栈空间的环境里。`,
    samples: [
      py("默认参数", "def add(a, b=1):\n    return a + b\nprint(add(41))", "42"),
      py("拆开", "def pair(a, b):\n    return a + b\nprint(pair(*[20, 22]))", "42"),
    ],
    practices: [
      "可变对象不要做默认参数，用 None 当作「还没有」的标记。",
      "函数只做一件事，名字用动词，返回值的类型在相邻调用里保持一致。",
      "递归先写停止条件，再写如何把问题变小。",
    ],
    summary: "函数用参数接收输入、用 return 交回结果。默认值只求一次，函数本身也可以当普通对象传来传去。",
    exercise: {
      prompt: "写一个函数，返回参数的两倍，并用 21 调用它。",
      title: "参考答案：两倍",
      lang: "python",
      code: "def twice(n):\n    return n * 2\nprint(twice(21))",
      expect: "42",
    },
  }),
  8: pack({
    id: "python-8",
    prose: `异常用来报告「这一步无法按约定完成」。raise 抛出，try 围住可能失败的代码，except 按类型接住。可以写多个 except，更具体的类型放在前面，因为解释器按书写顺序匹配，前面的父类会把子类也接住。except Exception 几乎什么都接，调试时会把真正的缺陷藏起来。不要写裸的 except:。

else 子句在 try 没有异常时运行，finally 无论是否异常都会运行，适合释放资源。文件用 with 打开时，离开块会自动关闭，通常不必再写 finally。异常不是另一种 if：能事先判断的情况（键在不在、除数是不是零）用条件更清楚；解析用户输入这种「格式错了才知道」的情况适合 try。

自定义异常继承 Exception，名字以 Error 结尾。调用方就可以 except 你的类型，而不是去读错误消息的文字。消息是给人看的，类型才是给程序分支用的。

traceback 从上到下是调用栈。最后一行是异常类型和消息，往上是谁调用了谁。修 bug 时先看最后一行，再看你自己的文件，跳过标准库内部的帧。这个环境的报错同样会进终端，退出码非零。`,
    samples: [
      py("else 子句", "try:\n    value = 1\nexcept ZeroDivisionError:\n    print('bad')\nelse:\n    print(value)", "1"),
      py("类型匹配", "try:\n    raise ValueError('x')\nexcept TypeError:\n    print('type')\nexcept ValueError:\n    print('value')", "value"),
    ],
    practices: [
      "except 写出具体类型，并且更具体的写在前面。",
      "能用条件判断的失败不要故意抛异常再接住。",
      "清理资源优先用 with，而不是记得在每条路径上 close。",
    ],
    summary: "异常按类型捕获，finally 和 with 负责清理。用户输入的格式错误适合 try，程序里的正常分支仍用 if。",
    exercise: {
      prompt: "把字符串 no 转成整数，失败时打印「失败」。",
      title: "参考答案：接住 ValueError",
      lang: "python",
      code: 'try:\n    print(int("no"))\nexcept ValueError:\n    print("失败")',
      expect: "失败",
    },
  }),
  9: pack({
    id: "python-9",
    prose: `import 把另一个模块的名字引进当前文件。import math 之后用 math.gcd，from math import gcd 则直接写 gcd。后者写起来短，但同名函数一多就不知道它来自哪里。教程里的示例尽量写全模块名，读代码时不用来回找。

导入只在这一次进程里有效。你不能 import 一个还没写到磁盘上的自己的第二文件来跨次运行，因为进程结束文件系统就清空了。标准库是例外：它跟解释器走，不需要你事先创建文件。math、datetime、itertools、random、json、pathlib 这些是本章的范围。

datetime.date 做日历差，不涉及时区数据库。timedelta 的 days 是整数。math.gcd 求最大公约数，math.sqrt 返回 float，拿来和期望输出比较时先 round，避免出现很长的小数尾巴。itertools 提供惰性的计数器、排列和切片，适合「不要一次生成无限序列」。

随机模块和上一章的种子约定相同。json 模块可以把字典收成文本再读回来，键会变成字符串。pathlib 在这一次运行里能创建临时路径，不要假设下一轮 Run 还能看见那个文件。`,
    samples: [
      py("四舍五入开方", "import math\nprint(round(math.sqrt(2), 2))", "1.41"),
      py("JSON 往返", 'import json\nprint(json.loads(json.dumps({"n": 42}))["n"])', "42"),
    ],
    practices: [
      "优先 import 模块而不是 import *，避免名字不知道从哪来。",
      "浮点结果先 round 再比较或打印固定位数。",
      "只使用标准库，第三方需求改成只读说明。",
    ],
    summary: "标准库覆盖数学、日期、迭代工具和 JSON。导入在单次进程内有效，浮点输出要收成稳定的位数。",
    exercise: {
      prompt: "用 math.gcd 打印 8 和 12 的最大公约数。",
      title: "参考答案：gcd",
      lang: "python",
      code: "import math\nprint(math.gcd(8, 12))",
      expect: "4",
    },
  }),
  10: pack({
    id: "python-10",
    prose: `类把数据和操作放在一起。class 的套件里写方法和类属性。实例属性在 __init__ 里挂到 self 上，每个对象各有一份。类属性挂在类上，所有实例共享，适合当常量，不适合当「每个对象自己的计数」，因为一个实例改了，其他实例也会看见。

方法的第一个参数是实例，习惯叫 self。调用时不需要自己把实例传进去，点号会做这件事。没有 @staticmethod 的方法如果通过类来调用，就必须手动传入实例。继承时子类的方法覆盖父类的同名方法，super() 用来调用父类版本，避免把父类名字写死。

dataclass 根据字段生成 __init__、__repr__ 和比较方法，省掉重复的样板。字段可以带默认值，有默认值的字段必须写在没有默认值的字段后面，和函数参数一样。冻结的 dataclass 近似不可变，适合当字典的键。

对象的相等和身份不同。默认的 == 比的是是不是同一个对象。定义了 __eq__ 之后，== 才按你的字段比较。打印对象时如果没写 __repr__，你只会看到内存地址，调试时很痛苦，所以要么用 dataclass，要么写一个简短的 __repr__。`,
    samples: [
      py("类属性", 'class Unit:\n    name = "m"\nprint(Unit().name)', "m"),
      py("repr", 'class Point:\n    def __init__(self, x):\n        self.x = x\n    def __repr__(self):\n        return f"Point({self.x})"\nprint(Point(3))', "Point(3)"),
    ],
    practices: [
      "每个对象自己的数据放在 self 上，不要放在类体里当可变类属性。",
      "需要可读输出时写 __repr__，或直接用 dataclass。",
      "覆盖方法后如果还要父类行为，显式调用 super()。",
    ],
    summary: "类用 self 保存每个对象的数据，继承用覆盖和 super 复用行为。dataclass 减少样板，相等和身份不是一回事。",
    exercise: {
      prompt: "定义一个只有 width 的类，方法 area 返回 width 乘 2，打印 width 为 5 的结果。",
      title: "参考答案：两倍宽",
      lang: "python",
      code: "class Line:\n    def __init__(self, width):\n        self.width = width\n    def span(self):\n        return self.width * 2\nprint(Line(5).span())",
      expect: "10",
    },
  }),
  11: pack({
    id: "python-11",
    prose: `迭代器是带 __next__ 的对象，每次给出一个值，耗尽时抛 StopIteration。for 循环会接住这个异常，所以你自己写 for 时看不到它。iter(对象) 向对象要迭代器。列表、字符串、字典都是可迭代对象，但它们自己不是迭代器：你可以多次 for 一个列表，每次都重新开始。迭代器通常只能走一遍，第二遍是空的。

生成器用 yield 写出迭代器，函数执行到 yield 就暂停，下次从那里继续。生成器适合无限序列或很大的序列，因为值是一个一个产生的，不会先占满内存。对无限生成器不要 list() 整个对象，用 islice 或自己的计数器只取前几项。

生成器表达式写成圆括号，和列表推导很像，但不会立刻做出列表。(n * n for n in range(3)) 是生成器。把它传给 sum 或 join 时，元素被消费掉。再传一次就没有了。

yield from 可以把另一个可迭代对象交出去，写遍历树或串联序列时比手写循环短。本章的例子保持一层，先把「暂停和恢复」看清楚。不要在生成器里夹杂 input，除非你确定每一次 next 时期望谁来喂输入。`,
    samples: [
      py("只走一遍", "gen = (n for n in (1, 2))\nprint(sum(gen))\nprint(sum(gen))", "3\n0"),
      py("yield from", "def wrap():\n    yield from (1, 2, 3)\nprint(sum(wrap()))", "6"),
    ],
    practices: [
      "无限序列用生成器，并且在取用时限制次数。",
      "生成器表达式只消费一次，需要再用就重新创建。",
      "能多次遍历的数据用列表，一次性的流水用迭代器。",
    ],
    summary: "for 消费迭代器直到结束。生成器用 yield 暂停，序列只走一遍，无限序列必须限制取用的个数。",
    exercise: {
      prompt: "写一个生成器，依次产出 2 和 4，打印它们的和。",
      title: "参考答案：两个偶数",
      lang: "python",
      code: "def evens():\n    yield 2\n    yield 4\nprint(sum(evens()))",
      expect: "6",
    },
  }),
  12: pack({
    id: "python-12",
    prose: `装饰器是「接收函数、返回函数」的函数。@decorator 写在 def 上面，等价于在定义之后立刻 func = decorator(func)。因此装饰器在函数定义时就执行，不是等到调用时。要给每次调用加行为，就在装饰器内部再定义一个 wrapper，由 wrapper 去调用原函数。

wrapper 应该使用 functools.wraps，把原函数的名字和文档字符串拷过来。否则帮助文本和错误栈里全是 wrapper，不好查。参数用 *args 和 **kwargs 原样转交，这样被装饰的函数无论有几个参数都能用。

带参数的装饰器是三层函数：最外层接收装饰参数，中间层接收函数，内层才是每次调用。读的时候从内往外看「谁在调用谁」。如果只是想在调用前后打印，两层就够，不要为了形式凑成三层。

装饰器适合横切的小事：计时、记日志、检查权限、缓存结果。不适合把业务分支藏进去。读代码的人会先看函数体，如果主要逻辑在装饰器里，函数体就会显得空。缓存用 functools.lru_cache 或自己的字典都可以，参数必须可哈希。`,
    samples: [
      py("调用次数", "def count(fn):\n    def wrap(n):\n        wrap.calls += 1\n        return fn(n)\n    wrap.calls = 0\n    return wrap\n\n@count\ndef inc(n):\n    return n + 1\n\ninc(1)\ninc(1)\nprint(inc.calls)", "2"),
      py("恒等装饰", "def same(fn):\n    return fn\n\n@same\ndef value():\n    return 7\nprint(value())", "7"),
    ],
    practices: [
      "用 functools.wraps 保留原函数的名字。",
      "装饰器只添加横切行为，不把主要业务藏进去。",
      "需要参数的装饰器再加一层，并且先用打印确认每一层何时执行。",
    ],
    summary: "装饰器在定义时包住函数，真正的额外行为放在内部 wrapper 里，并在调用时转交参数。",
    exercise: {
      prompt: "写一个装饰器，把函数的返回值加 1。用它装饰一个返回 41 的函数并打印。",
      title: "参考答案：结果加一",
      lang: "python",
      code: "def plus_one(fn):\n    def wrap():\n        return fn() + 1\n    return wrap\n\n@plus_one\ndef answer():\n    return 41\nprint(answer())",
      expect: "42",
    },
  }),
  13: pack({
    id: "python-13",
    prose: `小项目把前面的类型、分支、函数和输入输出放进一个能读完的脚本。范围要小：一次运行、标准输入、标准输出、没有网络、不保留文件。待办清单、计分、简单的棋盘判断都适合，因为规则可以用纯函数表达，测试只看打印出来的文本。

先写数据怎么表示。一条待办可以是字典，也可以是只有两个字段的小类。字段少就用元组或字典，字段会继续长再引入类。然后写「一条命令进来，状态如何变」的函数，最后才写读输入的循环。这样核心逻辑不依赖 input，你可以在函数里直接传入字符串做试验。

输入按行处理。strip 去掉首尾空白，split 最多分成命令和正文两段，避免正文里的空格被切碎。空行直接跳过。未知命令打印一句固定的提示，而不是抛到栈顶，因为用户打错字是预期内的事。

结束条件用输入结束（EOF），不要写死循环等一个永远不来的命令。文档运行会在样例输入之后送上 EOF。你自己在终端里可以按 Ctrl-D（macOS / Linux）结束输入。打印结果时每一行都带上稳定的前缀或固定格式，后面的人才能用子串做自动检查。`,
    samples: [
      py("跳过空行", 'lines = ["add a", "", "add b"]\nprint(sum(1 for line in lines if line.strip()))', "2"),
      py("拆命令", 'text = "add 买笔"\ncmd, rest = text.split(" ", 1)\nprint(cmd)\nprint(rest)', "add"),
    ],
    practices: [
      "把规则写成不读输入的函数，循环只负责取行和打印。",
      "命令拆分限制次数，保留正文里的空格。",
      "未知命令给出固定提示，不用异常充当正常分支。",
    ],
    summary: "小项目限制在一次运行和标准输入输出之内。先定数据，再写纯函数，最后用按行循环把命令接起来。",
    exercise: {
      prompt: "给定两行文本 add a 和 list，统计以 add 开头的行数并打印。不要读 input，直接用列表。",
      title: "参考答案：数 add",
      lang: "python",
      code: 'lines = ["add a", "list"]\nprint(sum(1 for line in lines if line.startswith("add")))',
      expect: "1",
    },
  }),
};

export function pythonPack(chapter) {
  const found = packs[chapter];
  if (!found) throw new Error(`missing python depth for chapter ${chapter}`);
  return found;
}
