import { pack as basePack } from "./depth-lib.mjs";
import { extras } from "./depth-go-extra.mjs";

function pack(spec) {
  return basePack({ ...spec, extra: extras[spec.id] });
}

function go(title, body, expect) {
  const code = `package main\n\nimport "fmt"\n\nfunc main() {\n${body}\n}`;
  return { lang: "go", title, code, expect };
}

function full(title, code, expect) {
  return { lang: "go", title, code, expect };
}

const packs = {
  0: pack({
    id: "go-0",
    prose: `这里的 Go 由 Yaegi 0.16 解释执行，不是 go build。每个可运行示例都要有 package main 和 func main。标准库里解释器自带的包可以用，go get、cgo 和网络都不行。没有使用的 import 会报错，写完记得删掉试过又不用的包。

Run 会把整段程序放进编辑器再执行。编辑器里如果少了 package main，即使函数写对了也不会有入口。教程因此不展示「只贴一个函数」的片段，除非它被标成只读。

Yaegi 和官方编译器在反射、部分泛型、自定义 error 接口上会不一样。那些差异在对应章节里标成只读，能跑的例子都避开了已知的 panic。你在本地用 go 命令可以试更全的写法，这里以能跑为准。

输出用 fmt.Println 或 Printf。Println 会换行，Print 不会。期望子串通常取第一行有意义的结果。多打印一行标题往往仍能通过，但会让终端难读，示例保持短。`,
    samples: [
      go("相加", "\tfmt.Println(19 + 23)", "42"),
      go("两个词", '\tfmt.Println("Go", "101")', "Go 101"),
    ],
    practices: [
      "每个可运行示例都写完整的 package main。",
      "不用的 import 立刻删掉。",
      "和官方编译器行为不一致的写法标成只读，不放进自动测试。",
    ],
    summary: "Yaegi 解释完整的 main 包。没有 go get，未使用的导入会失败，和官方编译器有差异的主题改成只读。",
    exercise: {
      prompt: "打印 100 减 58。",
      title: "参考答案：减法",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println(100 - 58)\n}',
      expect: "42",
    },
  }),
  1: pack({
    id: "go-1",
    prose: `:= 在函数内部同时声明和赋值，类型从右边推断。同一行里至少要有一个新名字，否则不能用 :=。函数外面没有 :=，包一级用 var 或 const。短声明因此不会出现在示例的顶层，只出现在 main 里面。

const 在编译期就定下来。iota 在一组 const 的括号里从 0 递增，下一组 const 重新从 0 开始。不要以为文件里的 iota 会一直加下去。跳过一个值可以写 _ = iota。

整数运算的类型必须一致。int 和 int32 不能直接相加，要转换。教学例子全用 int，避开宽度问题。Yaegi 里 int 够放本章的数。除法是去尾的整数除法，20/6 得 3，不是 3.333。

单位换算先写成乘法再写除法时，注意先乘后除可以减少整除丢掉的余数。先除后乘可能变成 0。示例把 254/100 这种比例写成先乘再除。`,
    samples: [
      go("新名字", '\tn := 1\n\tn, m := 2, 3\n\tfmt.Println(n, m)', "2 3"),
      go("先乘后除", "\tfmt.Println(3 * 254 / 100)", "7"),
    ],
    practices: [
      "函数里用 :=，包一级用 var 或 const。",
      "每一组 const 里的 iota 都从 0 重新数。",
      "整数比例先乘后除，避免提前变成 0。",
    ],
    summary: ":= 只属于函数内部，const 和 iota 按组计数。整数相除会丢掉小数，换算时先乘后除。",
    exercise: {
      prompt: "用 := 声明千米数 5，打印对应的米数。",
      title: "参考答案：千米换米",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tkm := 5\n\tfmt.Println(km * 1000)\n}',
      expect: "5000",
    },
  }),
  2: pack({
    id: "go-2",
    prose: `int、float64、string、bool 是最常用的四种。rune 是 int32 的别名，表示一个 Unicode 码点。byte 是 uint8 的别名。字符串的 len 数的是字节，range 字符串时每次得到的是 rune。中文「你」占三个字节、一个 rune，所以两种数法不一样。

Printf 的格式动词要和类型匹配。%d 给整数，%s 给字符串，%q 给带引号的字符串，%.1f 给浮点并保留一位小数。动词用错会在输出里看到百分号提示，而不是你要的数字。Println 按默认格式并换行，适合快速看值。

浮点打印如果不限制位数，可能很长。示例用 %.1f 或先算出整数。不要把某一次打印的长小数写进期望。

零值不用你赋值也存在：数字是 0，字符串是空，布尔是 false，指针是 nil。var 声明而不赋值就会得到零值。:= 则必须有右边。`,
    samples: [
      go("零值", "\tvar n int\n\tfmt.Println(n)", "0"),
      go("一位小数", '\tfmt.Printf("%.1f\\n", 2.0)', "2.0"),
    ],
    practices: [
      "数中文字符用 range，数字节才用 len。",
      "Printf 的动词和类型对齐，并自己加换行。",
      "需要稳定输出时限制浮点位数。",
    ],
    summary: "len 对字符串数字节，range 才按字。Printf 用动词控制格式，未赋值的变量保持零值。",
    exercise: {
      prompt: "打印字符串 Go 的字节长度。",
      title: "参考答案：两个字节",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println(len("Go"))\n}',
      expect: "2",
    },
  }),
  3: pack({
    id: "go-3",
    prose: `Go 只有 for 这一种循环。while 不是关键字，写成 for 条件 { }。无限循环写成 for { }，一定要有 break 或 return，否则和文档里那个需要停止的例子一样停不下来。条件两边不要加括号，加了也能编译，但不是这里的风格。

if 同样不加括号，花括号不能换到下一行。else 必须紧跟在右花括号后面。这是语法，不是格式化工具的偏好，换行会直接报错。

switch 默认每个分支结束就离开，不用 break。想贯穿时写 fallthrough。没有表达式的 switch 相当于一串 if else。case 里可以写条件。

defer 把调用推迟到当前函数返回前，多个 defer 后进先出。它适合关闭资源。不要在循环里 defer 打开的文件，它们要等到函数结束才关闭。打印顺序时用 Print 而不是 Println，否则换行会插在推迟的输出前面，看起来像顺序错了。`,
    samples: [
      go("倒序", "\tfor n := 3; n >= 1; n-- {\n\t\tfmt.Println(n)\n\t}", "3"),
      go("两个 defer", '\tdefer fmt.Print("B")\n\tdefer fmt.Print("A")\n\tfmt.Print("C")', "CAB"),
    ],
    practices: [
      "循环只用 for。条件不加括号，左花括号不换行。",
      "switch 不写多余的 break。需要贯穿再写 fallthrough。",
      "观察 defer 顺序时用 Print，避免 Println 的换行打乱前后。",
    ],
    summary: "for 包办循环，switch 默认不贯穿。defer 在函数返回前按后进先出执行，打印时注意换行。",
    exercise: {
      prompt: "用 for 打印 2 和 4 的和。可以累加。",
      title: "参考答案：偶数和",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tsum := 0\n\tfor n := 2; n <= 4; n += 2 {\n\t\tsum += n\n\t}\n\tfmt.Println(sum)\n}',
      expect: "6",
    },
  }),
  4: pack({
    id: "go-4",
    prose: `数组的长度是类型的一部分。[3]int 和 [4]int 是不同类型。切片是数组上的窗口，长度是当前元素个数，容量是到底层数组末尾还能放多少。append 在容量够时原地加，不够时分配新数组，旧切片可能仍指向旧数组。不要保存 append 之前的切片指针当唯一真相，接住 append 的返回值。

切片字面量和数组字面量差在长度写不写。[]int{1, 2} 是切片，[2]int{1, 2} 是数组。函数参数几乎总是用切片，这样调用方可以传任意长度。

map 的键必须能比较。读取不存在的键得到零值，不会 panic。要用第二个返回值才能知道键在不在。nil map 可以读，不能写，写会 panic。先 make 或用字面量。

range 的顺序对切片是下标顺序，对 map 不稳定。要稳定输出就收集键、排序、再取值。本章若打印 map 本身，用某个确定的键，不打印整个 map。`,
    samples: [
      go("接住 append", "\ts := []int{1}\n\ts = append(s, 2, 3)\n\tfmt.Println(len(s))", "3"),
      go("键不存在", '\tm := map[string]int{"a": 1}\n\tv, ok := m["b"]\n\tfmt.Println(v, ok)', "0 false"),
    ],
    practices: [
      "append 的返回值赋回去，不要假定原切片变量已经变长。",
      "写 map 之前先 make，读的时候用 ok 区分缺失和零值。",
      "需要稳定顺序时排序键，不依赖 range map 的顺序。",
    ],
    summary: "数组长度属于类型，切片是窗口，append 可能换底层数组。map 的缺失键给出零值，写入前必须先创建。",
    exercise: {
      prompt: "创建一个长度为 0 的切片，append 一个 7，打印这个元素。",
      title: "参考答案：第一个元素",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar s []int\n\ts = append(s, 7)\n\tfmt.Println(s[0])\n}',
      expect: "7",
    },
  }),
  5: pack({
    id: "go-5",
    prose: `函数可以返回多个值。调用处用 := 一次接住。常用来同时返回结果和 error，错误那一章会专门用。现在先练习返回商和余数这种都是正常结果的情况。

可变参数在函数里是切片。调用时写成 sum(1, 2, 3)。已经有切片时，用 sum(nums...) 拆开传进去。忘记三个点，会把整个切片当成一个参数，类型对不上。

闭包可以读写外层变量。计数器返回的函数每次把同一个 n 加一。这个函数值可以存进变量，传给别的函数。它带的状态在 main 结束前都还在。

命名返回值可以少写一次变量，但也会让 return 裸返回，读起来要回头看签名。教学例子把返回值写在 return 后面，签名保持干净。递归和闭包一起用时，先声明函数变量再赋值，否则函数字面量里还看不见自己的名字。`,
    samples: [
      full(
        "多个结果",
        'package main\n\nimport "fmt"\n\nfunc div(a, b int) (int, int) { return a / b, a % b }\n\nfunc main() {\n\tq, r := div(17, 5)\n\tfmt.Println(q, r)\n}',
        "3 2",
      ),
      full(
        "拆开切片",
        'package main\n\nimport "fmt"\n\nfunc addAll(nums ...int) int {\n\tsum := 0\n\tfor _, n := range nums {\n\t\tsum += n\n\t}\n\treturn sum\n}\n\nfunc main() {\n\tfmt.Println(addAll([]int{1, 2, 3}...))\n}',
        "6",
      ),
    ],
    practices: [
      "多返回值都接住，或明确用下划线丢掉你真的不需要的那个。",
      "把切片传给可变参数时加上 ...。",
      "递归的函数变量先声明，再赋值。",
    ],
    summary: "多返回值和可变参数是函数的两种常见形状。闭包记住外层变量，递归函数要先有名字才能调用自己。",
    exercise: {
      prompt: "写一个接收两个 int 并返回它们差的函数，打印 10 和 3 的差。",
      title: "参考答案：差",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc diff(a, b int) int { return a - b }\n\nfunc main() {\n\tfmt.Println(diff(10, 3))\n}',
      expect: "7",
    },
  }),
  6: pack({
    id: "go-6",
    prose: `结构体把字段放在一起。字段名大写表示包外可见，小写只在本包可见。示例都在 package main，小写也能在 main 里用。一旦你把类型想成库，就用大写导出需要被外面看到的字段。

值接收者拿到副本，改字段不会影响调用方。指针接收者改的是原对象。需要修改时用指针。只是读取、结构体又很小时，值接收者更简单。Go 会自动取地址：值变量也能调用指针接收者的方法。

嵌入把另一个结构体写进字段且不写字段名。外层会提升内层的字段和方法。同名时外层优先。这不是继承，没有子类关系，只是少写一层名字。

字面量可以用字段名，也可以按顺序。有名字的字面量不怕以后插入字段。教程用名字，读的人不用数位置。`,
    samples: [
      full(
        "值不变",
        'package main\n\nimport "fmt"\n\ntype Point struct{ X, Y int }\n\nfunc (p Point) echo() int { return p.X }\n\nfunc main() {\n\tp := Point{1, 2}\n\tfmt.Println(p.echo())\n}',
        "1",
      ),
      full(
        "指针改变",
        'package main\n\nimport "fmt"\n\ntype Point struct{ X, Y int }\n\nfunc (p *Point) shift() { p.X++ }\n\nfunc main() {\n\tp := Point{1, 2}\n\tp.shift()\n\tfmt.Println(p.X)\n}',
        "2",
      ),
    ],
    practices: [
      "会修改字段的方法用指针接收者，并把返回值或原变量的变化打印出来核对。",
      "结构体字面量写上字段名。",
      "嵌入用来少写一层访问，不要把它理解成类继承。",
    ],
    summary: "结构体用字段名聚合数据。值接收者改副本，指针接收者改原对象。嵌入提升字段，但不是继承。",
    exercise: {
      prompt: "定义带 X 的结构体和返回 X+1 的值接收者方法，打印 X 为 41 的结果。",
      title: "参考答案：加一",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\ntype Num struct{ X int }\n\nfunc (n Num) Next() int { return n.X + 1 }\n\nfunc main() {\n\tfmt.Println(Num{41}.Next())\n}',
      expect: "42",
    },
  }),
  7: pack({
    id: "go-7",
    prose: `接口只列出方法。类型不用声明自己实现了哪个接口，方法对上就行。小接口更好组合。一个只有一个方法的接口，比一次要求十个方法的接口容易满足。

接口值里既有类型也有值。把具体类型放进接口再调用方法，走的是动态派发。fmt 打印时如果看到 String() string，就用它，这就是 Stringer。方法要定义在你希望打印的那个类型上。

类型断言有两种写法。v.(T) 在类型不对时 panic。v.(T) 配 ok 则安全。教学例子用 ok。switch v := x.(type) 可以一次分几种类型。

自定义 error 是一个只有 Error() string 的接口。Yaegi 0.16 把你自己的类型放进 error 再调用方法时会 panic。能跑的例子改用 errors.New。只读块里保留那个写法，提醒你这是解释器的限制，不是 Go 的规则。`,
    samples: [
      full(
        "小接口",
        'package main\n\nimport "fmt"\n\ntype Printer interface{ Out() string }\n\ntype Text string\n\nfunc (t Text) Out() string { return string(t) }\n\nfunc main() {\n\tvar p Printer = Text("hi")\n\tfmt.Println(p.Out())\n}',
        "hi",
      ),
      go("安全断言", '\tvar v any = "go"\n\tif s, ok := v.(string); ok {\n\t\tfmt.Println(len(s))\n\t}', "2"),
    ],
    practices: [
      "接口保持小，用方法集去满足，不写 implements。",
      "类型断言总是接住 ok，避免 panic。",
      "自定义 error 在本环境标成只读，可运行代码用 errors.New。",
    ],
    summary: "接口由方法集隐式满足。断言要带 ok。自定义 error 在 Yaegi 里不可靠，示例改用标准库的错误值。",
    exercise: {
      prompt: "把整数放进 any，断言成 int 后加 1 并打印。",
      title: "参考答案：断言后加一",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tvar v any = 41\n\tif n, ok := v.(int); ok {\n\t\tfmt.Println(n + 1)\n\t}\n}',
      expect: "42",
    },
  }),
  8: pack({
    id: "go-8",
    prose: `错误是返回值，不是异常。函数签名里的 error 告诉调用方必须处理。用下划线丢掉 error，后面的结果往往是零值，程序会带着错的数继续跑。只有你证明这个调用不可能失败时才丢掉，并且写注释。

fmt.Errorf 的 %w 把原错误包进去。errors.Is 顺着包装找哨兵错误。errors.As 找具体类型。本章用 Is 就够。哨兵错误用 errors.New 放在变量里，比较的是那一个值，不是消息文本。

panic 留给无法继续的程序错误。recover 只能在 defer 的函数里接住。用 panic 处理用户输入是过度的，输入错误应该返回 error。示例里的 panic 只为了演示 recover，不要模仿到业务分支里。

Atoi 失败时 n 是 0。如果你忽略 err，会以为用户输入了 0。永远先看 err，再使用 n。`,
    samples: [
      full(
        "包装仍能认出",
        'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nvar errEmpty = errors.New("empty")\n\nfunc main() {\n\terr := fmt.Errorf("parse: %w", errEmpty)\n\tif errors.Is(err, errEmpty) {\n\t\tfmt.Println("empty")\n\t}\n}',
        "empty",
      ),
      full(
        "先看错误",
        'package main\n\nimport (\n\t"fmt"\n\t"strconv"\n)\n\nfunc main() {\n\tif _, err := strconv.Atoi("no"); err != nil {\n\t\tfmt.Println("bad")\n\t}\n}',
        "bad",
      ),
    ],
    practices: [
      "先判断 error，再使用旁边的结果值。",
      "用 %w 和 errors.Is 保留原因，不比较错误消息的文字。",
      "可预期的输入问题返回 error，panic 只留给演示 recover 或真正的缺陷。",
    ],
    summary: "错误是返回值。包装之后用 errors.Is 辨认原因。panic 可以被 defer 里的 recover 接住，但不拿来处理普通输入。",
    exercise: {
      prompt: "解析字符串 7，成功时打印加 1 后的数。",
      title: "参考答案：解析 7",
      lang: "go",
      code: 'package main\n\nimport (\n\t"fmt"\n\t"strconv"\n)\n\nfunc main() {\n\tn, err := strconv.Atoi("7")\n\tif err != nil {\n\t\tfmt.Println("bad")\n\t\treturn\n\t}\n\tfmt.Println(n + 1)\n}',
      expect: "8",
    },
  }),
  9: pack({
    id: "go-9",
    prose: `go 关键字启动一个 goroutine。channel 用来把值交出去。无缓冲 channel 的发送和接收必须都准备好，否则发送方会停住。缓冲为 1 时，可以先发送一次再接收。示例用缓冲，避免在单线程调度里互相卡住。

Yaegi 在一个线程里轮流跑这些 goroutine。它能演示「发出去、收得到」，不能用来证明并行加速，也不要写 time.Sleep 等待对方。需要交接就用 channel，不要用睡眠碰运气。

close 告诉接收方没有更多的值。只有发送方应该关闭。接收方用 range 会一直读到关闭。忘记关闭，range 就不会结束。关闭一个已经关闭的 channel 会 panic，所以谁负责关闭要只有一方。

select 可以等多个 channel。它在 Yaegi 上和官方编译器容易不一致，文档里标成只读。能跑的例子只用一个 channel，把收发放在看得见的几行里。`,
    samples: [
      go("缓冲后接收", "\tch := make(chan int, 1)\n\tch <- 42\n\tfmt.Println(<-ch)", "42"),
      go("关闭后 range", "\tch := make(chan int, 2)\n\tch <- 1\n\tch <- 2\n\tclose(ch)\n\tsum := 0\n\tfor n := range ch {\n\t\tsum += n\n\t}\n\tfmt.Println(sum)", "3"),
    ],
    practices: [
      "用带缓冲的 channel 演示收发，避免无缓冲在单线程里卡住。",
      "只由发送方关闭 channel，接收方用 range 读到结束。",
      "不靠 time.Sleep 排列先后，也不把 select 放进自动测试。",
    ],
    summary: "goroutine 和 channel 用通信交接数据。这里是协作调度，缓冲和关闭决定会不会卡住或停不下来。",
    exercise: {
      prompt: "容量为 1 的 channel 发送 7 再接收并打印。不必启动 goroutine。",
      title: "参考答案：发送 7",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tch := make(chan int, 1)\n\tch <- 7\n\tfmt.Println(<-ch)\n}',
      expect: "7",
    },
  }),
  10: pack({
    id: "go-10",
    prose: `类型参数写在函数名后面的方括号里。T any 表示调用时可以是任何类型。函数体里只能做对任何类型都合法的事，例如原样返回，不能假设 T 有某方法，除非你写了约束。

Yaegi 0.16 能跑恒等函数、返回其中一个参数这种简单形式。带复杂约束、泛型数据结构或很深的类型推断时，行为和官方编译器不一致。那些例子标成只读。练习如果只是想要「两个 int 相加」，写成普通函数更稳，不必为了出现方括号而冒险。

类型参数不是运行时的盒子。编译器（或解释器）在调用点确定 T。你不能在运行中往同一个泛型函数里混入两种不相关的类型，除非约束允许。简单例子每次只实例化一种。

读代码时，先忽略方括号，看函数对值做了什么。如果去掉类型参数仍然清楚，说明这里可能不需要泛型。泛型是为了少写一遍相同的函数，不是为了让签名更长。`,
    samples: [
      full(
        "恒等字符串",
        'package main\n\nimport "fmt"\n\nfunc id[T any](v T) T { return v }\n\nfunc main() {\n\tfmt.Println(id("go"))\n}',
        "go",
      ),
      full(
        "取第一个",
        'package main\n\nimport "fmt"\n\nfunc first[T any](a, b T) T { return a }\n\nfunc main() {\n\tfmt.Println(first(3, 9))\n}',
        "3",
      ),
    ],
    practices: [
      "只把 Yaegi 上验证过的简单泛型放进可运行块。",
      "能用具体类型写清楚时不必加类型参数。",
      "复杂约束留在只读块，到本地 go 命令里试验。",
    ],
    summary: "简单类型参数在这里可以运行。复杂泛型不可靠，练习优先用具体类型把逻辑写对。",
    exercise: {
      prompt: "写普通函数返回两个整数中较大的一个，打印 8 和 3 的结果。",
      title: "参考答案：较大值",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc max(a, b int) int {\n\tif a > b {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc main() {\n\tfmt.Println(max(8, 3))\n}',
      expect: "8",
    },
  }),
  11: pack({
    id: "go-11",
    prose: `strings 处理文本：ToUpper、Contains、Count、Fields、TrimSpace。Fields 按空白切开，比自己找空格稳。sort 对切片原地排序，Ints 专门排 int。排序之后再取第一个和最后一个，就不用打印整个切片。

time.Date 构造一个确定的时刻。不要用 time.Sleep 制造等待，这里不保证真实睡眠，并发那一章已经说过。Year、Month、Day 足够做日历题。时区用 time.UTC，避免本地时区让日期差一天。

encoding/json 靠结构体标签决定字段名。标签是反引号里的 json:"name"。字段必须大写才能被编码。小写字段即使有标签也不会导出。Unmarshal 要传入指针，否则改的是副本。

strconv 在错误那一章已经用过 Atoi。这里可以搭配 strings 做小工具：先 TrimSpace 再 Atoi。组合标准库，而不是自己写解析器。`,
    samples: [
      full(
        "切词",
        'package main\n\nimport (\n\t"fmt"\n\t"strings"\n)\n\nfunc main() {\n\tfmt.Println(len(strings.Fields("go by example")))\n}',
        "3",
      ),
      full(
        "排序端点",
        'package main\n\nimport (\n\t"fmt"\n\t"sort"\n)\n\nfunc main() {\n\tn := []int{4, 1, 3}\n\tsort.Ints(n)\n\tfmt.Println(n[0], n[2])\n}',
        "1 4",
      ),
    ],
    practices: [
      "JSON 字段导出并写上标签，Unmarshal 传入指针。",
      "时间用 Date 构造，不用 Sleep。",
      "排序前复制切片，如果调用方还要原来的顺序。",
    ],
    summary: "字符串、排序、时间和 JSON 覆盖大多数小工具。字段要导出，时间要确定，排序是原地的。",
    exercise: {
      prompt: "把文本 go 变成大写并打印。",
      title: "参考答案：大写",
      lang: "go",
      code: 'package main\n\nimport (\n\t"fmt"\n\t"strings"\n)\n\nfunc main() {\n\tfmt.Println(strings.ToUpper("go"))\n}',
      expect: "GO",
    },
  }),
  12: pack({
    id: "go-12",
    prose: `待办清单放在切片里，元素是结构体或字符串。命令从标准输入按行进来。add 后面的文字是标题，list 打印数量或每条标题。读到 EOF 就结束，文档运行会在样例输入末尾送上 EOF。

拆行用 strings.SplitN(line, " ", 2)，这样标题里的空格能保留。结果可能只有一段，访问第二段之前看长度。空行跳过。未知命令打印固定的短句，不用 panic。

状态放在 main 的局部变量里。不要放进函数的全局变量就以为下次 Run 还在。进程结束内存就没了，这是环境的限制。同一次运行里可以先 add 再 list，样例输入用换行把两条命令接上。

先写不读输入的函数，例如数已完成的条数，再写循环。函数好检查，循环只负责读写。输出格式固定：第一行数量，后面每行一个标题，或者只打印你真正要断言的那一项。`,
    samples: [
      go("跳过空命令", '\tlines := []string{"add a", "", "add b"}\n\tn := 0\n\tfor _, line := range lines {\n\t\tif len(line) > 0 {\n\t\t\tn++\n\t\t}\n\t}\n\tfmt.Println(n)', "2"),
      full(
        "只留标题",
        'package main\n\nimport (\n\t"fmt"\n\t"strings"\n)\n\nfunc main() {\n\tparts := strings.SplitN("add 买笔", " ", 2)\n\tfmt.Println(parts[1])\n}',
        "买笔",
      ),
    ],
    practices: [
      "用 SplitN 限制成两段，保留标题里的空格。",
      "访问命令正文之前检查字段个数。",
      "清单只活在这一次进程里，不要假设下次运行还在。",
    ],
    summary: "命令行待办是一次运行内的切片加按行循环。拆分命令要防越界，输出格式要稳定。",
    exercise: {
      prompt: "直接 append 两条标题，打印切片长度。",
      title: "参考答案：两条",
      lang: "go",
      code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\titems := []string{}\n\titems = append(items, "书", "笔")\n\tfmt.Println(len(items))\n}',
      expect: "2",
    },
  }),
};

export function goPack(chapter) {
  const found = packs[chapter];
  if (!found) throw new Error(`missing go depth for chapter ${chapter}`);
  return found;
}
