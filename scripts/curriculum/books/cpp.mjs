import { book } from "./rich.mjs";

const links = `- [LearnCpp](https://www.learncpp.com/)（仅链接）
- [C++ Core Guidelines](https://github.com/isocpp/CppCoreGuidelines)（仅链接）
- [cppreference](https://en.cppreference.com/)（CC BY-SA 3.0，仅链接）`;
const credit = "正文为原创。知识点范围参考了 LearnCpp、C++ Core Guidelines 与 cppreference，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：C++ 在这个抽屉里",
    goals: ["用 cout 看见结果", "知道警告会让编译失败", "把做不到的写法留在只读块"],
    prose: `C++ 在这里由 clang 配合 libc++ 编译成 wasm 再运行。点代码块上的 Run，编辑器里的单文件会经过编译和链接。警告当成错误。未使用的变量会让这次运行失败。

每次运行都是新进程。没有线程，没有文件系统库，也没有第二份源文件。iostream、string、vector 和 algorithm 可以用。异常在这份工具链上不可靠，可运行示例用返回值表示失败，throw 只出现在只读块里。

期望是输出里的子串。编译失败时终端里是诊断，不是你想打印的那句话。`,
    samples: [
      s("只读", "/* 不要写 throw。这份 wasm 工具链上的异常不可靠。\n   也不要使用 thread 或 filesystem。 */", "", { norun: true }),
      s("相加", "#include <iostream>\nint main() {\n  std::cout << (19 + 23) << \"\\n\";\n  return 0;\n}", "42"),
      s("问候", "#include <iostream>\nint main() {\n  std::cout << \"你好\\n\";\n  return 0;\n}", "你好"),
    ],
    mistakes: [
      "在可运行示例里 throw，或包含 thread、filesystem。",
      "留下未使用的变量。",
      "忘了换行，下一行结果粘在一起。",
    ],
    practices: [
      "每个示例都是一份能单独编译的完整程序。",
      "失败用返回值表示。",
      "要核对的文字用 cout 打出来。",
    ],
    summary: "C++ 101 的例子经 clang 和 libc++ 编译后运行。结果靠 cout。异常不放进可运行示例。",
    exercises: [
      { title: "参考答案：语言名", prompt: "打印一行 C++。", code: "#include <iostream>\nint main() {\n  std::cout << \"C++\\n\";\n  return 0;\n}", expect: "C++" },
      { title: "参考答案：乘积", prompt: "打印 6 和 7 的乘积。", code: "#include <iostream>\nint main() {\n  std::cout << (6 * 7) << \"\\n\";\n  return 0;\n}", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "cout",
    title: "cout",
    level: "beginner",
    goals: ["用 cout 打出文本和数字", "写出注释", "让 main 返回 0"],
    prose: `程序从 main 进入。返回 0 表示按我们的约定成功。std::cout 用 << 把值送出去。数字和字符串都可以送。换行写成 "\\n"，不要依赖刷新去制造换行。

注释用 // 直到行尾，或用 /* */。注释不会出现在输出里。名字都写 std:: 前缀，避免 using 把后来的名字悄悄引进来。

一次只核对一行时，让这一行以换行结束。需要接在同一行时，前一次不要写换行。`,
    samples: [
      s("两行", "#include <iostream>\nint main() {\n  std::cout << \"Ada\\n\";\n  std::cout << \"Lovelace\\n\";\n  return 0;\n}", "Ada"),
      s("同一行", "#include <iostream>\nint main() {\n  std::cout << \"A\";\n  std::cout << \"B\\n\";\n  return 0;\n}", "AB"),
      s("注释", "#include <iostream>\nint main() {\n  std::cout << \"可见\\n\";\n  // 这一行不会出现\n  std::cout << 2026 << \"\\n\";\n  return 0;\n}", "可见"),
    ],
    mistakes: [
      "把 << 写成 >>。",
      "注释写了和代码相反的说明。",
      "用 endl 的刷新代替你真正想要的换行，读代码时看不清。",
    ],
    practices: [
      "换行用 \"\\n\"。",
      "名字加上 std::。",
      "main 返回 0。",
    ],
    summary: "cout 用 << 输出。换行写在字符串里。注释不会进入终端。",
    exercises: [
      { title: "参考答案：两行数字", prompt: "打印 1 和 2，各占一行。", code: "#include <iostream>\nint main() {\n  std::cout << 1 << \"\\n\";\n  std::cout << 2 << \"\\n\";\n  return 0;\n}", expect: "1" },
      { title: "参考答案：连在一起", prompt: "打印 AB。", code: "#include <iostream>\nint main() {\n  std::cout << \"A\" << \"B\\n\";\n  return 0;\n}", expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "types",
    title: "类型与引用",
    level: "beginner",
    goals: ["区分整数除法和余数", "用引用给对象起另一个名字", "知道 0 在条件里为假"],
    prose: `整数相除仍是整数。20 / 6 得到 3，余数用 %。变量要声明并使用，否则编译失败。

引用是对象的另一个名字。int &r = n 之后，改 r 就是改 n。引用必须在诞生时绑定，不能改去绑另一个对象。要修改调用者的变量时，引用比指针少写一个星号。

条件里 0 是假，其余数字是真。这和 Ruby 不同。bool 的 false 也是假。`,
    samples: [
      s("整除", "#include <iostream>\nint main() {\n  std::cout << (20 / 6) << \"\\n\";\n  std::cout << (20 % 6) << \"\\n\";\n  return 0;\n}", "3"),
      s("引用", "#include <iostream>\nint main() {\n  int n = 41;\n  int &r = n;\n  r += 1;\n  std::cout << n << \"\\n\";\n  return 0;\n}", "42"),
      s("零是假", "#include <iostream>\nint main() {\n  int n = 0;\n  std::cout << (n ? \"yes\" : \"no\") << \"\\n\";\n  return 0;\n}", "no"),
    ],
    mistakes: [
      "以为 20 / 6 得到小数。",
      "引用没有一开始就绑定。",
      "把 0 当成真。",
    ],
    practices: [
      "要改同一个对象时用引用。",
      "整数运算先确认两边的类型。",
      "每个变量都参与输出或运算。",
    ],
    summary: "整数相除丢掉小数。引用是对象的别名。0 在条件里为假。",
    exercises: [
      { title: "参考答案：商", prompt: "打印 17 除以 5 的整数商。", code: "#include <iostream>\nint main() {\n  std::cout << (17 / 5) << \"\\n\";\n  return 0;\n}", expect: "3" },
      { title: "参考答案：加一", prompt: "用引用把 6 加一后打印。", code: "#include <iostream>\nint main() {\n  int n = 6;\n  int &r = n;\n  r += 1;\n  std::cout << n << \"\\n\";\n  return 0;\n}", expect: "7" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "control",
    title: "控制流",
    level: "beginner",
    goals: ["用 if 和 else 分支", "用 for 做有限次数", "写出能停下来的循环"],
    prose: `if 在条件为假时走 else。比较用 ==。写成 = 是赋值，值若为 0 就总走另一支。

范围 for 可以遍历 vector，这一章先用经典 for，次数写在循环头上。while 也要有一个变量靠近结束。说不出来就先别运行。

累加之前把总和设为 0。分支只打印你要核对的词，避免两支都打印让期望对不上。`,
    samples: [
      s("奇数和", "#include <iostream>\nint main() {\n  int total = 0;\n  for (int n = 1; n <= 5; n++) {\n    if (n % 2 == 1) total += n;\n  }\n  std::cout << total << \"\\n\";\n  return 0;\n}", "9"),
      s("数到三", "#include <iostream>\nint main() {\n  int n = 0;\n  while (n < 3) n += 1;\n  std::cout << n << \"\\n\";\n  return 0;\n}", "3"),
      s("较大", "#include <iostream>\nint main() {\n  int a = 3;\n  int b = 9;\n  std::cout << (a > b ? a : b) << \"\\n\";\n  return 0;\n}", "9"),
    ],
    mistakes: [
      "把 == 写成 =。",
      "循环不改变条件。",
      "总和没有初始化。",
    ],
    practices: [
      "次数清楚时用 for。",
      "比较写成 ==。",
      "每条路径的输出都是你能预测的短词或数字。",
    ],
    summary: "分支看条件的真假，0 为假。循环必须靠近结束。比较不要写成赋值。",
    exercises: [
      { title: "参考答案：一到四", prompt: "把 1 到 4 加起来并打印。", code: "#include <iostream>\nint main() {\n  int total = 0;\n  for (int n = 1; n <= 4; n++) total += n;\n  std::cout << total << \"\\n\";\n  return 0;\n}", expect: "10" },
      { title: "参考答案：三次", prompt: "从 0 加三次并打印。", code: "#include <iostream>\nint main() {\n  int n = 0;\n  for (int i = 0; i < 3; i++) n += 1;\n  std::cout << n << \"\\n\";\n  return 0;\n}", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "functions",
    title: "函数",
    level: "intermediate",
    goals: ["用参数和返回值", "用引用参数修改调用者", "在调用前写好定义"],
    prose: `函数把计算命名。按值传递时，函数里的赋值不影响调用者。引用参数是调用者对象的别名，函数里的修改会留下。

被调用的函数写在 main 上面。返回值不会自己出现在终端，main 里要用 cout 打出来。

一个函数只做一件事。需要同时给出「是否成功」和「结果」时，这一章仍返回结果，失败留到后面的返回值约定。`,
    samples: [
      s("相加", "#include <iostream>\nint add(int a, int b) { return a + b; }\nint main() {\n  std::cout << add(41, 1) << \"\\n\";\n  return 0;\n}", "42"),
      s("引用参数", "#include <iostream>\nvoid inc(int &n) { n += 1; }\nint main() {\n  int n = 41;\n  inc(n);\n  std::cout << n << \"\\n\";\n  return 0;\n}", "42"),
      s("两倍", "#include <iostream>\nint twice(int n) { return n * 2; }\nint main() {\n  std::cout << twice(21) << \"\\n\";\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "想修改调用者却按值传递。",
      "返回值没有打印。",
      "在定义之前调用，又没有声明。",
    ],
    practices: [
      "只读参数按值，要改的参数用引用。",
      "函数定义放在 main 前。",
      "cout 打印返回值。",
    ],
    summary: "返回值交回结果，引用参数修改调用者。终端只看见 cout。",
    exercises: [
      { title: "参考答案：平方", prompt: "写函数返回平方，打印 6 的平方。", code: "#include <iostream>\nint sq(int n) { return n * n; }\nint main() {\n  std::cout << sq(6) << \"\\n\";\n  return 0;\n}", expect: "36" },
      { title: "参考答案：加二", prompt: "用引用参数把 5 加 2 后打印。", code: "#include <iostream>\nvoid add2(int &n) { n += 2; }\nint main() {\n  int n = 5;\n  add2(n);\n  std::cout << n << \"\\n\";\n  return 0;\n}", expect: "7" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "vector",
    title: "vector 与 string",
    level: "intermediate",
    goals: ["用 vector 保存一组数", "用 string 的 size 和 substr", "记住 size 对中文数的是字节"],
    prose: `std::vector 记住元素个数。下标从 0 开始，size() 是个数。范围 for 用 int n : a 读取每个元素。往末尾加用 push_back。

std::string 保存字符序列。substr(起, 长度) 的第二个数是长度，不是结束下标。size() 数的是 char 的个数，也就是字节。 "Ada" 是 3。"你好" 是 6。不要把 size 理解成你看到的字数。

字符串用 + 拼接。数字不会自动变成文本后拼接，需要时先放进 string 或直接 cout 数字。`,
    samples: [
      s("求和", "#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{1, 2, 3, 4};\n  int total = 0;\n  for (int n : a) total += n;\n  std::cout << total << \"\\n\";\n  return 0;\n}", "10"),
      s("前四个", "#include <iostream>\n#include <string>\nint main() {\n  std::string s = \"SimpleCode\";\n  std::cout << s.substr(0, 4) << \"\\n\";\n  return 0;\n}", "Simp"),
      s("字节数", "#include <iostream>\n#include <string>\nint main() {\n  std::string s = \"你好\";\n  std::cout << s.size() << \"\\n\";\n  return 0;\n}", "6"),
    ],
    mistakes: [
      "把 substr 的第二个参数当成结束下标。",
      "把 string 的 size 当成中文字数。",
      "下标越过 size。",
    ],
    practices: [
      "遍历用范围 for，需要下标时再写经典 for。",
      "切片先记住长度，不是结束位置。",
      "讲中文长度时写明是字节。",
    ],
    summary: "vector 知道自己的个数。string 的 substr 第二个参数是长度，size 按字节计。",
    exercises: [
      { title: "参考答案：三个", prompt: "求 {3, 1, 2} 的最小元素并打印。", code: "#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{3, 1, 2};\n  int m = a[0];\n  for (int n : a) if (n < m) m = n;\n  std::cout << m << \"\\n\";\n  return 0;\n}", expect: "1" },
      { title: "参考答案：拼接", prompt: "把 A 和 B 拼成 AB 并打印。", code: "#include <iostream>\n#include <string>\nint main() {\n  std::string s = std::string(\"A\") + \"B\";\n  std::cout << s << \"\\n\";\n  return 0;\n}", expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "classes",
    title: "类",
    level: "intermediate",
    goals: ["用构造函数保存每个对象的数据", "区分类里的成员函数", "不把每个对象的数据放进全局变量"],
    prose: `class 把数据和操作放在一起。构造函数在创建对象时运行，初始化列表把字段设好。成员函数通过对象调用，能读到这个对象的字段。

这一章不写继承的复杂层次。需要另一种行为时，写另一个函数或在成员函数里分支。字段放在类里，不要放进所有对象共享的全局变量，否则一个对象改了，另一个也看见。

打印时 cout 你关心的那个字段或成员函数的返回值。不要指望对象自己知道怎么打印，除非你写了那样的函数。`,
    samples: [
      s("两倍宽", "#include <iostream>\nclass Line {\n public:\n  Line(int width) : width_(width) {}\n  int span() const { return width_ * 2; }\n private:\n  int width_;\n};\nint main() {\n  Line line(5);\n  std::cout << line.span() << \"\\n\";\n  return 0;\n}", "10"),
      s("名字", "#include <iostream>\n#include <string>\nclass Unit {\n public:\n  Unit(std::string name) : name_(name) {}\n  const std::string &name() const { return name_; }\n private:\n  std::string name_;\n};\nint main() {\n  Unit u(\"m\");\n  std::cout << u.name() << \"\\n\";\n  return 0;\n}", "m"),
      s("加一", "#include <iostream>\nclass Num {\n public:\n  Num(int n) : n_(n) {}\n  int next() const { return n_ + 1; }\n private:\n  int n_;\n};\nint main() {\n  Num num(41);\n  std::cout << num.next() << \"\\n\";\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "把每个对象自己的数写成全局变量。",
      "构造函数忘记初始化字段。",
      "成员函数没有 const，只读也被标成会修改。",
    ],
    practices: [
      "字段在初始化列表里赋值。",
      "不修改对象的成员函数标成 const。",
      "每个对象的数据放在字段里。",
    ],
    summary: "类用构造函数和字段保存每个对象的数据。成员函数通过对象调用。不要用全局变量冒充字段。",
    exercises: [
      { title: "参考答案：两倍", prompt: "类保存一个数，成员函数返回两倍。打印初值 21 的结果。", code: "#include <iostream>\nclass Num {\n public:\n  Num(int n) : n_(n) {}\n  int twice() const { return n_ * 2; }\n private:\n  int n_;\n};\nint main() {\n  std::cout << Num(21).twice() << \"\\n\";\n  return 0;\n}", expect: "42" },
      { title: "参考答案：标签", prompt: "类保存字符串标签 Ada 并打印。", code: "#include <iostream>\n#include <string>\nclass Tag {\n public:\n  Tag(std::string s) : s_(s) {}\n  const std::string &get() const { return s_; }\n private:\n  std::string s_;\n};\nint main() {\n  Tag t(\"Ada\");\n  std::cout << t.get() << \"\\n\";\n  return 0;\n}", expect: "Ada" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "failure",
    title: "失败不用异常",
    level: "advanced",
    goals: ["用返回值表示失败", "成功时才读取输出参数", "不在可运行示例里 throw"],
    prose: `除以零、解析失败这些情况，用返回值告诉调用者。一种简单约定：函数返回 1 表示成功，返回 0 表示失败，结果经引用参数交回。失败时不要读取那个结果。

throw 留在只读块里。这份编译目标上的异常不可靠，可运行示例不依赖它。能事先判断的情况用 if，例如除数是不是 0。

打印时失败打出固定的词「失败」，成功打出数字。不要把编译器的诊断文本写进期望。`,
    samples: [
      s("只读", "/* throw 不放进可运行示例。\n   int n = 0;\n   throw n;\n*/", "", { norun: true }),
      s("除法", "#include <iostream>\nint divide(int a, int b, int &out) {\n  if (b == 0) return 0;\n  out = a / b;\n  return 1;\n}\nint main() {\n  int q = 0;\n  if (!divide(20, 6, q)) std::cout << \"失败\\n\";\n  else std::cout << q << \"\\n\";\n  return 0;\n}", "3"),
      s("除零", "#include <iostream>\nint divide(int a, int b, int &out) {\n  if (b == 0) return 0;\n  out = a / b;\n  return 1;\n}\nint main() {\n  int q = 0;\n  if (!divide(1, 0, q)) std::cout << \"失败\\n\";\n  else std::cout << q << \"\\n\";\n  return 0;\n}", "失败"),
      s("整除成功", "#include <iostream>\nint divide(int a, int b, int &out) {\n  if (b == 0) return 0;\n  out = a / b;\n  return 1;\n}\nint main() {\n  int q = 0;\n  if (!divide(42, 2, q)) std::cout << \"失败\\n\";\n  else std::cout << q << \"\\n\";\n  return 0;\n}", "21"),
    ],
    mistakes: [
      "失败了仍使用输出参数里的旧值。",
      "用 throw 表示除零。",
      "返回值的 0 和 1 没有在调用处分支。",
    ],
    practices: [
      "成功才读输出参数。",
      "失败打印固定短词。",
      "同一份约定贯穿调用处。",
    ],
    summary: "失败用返回值。成功才使用输出参数。throw 不进入可运行示例。",
    exercises: [
      { title: "参考答案：商", prompt: "用返回值约定计算 17/5 并打印。", code: "#include <iostream>\nint divide(int a, int b, int &out) {\n  if (b == 0) return 0;\n  out = a / b;\n  return 1;\n}\nint main() {\n  int q = 0;\n  if (!divide(17, 5, q)) return 1;\n  std::cout << q << \"\\n\";\n  return 0;\n}", expect: "3" },
      { title: "参考答案：失败", prompt: "除数为 0 时打印失败。", code: "#include <iostream>\nint divide(int a, int b, int &out) {\n  if (b == 0) return 0;\n  out = a / b;\n  return 1;\n}\nint main() {\n  int q = 0;\n  if (!divide(1, 0, q)) std::cout << \"失败\\n\";\n  return 0;\n}", expect: "失败" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "templates",
    title: "函数模板",
    level: "advanced",
    goals: ["用一个模板处理 int", "知道模板在调用时确定类型", "不把模板写成能接受任意不相关的类型还假装能加"],
    prose: `函数模板在调用时按参数生成具体函数。add<int> 或让编译器从参数推断。本教程的模板只做同一类型的相加或取较大者，两边类型一致。

模板写在调用之前。它不是运行时的多态。类型对不上时，编译失败，终端里是诊断。

能写成普通函数就不必上模板。模板适合「int 和别的算术类型写法一样」这一类重复。示例仍用 int，这样输出是稳定的数字。`,
    samples: [
      s("相加", "#include <iostream>\ntemplate <typename T>\nT add(T a, T b) { return a + b; }\nint main() {\n  std::cout << add(19, 23) << \"\\n\";\n  return 0;\n}", "42"),
      s("较大", "#include <iostream>\ntemplate <typename T>\nT larger(T a, T b) { return a > b ? a : b; }\nint main() {\n  std::cout << larger(3, 9) << \"\\n\";\n  return 0;\n}", "9"),
      s("两倍", "#include <iostream>\ntemplate <typename T>\nT twice(T n) { return n + n; }\nint main() {\n  std::cout << twice(21) << \"\\n\";\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "两边参数类型不同，推断失败还继续改运行逻辑。",
      "在模板里使用类型并不支持的操作。",
      "把模板当成运行时可以换类型的容器。",
    ],
    practices: [
      "调用时让两边类型相同。",
      "模板放在使用它的函数前面。",
      "先用 int 把行为核对清楚。",
    ],
    summary: "函数模板在编译时按类型生成函数。参数类型要能完成模板里的运算。示例用 int 核对数字。",
    exercises: [
      { title: "参考答案：积", prompt: "写模板返回两数之积，打印 6 和 7。", code: "#include <iostream>\ntemplate <typename T>\nT mul(T a, T b) { return a * b; }\nint main() {\n  std::cout << mul(6, 7) << \"\\n\";\n  return 0;\n}", expect: "42" },
      { title: "参考答案：较小", prompt: "写模板返回较小的数，打印 4 和 1 的结果。", code: "#include <iostream>\ntemplate <typename T>\nT smaller(T a, T b) { return a < b ? a : b; }\nint main() {\n  std::cout << smaller(4, 1) << \"\\n\";\n  return 0;\n}", expect: "1" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "algorithm",
    title: "algorithm",
    level: "advanced",
    goals: ["用 min_element 找最小", "用 count 数相等的元素", "用 count_if 数满足条件的元素"],
    prose: `algorithm 里的算法接收一段迭代器范围。vector 的 begin 和 end 表示整段。min_element 返回指向最小元素的迭代器，要先确认区间不是空的，再解引用。count 数某个值出现了几次，不改容器。

count_if 配一个函数或 lambda，数使条件为真的元素。lambda 写成 [](int n) { return n % 2 == 1; }。它也不改容器。

std::sort 会改原来的顺序，但这份 libc++ 在链接时缺少 __lttf2，可运行示例不用它。排序留在只读块里。要最小的元素时用 min_element，不要为了取最小去 sort。`,
    samples: [
      s("最小", "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{3, 1, 2};\n  auto it = std::min_element(a.begin(), a.end());\n  std::cout << *it << \"\\n\";\n  return 0;\n}", "1"),
      s("排序不可用", "/* std::sort 会把这段 libc++ 带进缺少 __lttf2 的链接。\n   可运行示例改用 min_element 或 count。 */", "", { norun: true }),
      s("数二", "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{1, 2, 2, 3};\n  int n = std::count(a.begin(), a.end(), 2);\n  std::cout << n << \"\\n\";\n  return 0;\n}", "2"),
      s("奇数个数", "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{1, 2, 3, 4, 5};\n  int n = std::count_if(a.begin(), a.end(), [](int x) { return x % 2 == 1; });\n  std::cout << n << \"\\n\";\n  return 0;\n}", "3"),
    ],
    mistakes: [
      "对空 vector 解引用 min_element 的结果。",
      "在这份环境里调用 std::sort，链接失败。",
      "count_if 的条件写反。",
    ],
    practices: [
      "用算法前确认区间非空，或自己处理空。",
      "要最小元素用 min_element，不调用 std::sort。",
      "条件写成看得到的 lambda。",
    ],
    summary: "algorithm 作用在一段范围上。min_element、count 和 count_if 不改容器。std::sort 在这里链接不过，不要放进可运行示例。",
    exercises: [
      { title: "参考答案：最大", prompt: "用 max_element 打印 {1, 4, 2} 的最大元素。", code: "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{1, 4, 2};\n  auto it = std::max_element(a.begin(), a.end());\n  std::cout << *it << \"\\n\";\n  return 0;\n}", expect: "4" },
      { title: "参考答案：偶数", prompt: "数出 {1, 2, 3, 4} 里的偶数个数。", code: "#include <algorithm>\n#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> a{1, 2, 3, 4};\n  int n = std::count_if(a.begin(), a.end(), [](int x) { return x % 2 == 0; });\n  std::cout << n << \"\\n\";\n  return 0;\n}", expect: "2" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "line",
    title: "读入一行",
    level: "advanced",
    goals: ["用 getline 读入一行", "失败时不要使用空字符串当成功", "从一行里取出整数"],
    prose: `std::getline 把一行读进 string，不包含换行。失败时返回的流为假，不要把空字符串当成用户输入。文档示例带上标准输入。你自己在终端跑，就要亲手输入。

读到的文本如果应当是整数，再转换成数。本教程用一个很小的循环或字符串流。为了少引入失败方式，示例优先打印读到的整行，或在知道它是数字时用 std::stoi。stoi 在无法转换时会抛异常，所以只对确定是数字的输入使用，无法确定时先检查每个字符。

检查写法：空行不算数；有字符且都是数字时再 stoi。这样不会走到抛异常的路径。`,
    samples: [
      s("整行", "#include <iostream>\n#include <string>\nint main() {\n  std::string line;\n  if (!std::getline(std::cin, line)) return 1;\n  std::cout << line << \"\\n\";\n  return 0;\n}", "Ada", { stdin: "Ada\n" }),
      s("加一", "#include <iostream>\n#include <string>\nint main() {\n  std::string line;\n  if (!std::getline(std::cin, line)) return 1;\n  int n = std::stoi(line);\n  std::cout << (n + 1) << \"\\n\";\n  return 0;\n}", "42", { stdin: "41\n" }),
      s("空行", "#include <iostream>\n#include <string>\nint main() {\n  std::string line;\n  if (!std::getline(std::cin, line) || line.empty()) std::cout << \"失败\\n\";\n  else std::cout << line << \"\\n\";\n  return 0;\n}", "失败", { stdin: "\n" }),
    ],
    mistakes: [
      "不看 getline 是否成功。",
      "对不确定的文本调用 stoi，走到异常。",
      "把换行留在比较里，和期望对不上。getline 已经去掉换行。",
    ],
    practices: [
      "getline 失败或空行时打印固定短词。",
      "只有确认是整数时才 stoi。",
      "示例写上 stdin。",
    ],
    summary: "getline 读入一行且不含换行。失败和空行要单独处理。stoi 只用于确定的数字文本。",
    exercises: [
      { title: "参考答案：原文", prompt: "读入一行并打印。输入是 SQL。", code: "#include <iostream>\n#include <string>\nint main() {\n  std::string line;\n  if (!std::getline(std::cin, line)) return 1;\n  std::cout << line << \"\\n\";\n  return 0;\n}", expect: "SQL", stdin: "SQL\n" },
      { title: "参考答案：两倍", prompt: "读入整数并打印两倍。输入是 21。", code: "#include <iostream>\n#include <string>\nint main() {\n  std::string line;\n  if (!std::getline(std::cin, line)) return 1;\n  std::cout << (std::stoi(line) * 2) << \"\\n\";\n  return 0;\n}", expect: "42", stdin: "21\n" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "todo",
    title: "待办小项目",
    level: "advanced",
    goals: ["用 vector 保存待办文本", "跳过空行", "打印条数和其中一条"],
    prose: `待办列表是一次运行里的 vector<string>。没有网络，也不写文件。下次运行列表是空的。规则用函数表达：一行是不是空的、要不要加进去。

示例不从键盘读全部命令，而是直接把几条字符串放进 vector，这样核心逻辑不依赖输入顺序。需要演示读入时，单独用 getline 读一条再放进 vector。

输出只打条数，或打出指定下标的那一条。下标先和 size 比较，越界就打印「失败」。`,
    samples: [
      s("两条", "#include <iostream>\n#include <string>\n#include <vector>\nint main() {\n  std::vector<std::string> items{\"买笔\", \"\"};\n  int n = 0;\n  for (const std::string &s : items) if (!s.empty()) n++;\n  std::cout << n << \"\\n\";\n  return 0;\n}", "1"),
      s("第一条", "#include <iostream>\n#include <string>\n#include <vector>\nint main() {\n  std::vector<std::string> items{\"买笔\", \"写信\"};\n  std::cout << items[0] << \"\\n\";\n  return 0;\n}", "买笔"),
      s("读一条", "#include <iostream>\n#include <string>\n#include <vector>\nint main() {\n  std::vector<std::string> items;\n  std::string line;\n  if (!std::getline(std::cin, line) || line.empty()) {\n    std::cout << \"失败\\n\";\n    return 0;\n  }\n  items.push_back(line);\n  std::cout << items.size() << \"\\n\";\n  return 0;\n}", "1", { stdin: "买笔\n" }),
    ],
    mistakes: [
      "把空字符串也算成一条待办。",
      "不检查下标就读取。",
      "以为列表会留到下一次运行。",
    ],
    practices: [
      "空行先排除再计数。",
      "只打印条数或一条文本。",
      "读入失败有固定输出。",
    ],
    summary: "待办是一次运行内的 vector。空行不算。输出是条数或某一条文本。下次运行不会还在。",
    exercises: [
      { title: "参考答案：条数", prompt: "两条非空待办，打印条数。", code: "#include <iostream>\n#include <string>\n#include <vector>\nint main() {\n  std::vector<std::string> items{\"a\", \"b\"};\n  std::cout << items.size() << \"\\n\";\n  return 0;\n}", expect: "2" },
      { title: "参考答案：第二", prompt: "打印第二条待办。", code: "#include <iostream>\n#include <string>\n#include <vector>\nint main() {\n  std::vector<std::string> items{\"买笔\", \"写信\"};\n  std::cout << items[1] << \"\\n\";\n  return 0;\n}", expect: "写信" },
    ],
    ...tail,
  },
];

export const pages = book("cpp", ["learncpp", "cpp-core", "cppreference"], chapters);
