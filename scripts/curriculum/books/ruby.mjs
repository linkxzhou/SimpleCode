import { book } from "./rich.mjs";

const links = `- [Ruby in Twenty Minutes](https://www.ruby-lang.org/en/documentation/quickstart/)（仅链接）
- [Learn X in Y minutes — Ruby](https://learnxinyminutes.com/ruby/)（CC BY-SA 3.0，仅链接）`;
const credit = "正文为原创。知识点范围参考了 Ruby 官方二十分钟入门与 Learn X in Y minutes — Ruby，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：Ruby 在这个抽屉里",
    goals: ["知道每次运行都是新进程", "分清可运行示例和只读示例", "用 puts 看到结果"],
    prose: `Ruby 在这里由随仓库提供的 Ruby 3.2 解释器执行。点代码块上的 Run，示例会换进主编辑器并马上跑。原来的草稿先备份，可以撤销。每次运行都是新进程：上一段里的变量、打开的文件都不会留下。

这里没有网络，也装不了 gem。能写的是语言本身：puts、数组、哈希、方法、块和类。需要别的文件或第三方库时，把那段标成只读，并写明原因。期望输出是子串。程序可以多打一行说明，只要关键结果还在。

工具栏上的 Run 和代码块上的 Run 是同一个按钮。代码块负责写入示例再运行；工具栏只运行编辑器里已经有的内容。下载进度写在按钮旁边。`,
    samples: [
      s("只读", "# gem install 在这里不会成功，也不要在可运行示例里访问网络。\n# require \"net/http\"", "", { norun: true }),
      s("相加", "puts 19 + 23", "42"),
      s("问候", 'puts "你好"', "你好"),
    ],
    mistakes: [
      "把上一次运行的变量当成还在。每次 Run 都是新进程。",
      "在可运行块里 gem install 或访问网络。",
      "把期望写成整段终端横幅，而不是稳定的子串。",
    ],
    practices: [
      "每个示例都写成能单独运行的完整脚本。",
      "做不到的事用只读块标出来。",
      "用 puts 打出你要核对的那一个值。",
    ],
    summary: "Ruby 101 的例子在一次新的 Ruby 3.2 进程里运行。没有 gem 和网络。puts 把结果写到终端，期望是子串。",
    exercises: [
      { title: "参考答案：语言名", prompt: "打印一行 Ruby。", code: 'puts "Ruby"', expect: "Ruby" },
      { title: "参考答案：乘积", prompt: "打印 6 和 7 的乘积。", code: "puts 6 * 7", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "hello",
    title: "输出与注释",
    level: "beginner",
    goals: ["用 puts 和 print 打出文本", "写出注释", "知道 puts 会换行"],
    prose: `puts 把对象打到标准输出，并在末尾加换行。print 不加换行，下一次输出会接在同一行。教学里多数时候用 puts，这样一行输出对应一次调用。注释从 # 开始直到行尾，解释器跳过。注释写错不会让程序失败，却会让你按错误的说明去改对的代码。

字符串外面的引号不属于输出。要在句子里出现引号，外层和内层互换单双引号。puts 多个参数时，每个参数各占一行，而不是用空格拼在一行。这和 Python 的 print 不同，刚从 Python 过来时最容易看错。

空行可以随便留，它不改变语法。缩进在 Ruby 里不是语法，只是给人看的。本教程仍把方法体缩进两个空格，让块的边界清楚。`,
    samples: [
      s("两行", 'puts "Ada"\nputs "Lovelace"', "Ada"),
      s("不换行", 'print "A"\nputs "B"', "AB"),
      s("注释", 'puts "可见"\n# 这一行不会出现\nputs 2026', "可见"),
    ],
    mistakes: [
      "以为 puts 的多个参数会像 Python 那样用空格连成一行。",
      "用 print 之后忘了最后一次要换行，下一行结果粘在一起。",
      "注释里写了和代码相反的话，过几天按注释把程序改错。",
    ],
    practices: [
      "一次 puts 对应一行需要核对的输出。",
      "注释只写代码看不出来的约束。",
      "方法体统一缩进两个空格。",
    ],
    summary: "puts 负责换行输出，print 接在同一行，# 后面的文字会被跳过。多个参数的 puts 是多行，不是一行。",
    exercises: [
      { title: "参考答案：两行数字", prompt: "用两次 puts 打出 1 和 2，各占一行。", code: "puts 1\nputs 2", expect: "1" },
      { title: "参考答案：连在一起", prompt: "用 print 和 puts 打出 AB。", code: 'print "A"\nputs "B"', expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "numbers",
    title: "数字与变量",
    level: "beginner",
    goals: ["用局部变量保存值", "区分整数除法和余数", "把文本转成整数"],
    prose: `局部变量第一次赋值就诞生，不需要声明类型。名字是标签。a = b 之后两个名字先指向同一个对象；再给 a 赋值，只是把 a 挪走。数字不能原地改，所以 a = a + 1 会得到一个新数字。

整数相除仍是整数，小数部分直接丢掉。20 / 6 得到 3，余数用 %，20 % 6 得到 2。需要小数时，让其中一个数是浮点，例如 20 / 6.0。不要靠「看起来像除法」得到小数。

Integer("12") 把整段文本转成整数。Integer("08") 得到 8。Integer("3.2") 会失败，因为小数点不属于整数字面量。先 Float 再 to_i 是朝零截断。文本和数字不能直接相加，解释器无法猜测你要拼接还是相加，必须先转换。

nil 表示没有值。和 nil 比较用 nil?，不要把 nil 和 false 混成同一种失败。false 和 nil 在条件里都是假，其余对象，包括 0 和空字符串，都是真。这是 Ruby 和很多语言不一样的地方。`,
    samples: [
      s("整除", "puts 20 / 6\nputs 20 % 6", "3"),
      s("转整数", 'puts Integer("12") + Integer("30")', "42"),
      s("零是真", 'puts(0 ? "yes" : "no")', "yes"),
    ],
    mistakes: [
      "以为 20 / 6 会得到带小数的结果。",
      "把字符串和数字用 + 连起来。",
      "把 0 或空字符串当成假。在 Ruby 里它们是真。",
    ],
    practices: [
      "要整数商时确认两边都是整数；要小数时写浮点。",
      "来自文本的数先 Integer 或 Float，再运算。",
      "条件里不要用 0 表示失败，用 nil 或 false。",
    ],
    summary: "赋值是贴标签。整数相除丢掉小数，余数用 %。0 和空字符串在条件里为真，只有 nil 和 false 为假。",
    exercises: [
      { title: "参考答案：商", prompt: "打印 17 除以 5 的整数商。", code: "puts 17 / 5", expect: "3" },
      { title: "参考答案：文本相加", prompt: "把字符串 20 和 22 转成整数后相加并打印。", code: 'puts Integer("20") + Integer("22")', expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "strings",
    title: "字符串",
    level: "beginner",
    goals: ["拼接和插值", "按区间切片", "用 chomp 去掉换行"],
    prose: `字符串可以用 + 拼接，也可以在双引号里用 #{表达式} 插值。单引号里的 #{ } 不会插值，几乎按字面留下。插值先求值再转成文本。表达式太长时，先放进变量再插进去。

切片和 Python 不同。s[0, 4] 的第二个数是长度，不是结束下标。s[0...4] 用三个点，结束下标不包含。两个点 s[0..3] 则包含结束下标。刚开始只记一种：三个点的区间，右端不包含。中文按字符计，"你好".length 是 2。

gets 读入一行，末尾带着换行。算长度或拼接之前要 chomp，否则换行会躲在字符串里，打印时多出一行。文档运行时样例输入由测试填好。你自己在终端跑，就要亲手输入。

字符串可以改某一个字符，这和 Python 的不可变字符串不同。s[0] = "A" 会改原来的对象。若两个变量指向同一个字符串，一处改了另一处也看见。需要各自一份时用 dup。`,
    samples: [
      s("插值", 'name = "Ada"\nputs "你好，#{name}"', "你好，Ada"),
      s("前四个", 'puts "SimpleCode"[0...4]', "Simp"),
      s("去掉换行", 'line = "Ada\\n"\nputs line.chomp', "Ada"),
    ],
    mistakes: [
      "把 s[0, 4] 理解成 Python 的结束下标。第二个数是长度。",
      "在单引号里写 #{name}，以为会替换。",
      "gets 之后不 chomp，换行被算进字符串。",
    ],
    practices: [
      "切片先选一种写法，三个点的右端不包含。",
      "双引号才做插值。",
      "从输入来的一行先 chomp 再使用。",
    ],
    summary: "双引号可以插值。三个点的切片不包含右端，[起, 长度] 的第二个数是长度。gets 的换行要用 chomp 去掉。",
    exercises: [
      { title: "参考答案：替换", prompt: "把 2026-10-15 里的横线换成斜线并打印。", code: 'puts "2026-10-15".tr("-", "/")', expect: "2026/10/15" },
      { title: "参考答案：长度", prompt: "打印字符串 你好 的字符数。", code: 'puts "你好".length', expect: "2" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "control",
    title: "分支与循环",
    level: "beginner",
    goals: ["用 if 和 else 分支", "用 times 和 each 循环", "写出能停下来的 while"],
    prose: `if、elsif、else 组成一条互斥的链。上面的条件成立，下面就不再看。更具体的条件要写在前面。条件的假只有 nil 和 false。0、空字符串、空数组都是真，所以 if items 不能用来判断「数组是空的」，要看 empty? 或 length。

times 把一段块执行固定次数。each 遍历数组或范围。1..4 包含 4，1...4 不包含 4。范围的点的个数和字符串切片一样，三个点不包含右端。while 在条件为真时重复。写 while 时先说出每一轮哪一个变量在靠近结束。说不出来就先别运行。

case 用 === 匹配。对类来说，case 能认出是不是那个类的实例；对范围来说，能认出数在不在里面。不要把它当成一串 ==。本教程的简单分支仍用 if，case 留给「一个值对多种形状」。

死循环会占住运行时。页面上如果跑了一个不会停的 while，要点停止，否则下一个示例会先问你要不要中断。`,
    samples: [
      s("奇数和", "total = 0\n(1..5).each { |n| total += n if n.odd? }\nputs total", "9"),
      s("数到三", "n = 0\nwhile n < 3\n  n += 1\nend\nputs n", "3"),
      s("空数组是真", 'items = []\nputs(items ? "yes" : "no")\nputs(items.empty? ? "empty" : "full")', "yes"),
    ],
    mistakes: [
      "用 if items 判断数组为空。空数组是真。",
      "把 1..4 和 1...4 看成一样。三个点不包含右端。",
      "while 里忘记改变条件用到的变量。",
    ],
    practices: [
      "知道次数时用 times 或 each，少写 while。",
      "范围先决定右端包不包含。",
      "空集合用 empty?，不要靠条件真假。",
    ],
    summary: "分支只把 nil 和 false 当假。each 和 times 负责重复，三个点的范围不包含右端。while 必须有变量靠近结束。",
    exercises: [
      { title: "参考答案：一到四", prompt: "把 1 到 4 加起来并打印。包含 4。", code: "total = 0\n(1..4).each { |n| total += n }\nputs total", expect: "10" },
      { title: "参考答案：三次", prompt: "用 times 把变量加三次，从 0 开始，打印结果。", code: "n = 0\n3.times { n += 1 }\nputs n", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "arrays",
    title: "数组",
    level: "intermediate",
    goals: ["按下标和切片取元素", "用 map 得到新数组", "分清改原数组和复制"],
    prose: `数组有序，下标从 0 开始。负数从末尾数，-1 是最后一个。a[0, 2] 里的 2 是长度，不是结束下标。first 和 last 比下标更容易读。

map 对每个元素做变换，返回新数组，不改原来的。select 留下使块为真的元素。sum 把数字加起来，记得给空数组一个起点时可以用 sum(0)，否则空数组的 sum 是 0，这是安全的。sort 返回新数组。sort! 和 map! 带叹号的方法会改原来的数组。

a = b 只是第二个名字。b = a.dup 得到一层新数组，里面的元素仍共享。元素是数字时，浅拷贝就够，因为数字不能原地改。push 和 << 都在末尾加元素，并且改的是原数组。

puts 一个数组会把每个元素打成一行，而不是打出带方括号的样子。要看结构，用 p。测试时期望写成 p 打出的那一行，避免被多行输出搞混。`,
    samples: [
      s("平方", "p (1..3).map { |n| n * n }", "[1, 4, 9]"),
      s("浅拷贝", "a = [1, 2]\nb = a.dup\nb << 3\nputs a.length\nputs b.length", "2"),
      s("最小", "puts [3, 1, 2].min", "1"),
    ],
    mistakes: [
      "把 a[0, 2] 当成到下标 2 为止。第二个数是长度。",
      "用 puts 打印数组，以为会看到方括号。",
      "只多起一个名字就以为得到了独立的数组。",
    ],
    practices: [
      "要新数组时用 map、select、sort，不用带叹号的版本。",
      "需要看结构时用 p。",
      "要独立的一份时用 dup。",
    ],
    summary: "数组下标从 0 开始，切片的第二个数常常是长度。map 产生新数组，带叹号的方法改原来的。puts 数组会拆成多行。",
    exercises: [
      { title: "参考答案：大于 2", prompt: "从 [1, 2, 3, 4] 留下大于 2 的数，用 p 打印。", code: "p [1, 2, 3, 4].select { |n| n > 2 }", expect: "[3, 4]" },
      { title: "参考答案：和", prompt: "打印 [1, 2, 3, 4] 的和。", code: "puts [1, 2, 3, 4].sum", expect: "10" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "hashes",
    title: "哈希",
    level: "intermediate",
    goals: ["用键取值", "区分符号键和字符串键", "给缺失的键一个默认"],
    prose: `哈希把键映射到值。键可以是几乎任何对象，教学里用符号或字符串，不要混用。:name 和 "name" 不是同一个键。字面量 { name: "Ada" } 的键是符号。取的时候用同一类键，否则会得到 nil，看起来像没有这个人。

fetch 在键缺失时可以给出默认值，也可以在没有默认值时抛异常。[] 在缺失时返回 nil。若 nil 本身是合法的值，就不能靠返回值是不是 nil 来判断键在不在，要用 key?。

each 同时给出键和值。插入顺序会被记住，但不要把插入顺序当成业务排序。需要稳定顺序时，把键排序后再打印。merge 返回新哈希，同名键以后面的为准。merge! 改原来的。

空哈希写成 {}。它是真值。判断没有条目用 empty?。统计次数的常见写法是 counts[word] = counts.fetch(word, 0) + 1。`,
    samples: [
      s("默认值", 'puts({ "a" => 1 }.fetch("b", 0))', "0"),
      s("符号键", 'box = { n: 2 }\nputs box[:n]', "2"),
      s("计数", 'text = "aab"\ncounts = {}\ntext.each_char { |ch| counts[ch] = counts.fetch(ch, 0) + 1 }\nputs counts["a"]', "2"),
    ],
    mistakes: [
      "用字符串去取符号键，得到 nil 还以为逻辑错了。",
      "键缺失时 [] 返回 nil，又把 nil 当成合法分数。",
      "改了 merge 的返回值，却以为原哈希变了。",
    ],
    practices: [
      "一个哈希里的键只用一种：要么全是符号，要么全是字符串。",
      "缺失是正常情况时用 fetch 的默认值或 key?。",
      "需要新哈希时用 merge，不带叹号。",
    ],
    summary: "哈希按键取值。符号和字符串不是同一个键。fetch 能在缺失时给出默认，[] 则返回 nil。",
    exercises: [
      { title: "参考答案：取值", prompt: "建一个符号键 n 为 42 的哈希并打印这个值。", code: "puts({ n: 42 }[:n])", expect: "42" },
      { title: "参考答案：缺失", prompt: "对空哈希 fetch 键 a，默认 0，并打印。", code: 'puts({}.fetch("a", 0))', expect: "0" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "methods",
    title: "方法与块",
    level: "intermediate",
    goals: ["定义带参数的方法", "把块传进方法", "知道默认参数何时启用"],
    prose: `def 定义方法。参数按位置传入，也可以写默认值。默认值在没传那个参数时使用。return 可以省掉，方法会返回最后一行表达式的值。本教程需要看结果时仍然 puts，不依赖隐式返回被打印出来，因为返回值本身不会自动出现在终端。

块是传给方法的一段代码。yield 在方法里执行这块代码。带参数的块写成 { |n| ... } 或 do |n| ... end。一行时用花括号，多行时用 do end。map、each、select 接收的就是块。

块能看见外面的局部变量，并且能改它。这和「复制当时的值」不同。循环里创建块并改外层变量时，先想清楚这些块是不是共享同一个变量。

方法的参数个数不对会在调用时失败，定义时往往不报错。写完用一个具体的数调用一次，把结果打出来。不要把方法的返回值和方法有没有 puts 搞混。`,
    samples: [
      s("默认参数", "def add(a, b = 1)\n  a + b\nend\nputs add(41)", "42"),
      s("yield", "def twice\n  yield\n  yield\nend\nn = 0\ntwice { n += 1 }\nputs n", "2"),
      s("map", "puts [1, 2, 3].map { |n| n * 2 }.sum", "12"),
    ],
    mistakes: [
      "以为方法最后一行会自己打印。终端只看见 puts 或 print。",
      "花括号块和 do end 的优先级不同，链式调用时绑错对象。",
      "默认参数写成会变的对象并在方法里修改，多次调用会共享那一份。",
    ],
    practices: [
      "要核对的结果用 puts 打出来。",
      "一行的块用花括号，多行用 do end。",
      "默认值只用数字、字符串这类不会被改内容的对象。",
    ],
    summary: "方法用参数接收输入，最后一行是返回值，但不会自动打印。块用 yield 或迭代方法执行，并能看见外层变量。",
    exercises: [
      { title: "参考答案：两倍", prompt: "写方法返回参数的两倍，用 21 调用并打印。", code: "def twice(n)\n  n * 2\nend\nputs twice(21)", expect: "42" },
      { title: "参考答案：平方和", prompt: "把 [1, 2, 3] 每个数平方后求和并打印。", code: "puts [1, 2, 3].map { |n| n * n }.sum", expect: "14" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "classes",
    title: "类",
    level: "intermediate",
    goals: ["用 initialize 保存每个对象的数据", "区分类方法和实例方法", "知道继承覆盖同名方法"],
    prose: `class 把数据和方法放在一起。initialize 在 new 时运行，习惯把每个对象自己的数据放进 @ 开头的实例变量。实例变量不需要事先声明。忘记在 initialize 里赋值，后面读取会得到 nil。

实例方法的接收者是那个对象。调用时写对象.方法，不要自己把对象再传一遍。类方法写成 def self.名字，属于类本身，适合做不依赖某一个对象的构造。@@ 开头的类变量被所有实例共享，教学里不用它当「每个对象自己的计数」，因为一处改了全班都看见。

子类用 < 继承。同名方法覆盖父类。还需要父类行为时写 super。不要把继承理解成「把父类的代码复制一份」。对象的相等默认比的是是不是同一个对象。需要按字段比较时再定义 ==。

attr_reader 帮你写出读取实例变量的方法。能用它就不必手写只有一行的 getter。打印对象时如果没有定义可读的形式，你只会看到一串地址。调试时至少 puts 你关心的那个字段。`,
    samples: [
      s("两倍宽", "class Line\n  def initialize(width)\n    @width = width\n  end\n  def span\n    @width * 2\n  end\nend\nputs Line.new(5).span", "10"),
      s("覆盖", "class A\n  def n\n    1\n  end\nend\nclass B < A\n  def n\n    super + 1\n  end\nend\nputs B.new.n", "2"),
      s("读取", "class Unit\n  attr_reader :name\n  def initialize(name)\n    @name = name\n  end\nend\nputs Unit.new(\"m\").name", "m"),
    ],
    mistakes: [
      "把每个对象的计数放在类变量里，结果所有对象共用一个数。",
      "覆盖方法后忘了 super，父类里必要的初始化没有跑。",
      "new 的时候漏了 initialize 的参数，得到 ArgumentError 却去改调用以外的代码。",
    ],
    practices: [
      "每个对象的数据放在实例变量里，并在 initialize 赋值。",
      "只读字段用 attr_reader。",
      "覆盖后如果还要父类的结果，显式 super。",
    ],
    summary: "类用 initialize 和实例变量保存每个对象的数据。子类可以覆盖方法并用 super 复用父类。类变量是共享的，不要拿来当个别对象的状态。",
    exercises: [
      { title: "参考答案：加一", prompt: "定义只有一个数的类，方法 next 返回这个数加 1。打印初值为 41 的结果。", code: "class Num\n  def initialize(n)\n    @n = n\n  end\n  def next\n    @n + 1\n  end\nend\nputs Num.new(41).next", expect: "42" },
      { title: "参考答案：名字", prompt: "用 attr_reader 保存 name，打印 Ada。", code: "class Person\n  attr_reader :name\n  def initialize(name)\n    @name = name\n  end\nend\nputs Person.new(\"Ada\").name", expect: "Ada" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "errors",
    title: "错误",
    level: "advanced",
    goals: ["用 begin 和 rescue 接住异常", "按类型区分失败", "不把正常分支写成异常"],
    prose: `raise 抛出异常，begin 围住可能失败的代码，rescue 按类型接住。可以写多个 rescue，更具体的类型放在前面。rescue 不写类型时会接住 StandardError 及其子类，范围已经很大。不要写成什么都吞掉然后继续跑，那样名字写错也会被当成输入错误。

else 这类「没有异常才继续」可以用 begin 成功之后的普通代码代替。ensure 无论是否异常都会运行，适合做收尾。收尾里再抛异常会盖住原来的错误，所以 ensure 保持短。

能事先判断的情况用 if：键在不在、除数是不是零。解析用户输入这种「格式错了才知道」的情况适合 begin。Integer("no") 会抛 ArgumentError。接住之后打印固定的词，测试才稳。不要把异常消息的全文写进期望，消息可能带行号。

自定义异常继承 StandardError，名字以 Error 结尾。调用方 rescue 你的类型，而不是去读消息里的某个词。`,
    samples: [
      s("接住", "begin\n  Integer(\"no\")\n  puts \"ok\"\nrescue ArgumentError\n  puts \"失败\"\nend", "失败"),
      s("类型", "begin\n  raise ArgumentError, \"x\"\nrescue TypeError\n  puts \"type\"\nrescue ArgumentError\n  puts \"arg\"\nend", "arg"),
      s("ensure", "n = 0\nbegin\n  n = 1\nensure\n  n += 1\nend\nputs n", "2"),
    ],
    mistakes: [
      "rescue 不写类型，把真正的缺陷也接住。",
      "靠异常消息的全文做分支。",
      "能用 if 判断的情况故意 raise 再 rescue。",
    ],
    practices: [
      "rescue 写出具体类型，更具体的放前面。",
      "失败时打印固定的短词，不打印整段消息。",
      "ensure 里只做收尾，不再抛新的异常。",
    ],
    summary: "异常按类型接住。解析文本适合 begin，能提前判断的失败仍用 if。ensure 一定会运行，里面不要再制造新的失败。",
    exercises: [
      { title: "参考答案：整数", prompt: "把 no 转成整数，失败时打印「失败」。", code: "begin\n  puts Integer(\"no\")\nrescue ArgumentError\n  puts \"失败\"\nend", expect: "失败" },
      { title: "参考答案：成功", prompt: "把 7 转成整数并打印。", code: 'puts Integer("7")', expect: "7" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "enum",
    title: "枚举与组合",
    level: "advanced",
    goals: ["把 map、select、sum 连起来", "用 any? 和 all? 提问", "避免在链的中途改原数组"],
    prose: `数组和范围都支持同一套枚举方法。map 变换，select 过滤，reject 丢掉，sum 合计，any? 问有没有一个为真，all? 问是不是全部为真。它们可以连成一条链。读的时候从左到右，每一步的结果是下一步的输入。

链的中间如果插入带叹号的方法，原来的数组会被改掉，后面的步骤看到的是改过的数据，也让调用方丢失旧顺序。教学例子不用叹号，需要排序时用 sort 得到新数组。

reduce 把元素收成一个值。一定要给初值。空数组没有初值时，reduce 的行为容易看错；给了 0，空数组的和就是 0。sum 对数字更直接，能用 sum 就不必写 reduce。

块里的参数名字保持一种风格。同一条链上用 n 表示元素。不需要下标时不要去要下标。链太长时，先把中间结果放进有名字的变量，报错会更好读。`,
    samples: [
      s("偶数平方和", "puts [1, 2, 3, 4].select { |n| n.even? }.map { |n| n * n }.sum", "20"),
      s("有没有负数", 'puts([1, -2, 3].any? { |n| n < 0 } ? "yes" : "no")', "yes"),
      s("全部为正", 'puts([1, 2, 3].all? { |n| n > 0 } ? "yes" : "no")', "yes"),
    ],
    mistakes: [
      "在链中间 sort!，调用方的数组顺序被改掉。",
      "空集合用 any? 的结果去表示「有数据」。空集合的 any? 是 false。",
      "一条链写得太长，中间类型已经不是数组还继续 map。",
    ],
    practices: [
      "过滤、变换、合计分成看得懂的三步。",
      "不在枚举链里使用带叹号的方法。",
      "数字合计优先用 sum。",
    ],
    summary: "map、select 和 sum 可以连起来，从左到右读。它们产生新结果。带叹号的方法会改原数组，不要放进链里。",
    exercises: [
      { title: "参考答案：奇数和", prompt: "求 [1, 2, 3, 4, 5] 里奇数的和并打印。", code: "puts [1, 2, 3, 4, 5].select { |n| n.odd? }.sum", expect: "9" },
      { title: "参考答案：没有零", prompt: "判断 [1, 2, 3] 是否全部非零，是就打印 yes。", code: 'puts([1, 2, 3].all? { |n| n != 0 } ? "yes" : "no")', expect: "yes" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "score",
    title: "记分小项目",
    level: "advanced",
    goals: ["用哈希保存名字到分数", "把规则写成不读输入的方法", "跳过空行并拆开命令"],
    prose: `小项目把前面的类型、分支、方法和哈希放进一个能读完的脚本。范围限制在一次运行和标准输出。没有网络，也不保留文件。规则用方法表达，测试只看打印出来的文本。

一条命令可以是数组里的字符串，不必真的去读键盘。先把「一行文本如何改变哈希」写成方法，再写循环。这样核心逻辑不调用 gets，你可以直接传入字符串做试验。循环只负责取行和打印。

拆分时限制成两段，名字里的空格才能留下。空行跳过。未知命令打印一句固定的提示，不用异常充当打错字。访问第二段之前看拆分结果的长度。输出用固定格式，例如只打印总分，后面的自动检查靠子串。

同一次运行里可以先加分再查总分。下一次 Run 哈希就没了，这是环境的限制，不是命令写错。`,
    samples: [
      s("跳过空行", 'lines = ["add Ada 1", "", "add Ada 2"]\nputs lines.count { |line| !line.strip.empty? }', "2"),
      s("总分", "scores = {}\ndef add(scores, name, n)\n  scores[name] = scores.fetch(name, 0) + n\nend\nadd(scores, \"Ada\", 1)\nadd(scores, \"Ada\", 2)\nputs scores[\"Ada\"]", "3"),
      s("拆命令", 'text = "add Ada 5"\ncmd, rest = text.split(" ", 2)\nputs cmd\nputs rest', "add"),
    ],
    mistakes: [
      "在计分方法里直接 gets，测试必须模拟整段输入。",
      "用 split 不限制次数，名字被切碎。",
      "未知命令抛到顶层，用户打错一个字整次运行失败。",
    ],
    practices: [
      "规则写成接收哈希和字符串的方法。",
      "空行先 strip 再决定是否跳过。",
      "只打印要核对的数字或固定短词。",
    ],
    summary: "记分是一次运行内的哈希加一组纯方法。命令拆成两段，空行跳过，输出格式固定。下次运行分数不会还在。",
    exercises: [
      { title: "参考答案：两条", prompt: "直接把两个分数加进哈希，打印条目个数。", code: "scores = {}\nscores[\"A\"] = 1\nscores[\"B\"] = 2\nputs scores.length", expect: "2" },
      { title: "参考答案：相加", prompt: "从 0 开始给 Ada 加 4 再加 5，打印总分。", code: "scores = { \"Ada\" => 0 }\nscores[\"Ada\"] += 4\nscores[\"Ada\"] += 5\nputs scores[\"Ada\"]", expect: "9" },
    ],
    ...tail,
  },
];

export const pages = book("ruby", ["lxiy-ruby", "ruby-twenty", "poignant"], chapters);
