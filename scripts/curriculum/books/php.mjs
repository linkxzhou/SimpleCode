import { book } from "./rich.mjs";

const links = `- [PHP Manual](https://www.php.net/manual/en/)（CC BY 3.0，仅链接）
- [PHP: The Right Way](https://phptherightway.com/)（仅链接）`;
const credit = "正文为原创。知识点范围参考了 PHP 手册与 PHP: The Right Way，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：PHP 在这个抽屉里",
    goals: ["让文件以 <?php 开头", "用 echo 看见结果", "知道没有 curl 和数据库扩展"],
    prose: `PHP 在这里以命令方式执行，不是网页。每份示例都以 <?php 开头。点代码块上的 Run，这一份脚本在新进程里跑完。上一次的变量不会留下。

没有 curl、mysqli 和 gd。不要调用它们。常量 STDIN 没有定义，php://stdin 也打不开，所以可运行示例不读标准输入，而是处理已经放在字符串里的一行。echo 负责输出，需要换行时自己写 \\n。

期望是输出里的子串。警告和致命错误会出现在终端里，不要把它们写成成功示例的期望。第一次打开 PHP 要等运行时准备好。终端空白通常是因为没有 echo，而不是解释器没启动。短标签和 HTML 片段不要写进这些示例。脚本只做一次计算并把结果打出来，不要依赖浏览器、会话或上一次运行留下的变量。把期望写成短子串即可，不必抄下整段终端。`,
    samples: [
      s("只读", "<?php\n// 不要调用 curl、mysqli 或 gd。这里没有这些扩展。", "", { norun: true }),
      s("相加", "<?php\necho 19 + 23, \"\\n\";", "42"),
      s("问候", "<?php\necho \"你好\\n\";", "你好"),
    ],
    mistakes: [
      "文件不以 <?php 开头，后面的代码被当成普通文本。",
      "调用 curl 或数据库函数。",
      "echo 忘了换行。",
    ],
    practices: [
      "每个示例都是以 <?php 开头的完整脚本。",
      "要核对的值用 echo 打出并换行。",
      "做不到的事用只读块标出来。",
    ],
    summary: "PHP 101 的例子是一次新的命令行进程。文件以 <?php 开头，结果靠 echo。没有网络和数据库扩展。",
    exercises: [
      { title: "参考答案：语言名", prompt: "打印一行 PHP。", code: "<?php\necho \"PHP\\n\";", expect: "PHP" },
      { title: "参考答案：乘积", prompt: "打印 6 和 7 的乘积。", code: "<?php\necho 6 * 7, \"\\n\";", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "echo",
    title: "echo",
    level: "beginner",
    goals: ["用 echo 打出文本和数字", "写出注释", "知道 echo 的多个参数连在一起"],
    prose: `echo 把参数送到标准输出，参数之间不加空格。echo "A", "B" 得到 AB。换行是字符串里的 \\n，不是 echo 自动添加的。

注释用 // 直到行尾，或用 /* */。注释不会出现在输出里。变量以 $ 开头。echo 一个变量时，它会被转成文本。

这一章的脚本都很短。每份仍然以 <?php 开头，并且最后有换行，方便和期望对照。改示例时只改引号里的字，再点工具栏的 Run。代码块上的 Run 会把你的修改盖掉。预测时把换行也算进去。若终端里多了一个空格，先看 echo 的参数是不是被你用逗号隔开后又自己加了空格。逗号不会插入空格。`,
    samples: [
      s("两行", "<?php\necho \"Ada\\n\";\necho \"Lovelace\\n\";", "Ada"),
      s("连在一起", "<?php\necho \"A\", \"B\", \"\\n\";", "AB"),
      s("注释", "<?php\necho \"可见\\n\";\n// 这一行不会出现\necho 2026, \"\\n\";", "可见"),
    ],
    mistakes: [
      "以为 echo 的多个参数会用空格隔开。",
      "把换行寄托在 echo 自己身上。",
      "注释写成了和代码相反的说明。",
    ],
    practices: [
      "一次需要的换行写进字符串。",
      "多个参数只在你确实想紧挨着时使用。",
      "数字和文本都可以 echo。",
    ],
    summary: "echo 原样拼接参数。换行要写 \\n。注释不会进入输出。",
    exercises: [
      { title: "参考答案：两行数字", prompt: "打印 1 和 2，各占一行。", code: "<?php\necho \"1\\n\";\necho \"2\\n\";", expect: "1" },
      { title: "参考答案：连写", prompt: "用一次 echo 打出 AB。", code: "<?php\necho \"A\", \"B\", \"\\n\";", expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "types",
    title: "类型",
    level: "beginner",
    goals: ["区分整数除法和浮点除法", "知道 0 和空字符串为假", "用 === 避免悄悄转换"],
    prose: `变量第一次赋值就诞生。20 / 6 在 PHP 里得到浮点数。要整数商用 intdiv(20, 6)，结果是 3。余数用 %。

条件里的假包括 false、0、0.0、空字符串、空数组和 null。这和 Ruby 不同，和 C 更接近。非空字符串 "0" 也是假，这是 PHP 特有的坑。本教程判断「有没有文本」时用 === "" 或 strlen，不把字符串丢进 if。

== 会转换类型，0 == "0" 为真。=== 同时比较类型。教学例子需要精确时用 ===。`,
    samples: [
      s("整除", "<?php\necho intdiv(20, 6), \"\\n\";\necho 20 % 6, \"\\n\";", "3"),
      s("零是假", "<?php\n$n = 0;\necho $n ? \"yes\" : \"no\", \"\\n\";", "no"),
      s("严格相等", "<?php\necho (0 === \"0\") ? \"yes\" : \"no\", \"\\n\";", "no"),
    ],
    mistakes: [
      "以为 20 / 6 的结果可以直接当整数个数。",
      "用 if ($name) 判断名字，\"0\" 会被当成没有。",
      "用 == 比较数字和字符串，类型不同也通过。",
    ],
    practices: [
      "要整数商时用 intdiv。",
      "精确比较用 ===。",
      "空字符串用 === \"\" 判断。",
    ],
    summary: "intdiv 才是整数除法。0、空字符串和 \"0\" 在条件里为假。=== 不转换类型。",
    exercises: [
      { title: "参考答案：商", prompt: "打印 17 除以 5 的整数商。", code: "<?php\necho intdiv(17, 5), \"\\n\";", expect: "3" },
      { title: "参考答案：不相等", prompt: "用 === 判断 1 和 \"1\"，不相等就打印 no。", code: "<?php\necho (1 === \"1\") ? \"yes\" : \"no\", \"\\n\";", expect: "no" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "strings",
    title: "字符串",
    level: "beginner",
    goals: ["拼接和双引号插值", "用 strlen 时记住字节", "去掉首尾空白"],
    prose: `字符串用 . 拼接。双引号里的 $变量 会被替换，单引号里不会。要在双引号里写字面 $，用反斜杠。

strlen 数字节。 "Ada" 是 3。"你好" 在 UTF-8 里是 6。这里不依赖 mbstring。讲中文长度时写明是字节，或者改用英文示例。

trim 去掉两端空白，rtrim 去掉右端。fgets 读到的换行要用 rtrim 去掉，否则它会躲在字符串里。str_replace 适合替换一个固定的字符。`,
    samples: [
      s("插值", "<?php\n$name = \"Ada\";\necho \"你好，{$name}\\n\";", "你好，Ada"),
      s("替换", "<?php\necho str_replace(\"-\", \"/\", \"2026-10-15\"), \"\\n\";", "2026/10/15"),
      s("字节", "<?php\necho strlen(\"Ada\"), \"\\n\";\necho strlen(\"你好\"), \"\\n\";", "3"),
    ],
    mistakes: [
      "在单引号里写 $name，以为会被替换。",
      "把 strlen(\"你好\") 当成 2。",
      "用 + 拼接字符串，数字会被相加。",
    ],
    practices: [
      "拼接用 . 。",
      "双引号才插值，复杂表达式写成 {$name}。",
      "中文长度要说明是字节。",
    ],
    summary: "双引号会替换变量，单引号不会。拼接用点号。strlen 按字节计数。",
    exercises: [
      { title: "参考答案：拼接", prompt: "把 A 和 B 拼成 AB 并打印。", code: "<?php\necho \"A\" . \"B\", \"\\n\";", expect: "AB" },
      { title: "参考答案：去掉空白", prompt: "打印去掉两端空格后的 Ada。", code: "<?php\necho trim(\"  Ada  \"), \"\\n\";", expect: "Ada" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "arrays",
    title: "数组",
    level: "intermediate",
    goals: ["用列表和键值两种数组", "用 foreach 遍历", "知道空数组为假"],
    prose: `PHP 的数组是有序映射。列表写成 [1, 2, 3]，下标从 0 开始。键值写成 [\"n\" => 2]。取缺失的键会警告，教学例子用 ?? 给默认值，避免警告打断输出。

foreach 遍历值，或同时遍历键和值。count 数元素。array_sum 把数字加起来。空数组在条件里为假，所以 if ($items) 不能区分「没这个变量」和「空列表」以外的更多情况；空列表会走进假分支。要明确数个数时用 count。

不要把数组 echo 出去。echo 数组会得到 Array 这个词，不是内容。打印某一个元素，或先 implode。`,
    samples: [
      s("求和", "<?php\necho array_sum([1, 2, 3, 4]), \"\\n\";", "10"),
      s("默认", "<?php\n$box = [\"a\" => 1];\necho $box[\"b\"] ?? 0, \"\\n\";", "0"),
      s("空数组", "<?php\n$items = [];\necho $items ? \"yes\" : \"no\", \"\\n\";", "no"),
    ],
    mistakes: [
      "读取不存在的键，终端里先出现警告。",
      "echo 整个数组，只看到 Array。",
      "用 if ($items) 表示「有元素」。空数组是假，但你可能想要 count。",
    ],
    practices: [
      "缺失键用 ??。",
      "只 echo 元素、个数或 implode 的结果。",
      "列表和关联数组不要在同一次下标里混用得自己也忘了。",
    ],
    summary: "数组是有序映射。?? 给缺失键默认值。空数组为假。不要 echo 整个数组。",
    exercises: [
      { title: "参考答案：个数", prompt: "打印 [1, 2, 3] 的元素个数。", code: "<?php\necho count([1, 2, 3]), \"\\n\";", expect: "3" },
      { title: "参考答案：取值", prompt: "从键 n 取出 42 并打印。", code: "<?php\n$box = [\"n\" => 42];\necho $box[\"n\"], \"\\n\";", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "control",
    title: "控制流",
    level: "intermediate",
    goals: ["用 if 和 else 分支", "用 foreach 和 for 循环", "写出能停下来的 while"],
    prose: `if、elseif、else 组成一条链。条件的假包括 0、空字符串、空数组和 null。更具体的条件写在前面。

foreach 遍历数组。for 适合下标。while 必须有变量靠近结束。死循环会占住运行。

只打印你要核对的结果。循环里的每一次都打印，期望就得包含每一行；能在循环外打印总和，就在外面打印。`,
    samples: [
      s("奇数和", "<?php\n$total = 0;\nforeach ([1, 2, 3, 4, 5] as $n) {\n  if ($n % 2 === 1) $total += $n;\n}\necho $total, \"\\n\";", "9"),
      s("数到三", "<?php\n$n = 0;\nwhile ($n < 3) $n += 1;\necho $n, \"\\n\";", "3"),
      s("跳过空", "<?php\n$n = 0;\nforeach ([\"Ada\", \"\", \"Grace\"] as $name) {\n  if ($name === \"\") continue;\n  $n += 1;\n}\necho $n, \"\\n\";", "2"),
    ],
    mistakes: [
      "while 里不改变条件。",
      "用 == 比较类型不同的值，分支意外成立。",
      "在循环里 echo 调试文字，把期望淹没。",
    ],
    practices: [
      "知道元素时用 foreach。",
      "空字符串用 === \"\"。",
      "循环外打印一个总数。",
    ],
    summary: "分支把 0 和空字符串当假。foreach 遍历数组。while 必须靠近结束。",
    exercises: [
      { title: "参考答案：一到四", prompt: "把 1 到 4 加起来并打印。", code: "<?php\n$total = 0;\nfor ($n = 1; $n <= 4; $n++) $total += $n;\necho $total, \"\\n\";", expect: "10" },
      { title: "参考答案：非空", prompt: "数出非空字符串的个数。", code: "<?php\n$n = 0;\nforeach ([\"a\", \"\"] as $s) if ($s !== \"\") $n++;\necho $n, \"\\n\";", expect: "1" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "functions",
    title: "函数",
    level: "intermediate",
    goals: ["定义带参数的函数", "用返回值而不是依赖 echo", "给参数一个默认值"],
    prose: `function 定义函数。参数按位置传入，也可以写默认值。默认值在没传那个参数时使用。return 交回结果，但不会自动打印。main 这一层就是脚本本身，调用后 echo。

函数里给参数赋值，不会改调用者的变量，除非参数是对象并且你改的是对象里面的字段。这一章的函数只接收数字和字符串，用 return 交回新值。

函数名用小写字母和下划线，和示例里的变量一样好读。写完用一个具体的数调用一次。`,
    samples: [
      s("默认参数", "<?php\nfunction add($a, $b = 1) { return $a + $b; }\necho add(41), \"\\n\";", "42"),
      s("两倍", "<?php\nfunction twice($n) { return $n * 2; }\necho twice(21), \"\\n\";", "42"),
      s("奇数和", "<?php\nfunction odd_sum($nums) {\n  $total = 0;\n  foreach ($nums as $n) if ($n % 2 === 1) $total += $n;\n  return $total;\n}\necho odd_sum([1, 2, 3, 4, 5]), \"\\n\";", "9"),
    ],
    mistakes: [
      "以为 return 的值会自己出现在终端。",
      "默认参数写成会变的数组并在函数里修改，多次调用共享那一份。",
      "函数里 echo，调用者又 echo 返回值，输出重复。",
    ],
    practices: [
      "计算函数只 return，由调用者 echo。",
      "默认值用数字或字符串。",
      "用一个具体参数调用并打印。",
    ],
    summary: "函数用 return 交回结果，echo 留在调用处。默认参数在省略时启用。",
    exercises: [
      { title: "参考答案：平方", prompt: "写函数返回平方，打印 6 的平方。", code: "<?php\nfunction sq($n) { return $n * $n; }\necho sq(6), \"\\n\";", expect: "36" },
      { title: "参考答案：较大", prompt: "返回两个数里较大的一个并打印。", code: "<?php\nfunction larger($a, $b) { return $a > $b ? $a : $b; }\necho larger(3, 9), \"\\n\";", expect: "9" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "classes",
    title: "类",
    level: "intermediate",
    goals: ["用构造函数保存每个对象的数据", "区分 $this 和类本身", "不把每个对象的数据放进静态属性"],
    prose: `class 把数据和方法放在一起。构造函数 __construct 在 new 时运行。$this->字段 是这个对象自己的数据。方法里不写 $this 就访问不到字段。

静态属性属于类，所有对象共享。不要用它保存「这个人的分数」，否则后创建的对象会看见前一个留下的数。每个对象的数据放在普通属性里。

打印时 echo 方法的返回值。对象本身不会自动变成你想要的句子。`,
    samples: [
      s("加一", "<?php\nclass Num {\n  private $n;\n  public function __construct($n) { $this->n = $n; }\n  public function next() { return $this->n + 1; }\n}\necho (new Num(41))->next(), \"\\n\";", "42"),
      s("名字", "<?php\nclass Unit {\n  private $name;\n  public function __construct($name) { $this->name = $name; }\n  public function name() { return $this->name; }\n}\necho (new Unit(\"m\"))->name(), \"\\n\";", "m"),
      s("两倍", "<?php\nclass Line {\n  private $width;\n  public function __construct($width) { $this->width = $width; }\n  public function span() { return $this->width * 2; }\n}\necho (new Line(5))->span(), \"\\n\";", "10"),
    ],
    mistakes: [
      "方法里把 $this->n 写成 $n，读到的是另一个变量。",
      "用静态属性保存每个对象自己的数据。",
      "echo 对象本身。",
    ],
    practices: [
      "字段在构造函数里赋值。",
      "通过方法读取，而不是把字段设成随便都能改。",
      "echo 方法返回的数字或字符串。",
    ],
    summary: "对象的数据在 $this 上。构造函数负责赋值。静态属性是共享的，不要拿来当个别对象的状态。",
    exercises: [
      { title: "参考答案：两倍值", prompt: "类保存一个数，方法返回两倍。打印初值 21 的结果。", code: "<?php\nclass Num {\n  private $n;\n  public function __construct($n) { $this->n = $n; }\n  public function twice() { return $this->n * 2; }\n}\necho (new Num(21))->twice(), \"\\n\";", expect: "42" },
      { title: "参考答案：标签", prompt: "类保存 Ada 并打印。", code: "<?php\nclass Tag {\n  private $s;\n  public function __construct($s) { $this->s = $s; }\n  public function get() { return $this->s; }\n}\necho (new Tag(\"Ada\"))->get(), \"\\n\";", expect: "Ada" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "errors",
    title: "错误",
    level: "advanced",
    goals: ["用 try 和 catch 接住 Exception", "能用 if 判断的情况不用异常", "失败时打印固定的词"],
    prose: `throw new Exception 抛出异常，try 围住可能失败的代码，catch (Exception $e) 接住。接住之后打印「失败」，不要把消息全文写进期望，消息可能带文件路径。

除数是不是零可以先用 if 判断。解析这种「看完才知道」的失败才适合抛出。能用 if 写清楚的分支，不必绕进 try。

不要写空的 catch。接住却不打印、不返回，调用者会以为成功了。`,
    samples: [
      s("接住", "<?php\ntry {\n  throw new Exception(\"x\");\n  echo \"ok\\n\";\n} catch (Exception $e) {\n  echo \"失败\\n\";\n}", "失败"),
      s("除零", "<?php\nfunction div_checked($a, $b) {\n  if ($b === 0) throw new Exception(\"zero\");\n  return intdiv($a, $b);\n}\ntry {\n  echo div_checked(1, 0), \"\\n\";\n} catch (Exception $e) {\n  echo \"失败\\n\";\n}", "失败"),
      s("成功", "<?php\nfunction div_checked($a, $b) {\n  if ($b === 0) throw new Exception(\"zero\");\n  return intdiv($a, $b);\n}\necho div_checked(20, 6), \"\\n\";", "3"),
    ],
    mistakes: [
      "空的 catch，失败被吃掉。",
      "靠异常消息全文做分支。",
      "除零这种能先判断的情况只靠 throw。",
    ],
    practices: [
      "catch 里打印固定短词。",
      "能 if 判断的先 if。",
      "成功路径 echo 数字。",
    ],
    summary: "异常按 Exception 接住。失败打印固定的词。能提前判断的情况仍用 if。",
    exercises: [
      { title: "参考答案：失败", prompt: "抛出异常并打印失败。", code: "<?php\ntry {\n  throw new Exception(\"no\");\n} catch (Exception $e) {\n  echo \"失败\\n\";\n}", expect: "失败" },
      { title: "参考答案：商", prompt: "在除数非零时打印 17 和 5 的整数商。", code: "<?php\necho intdiv(17, 5), \"\\n\";", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "stdin",
    title: "标准输入",
    level: "advanced",
    goals: ["知道这里读不到标准输入", "用 rtrim 去掉一行末尾的换行", "把空行当成失败"],
    prose: `这份 php -q 没有常量 STDIN，fopen(\"php://stdin\") 和 php://fd/0 都打不开，php://input 也拿不到运行时送进标准输入的那一行。可运行示例因此不调用 fgets。只读块里留着不能用的写法，避免你照着别的教程抄进来。

一行文本在这里就是一个字符串，末尾可能带着换行。处理之前用 rtrim 去掉。去掉之后如果是空字符串，打印「失败」，不要把空行当成数字 0。看起来像整数时再用 intval。

这样你练的是「拿到一行之后怎么处理」。真正从键盘读，要等运行时把标准输入接进 PHP，现在还没有。`,
    samples: [
      s("只读", "<?php\n// fgets(STDIN) 会报 Undefined constant STDIN。\n// fopen(\"php://stdin\") 返回 false，不能交给 fgets。", "", { norun: true }),
      s("去掉换行", "<?php\n$line = \"Ada\\n\";\necho rtrim($line), \"\\n\";", "Ada"),
      s("加一", "<?php\n$line = rtrim(\"41\\n\");\nif ($line === \"\") echo \"失败\\n\";\nelse echo intval($line) + 1, \"\\n\";", "42"),
      s("空行", "<?php\n$line = rtrim(\"\\n\");\nif ($line === \"\") echo \"失败\\n\";\nelse echo $line, \"\\n\";", "失败"),
    ],
    mistakes: [
      "写 fgets(STDIN) 或 fopen(\"php://stdin\")。这里都会失败。",
      "不 rtrim，换行留在字符串里。",
      "把空行 intval 成 0，还当成用户输入了数字。",
    ],
    practices: [
      "先在字符串上把行处理写对。",
      "空字符串打印固定的「失败」。",
      "不依赖网页超全局。",
    ],
    summary: "这份 PHP 读不到标准输入。示例把一行放在字符串里，用 rtrim 去掉换行，空行算失败。",
    exercises: [
      { title: "参考答案：原文", prompt: "去掉字符串 SQL 末尾的换行并打印。", code: "<?php\necho rtrim(\"SQL\\n\"), \"\\n\";", expect: "SQL" },
      { title: "参考答案：两倍", prompt: "把带换行的 21 转成整数并打印两倍。", code: "<?php\necho intval(rtrim(\"21\\n\")) * 2, \"\\n\";", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "builtin",
    title: "常用内置函数",
    level: "advanced",
    goals: ["用 count、array_sum、implode", "用 explode 拆开一行", "用 in_array 查找"],
    prose: `这一章只留下不需要扩展的函数。count 数元素，array_sum 加数字，implode 用分隔符把数组收成一行文本。explode 按分隔符拆开，第三个参数可以限制段数，名字里的空格才能留下。

in_array 默认用 ==。需要精确类型时把第三个参数设为 true，也就是严格比较。找不到时它返回 false。

这些函数不访问网络。字符串函数用 strlen、trim、str_replace，前面已经见过，这里用来组合。`,
    samples: [
      s("收成一行", "<?php\necho implode(\",\", [\"a\", \"b\"]), \"\\n\";", "a,b"),
      s("限制拆分", "<?php\n$parts = explode(\" \", \"add Ada Lovelace\", 2);\necho $parts[0], \"\\n\";\necho $parts[1], \"\\n\";", "add"),
      s("有没有", "<?php\necho in_array(2, [1, 2, 3], true) ? \"yes\" : \"no\", \"\\n\";", "yes"),
    ],
    mistakes: [
      "explode 不限制段数，名字被切碎。",
      "in_array 不写严格比较，0 和 \"0\" 被当成同一个。",
      "implode 的参数顺序写成先数组后分隔符的旧习惯，在新版本里会出问题。先写分隔符。",
    ],
    practices: [
      "命令拆成两段时给 explode 上限 2。",
      "数字查找用严格的 in_array。",
      "implode 先写分隔符。",
    ],
    summary: "count、array_sum、implode、explode 和 in_array 覆盖列表上的常见操作。拆分命令时限制段数。",
    exercises: [
      { title: "参考答案：和", prompt: "打印 [1, 2, 3, 4] 的和。", code: "<?php\necho array_sum([1, 2, 3, 4]), \"\\n\";", expect: "10" },
      { title: "参考答案：连接", prompt: "用逗号连接 a 和 b。", code: "<?php\necho implode(\",\", [\"a\", \"b\"]), \"\\n\";", expect: "a,b" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "command",
    title: "命令小项目",
    level: "advanced",
    goals: ["用数组保存名字到分数", "把一行拆成命令和其余部分", "跳过空行"],
    prose: `小项目在一次运行里用关联数组保存分数。没有网络，也不写文件。下次运行分数是空的。规则写成函数：给一个名字加上一个数，或读出总分。

命令文本用 explode 限制成两段。第一段是命令，第二段再拆出名字和数字。空行跳过。未知命令打印「失败」，不用未捕获的异常终止整份脚本。

示例可以直接调用函数，也可以从一行文本出发。输出只打一个数字或固定的词。`,
    samples: [
      s("总分", "<?php\nfunction add_score(&$scores, $name, $n) {\n  $scores[$name] = ($scores[$name] ?? 0) + $n;\n}\n$scores = [];\nadd_score($scores, \"Ada\", 1);\nadd_score($scores, \"Ada\", 2);\necho $scores[\"Ada\"], \"\\n\";", "3"),
      s("跳过空行", "<?php\n$n = 0;\nforeach ([\"add Ada 1\", \"\", \"add Ada 2\"] as $line) {\n  if (trim($line) === \"\") continue;\n  $n++;\n}\necho $n, \"\\n\";", "2"),
      s("拆命令", "<?php\n$parts = explode(\" \", \"add Ada 5\", 2);\necho $parts[0], \"\\n\";", "add"),
    ],
    mistakes: [
      "分数存在静态属性里，测试之间互相看见。这里每次运行虽然是新进程，写法仍然不要共享。",
      "explode 不限次数，名字被切开。",
      "未知命令抛到顶层，整次运行失败。",
    ],
    practices: [
      "分数放在函数收到的数组里。",
      "空行先 trim。",
      "只打印总分或固定短词。",
    ],
    summary: "命令小项目是一次运行内的关联数组。命令拆成两段，空行跳过。下次运行分数不会还在。",
    exercises: [
      { title: "参考答案：两条", prompt: "放入两个名字，打印键的个数。", code: "<?php\n$scores = [\"A\" => 1, \"B\" => 2];\necho count($scores), \"\\n\";", expect: "2" },
      { title: "参考答案：相加", prompt: "Ada 从 0 加 4 再加 5，打印总分。", code: "<?php\n$scores = [\"Ada\" => 0];\n$scores[\"Ada\"] += 4;\n$scores[\"Ada\"] += 5;\necho $scores[\"Ada\"], \"\\n\";", expect: "9" },
    ],
    ...tail,
  },
];

export const pages = book("php", ["php-manual", "php-right-way"], chapters);
