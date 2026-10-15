import { answerRun, fence, lesson, mistakes, note, run } from "../format.mjs";

const SRC = ["gobyexample", "learn-go-tests"];
const G = (meta, body) => lesson({ language: "go", sources: SRC }, meta, body);
const tail = (items) => `${mistakes(items)}

## 延伸阅读

- [A Tour of Go](https://go.dev/tour/)（仅链接）
- [The Little Go Book](https://github.com/karlseguin/the-little-go-book)（CC BY-NC-SA，仅链接）
- [Effective Go](https://go.dev/doc/effective_go)（仅链接）

## 参考与致谢

正文为原创。示例的结构参考了 Go by Example（CC BY 3.0，Mark McGranaghan / Jeremy Jackson）和 Learn Go with Tests（MIT，quii），代码是按本运行时改写的，不是原文摘录。`;

const pkg = (body) => `package main\n\n${body}`;

export const pages = [
  G({ chapter: 0, file: "index.md", title: "概览：这里的 Go", minutes: 8, goals: ["知道本环境用 Yaegi 解释执行", "写出完整的 package main", "不使用 go get"], sources: ["gobyexample", "go-tour", "little-go-book"] }, `
这里的 Go 不是 \`go build\`，而是 Yaegi 0.16.1 在浏览器里解释执行。每个示例都必须是完整的 \`package main\`，并且只使用解释器自带的标准库。

没有 \`go get\`、cgo 和网络。个别反射、泛型和 unsafe 的行为与官方编译器不同，复杂写法会标成只读。

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Println("你好")\n}'), "你好", { title: "问候" })}

${fence("go", 'package main\n\n// 只读：不要在示例里访问网络。\n// import "net/http"', { norun: true, title: "不做的事" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Println(6 * 7)\n}'), "42", { title: "运算" })}

## 练习

打印你自己的一行问候。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Println("你好，杭州")\n}'), "你好，杭州")}

${tail(["漏写 package main。Yaegi 需要它作为入口。", "留下没有使用的 import。解释器会报错。"])}`),

  G({ chapter: 1, slug: "vars", title: "包、变量与常量", level: "beginner", goals: ["用 := 声明并赋值", "定义 const 和 iota", "做一次单位换算"] }, `
\`:=\` 在函数里同时声明和赋值，类型由右边推断。\`const\` 是编译期就定下来的名字。\`iota\` 在一组常量里从 0 开始数。

包级变量用 \`var\`。短声明只能出现在函数内部。

${run("go", pkg('import "fmt"\n\nconst boiling = 100\n\nfunc main() {\n\tname := "Ada"\n\tfmt.Println(name)\n\tfmt.Println(boiling*9/5 + 32)\n}'), "Ada", { title: "名片" })}

${run("go", pkg('import "fmt"\n\nconst (\n\tred = iota\n\tgreen\n\tblue\n)\n\nfunc main() {\n\tfmt.Println(red, green, blue)\n}'), "0 1 2", { title: "iota" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tkm := 2\n\tfmt.Println(km * 1000)\n}'), "2000", { title: "单位换算" })}

## 练习

把 3 英寸换成厘米（1 英寸 = 254 / 100 厘米，用整数 254/100），打印结果。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Println(3 * 254 / 100)\n}'), "7")}

${tail(["在函数外使用 :=。短声明只属于函数内部。", "iota 写在单独的 const 里却以为会继续加。每组 const 都会重新从 0 开始。"])}`),

  G({ chapter: 2, slug: "types", title: "基本类型与格式化", level: "beginner", goals: ["区分 int、float64、string、rune", "用 Printf 控制格式", "按 rune 而不是字节计数"] }, `
\`int\` 的宽度跟着实现走，这里够用即可。\`rune\` 是 Unicode 码点，底层是 int32。\`len\` 对字符串数的是字节，中文一个字往往占 3 个字节。

\`fmt.Printf\` 的 \`%d\`、\`%s\`、\`%.1f\` 决定怎么印。\`\\n\` 要自己加上，Println 才会自动换行。

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Printf("%T\\n", 36)\n\tfmt.Printf("%.1f\\n", 1.25)\n}'), "int", { title: "类型" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tword := "你好"\n\tfmt.Println(len(word))\n\tn := 0\n\tfor range word {\n\t\tn++\n\t}\n\tfmt.Println(n)\n}'), "6", { title: "字节与字" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Printf("%c\\n", \'A\')\n}'), "A", { title: "rune" })}

## 练习

打印字符串 \`"Go"\` 的字节长度。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Println(len("Go"))\n}'), "2")}

${tail(["用 len 判断中文有几个字。len 返回字节数。", "Printf 忘记换行，两行结果粘在一起。"])}`),

  G({ chapter: 3, slug: "control", title: "控制流", level: "beginner", goals: ["写 if、for 和 switch", "用 defer 推迟调用", "判断质数"] }, `
Go 只有 \`for\` 一种循环。条件两边不要加括号。\`switch\` 默认每个分支结束就离开，不用写 break。

\`defer\` 把调用推迟到当前函数返回前，多个 defer 按后进先出执行。

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfor n := 1; n <= 7; n++ {\n\t\tswitch {\n\t\tcase n%15 == 0:\n\t\t\tfmt.Print("FizzBuzz ")\n\t\tcase n%3 == 0:\n\t\t\tfmt.Print("Fizz ")\n\t\tcase n%5 == 0:\n\t\t\tfmt.Print("Buzz ")\n\t\tdefault:\n\t\t\tfmt.Print(n, " ")\n\t\t}\n\t}\n\tfmt.Println()\n}'), "1 2 Fizz 4 Buzz Fizz 7", { title: "FizzBuzz" })}

${run("go", pkg('import "fmt"\n\nfunc prime(n int) bool {\n\tif n < 2 {\n\t\treturn false\n\t}\n\tfor i := 2; i*i <= n; i++ {\n\t\tif n%i == 0 {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}\n\nfunc main() {\n\tif prime(5) {\n\t\tfmt.Println("质数")\n\t}\n}'), "质数", { title: "质数" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tfmt.Print("a")\n\tdefer fmt.Print("c")\n\tfmt.Print("b")\n\tfmt.Println()\n}'), "abc", { title: "defer" })}

## 练习

用 for 打印 3、2、1。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tfor n := 3; n >= 1; n-- {\n\t\tfmt.Println(n)\n\t}\n}'), "3\n2\n1")}

${tail(["把 while 写成关键字。Go 里就是 for 条件 { }。", "defer 写在循环里打开很多资源。它们要等到函数结束才执行。"])}`),

  G({ chapter: 4, slug: "collections", title: "数组、切片与 map", level: "beginner", goals: ["区分数组和切片", "用 append 生长切片", "用 map 统计词频"] }, `
数组长度是类型的一部分。切片是数组的窗口，\`append\` 可能换一块底层存储。map 的键必须能比较。

读一行输入用 \`bufio.Scanner\`。示例把样例输入交给标准输入。

${run("go", pkg('import (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\nfunc main() {\n\tin := bufio.NewScanner(os.Stdin)\n\tin.Scan()\n\tcounts := map[string]int{}\n\tfor _, word := range strings.Fields(in.Text()) {\n\t\tcounts[word]++\n\t}\n\tfmt.Println(counts["to"])\n}'), "2", { title: "词频", stdin: "to be or not to be\n" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tnums := []int{1, 2, 2, 3}\n\tseen := map[int]bool{}\n\tvar out []int\n\tfor _, n := range nums {\n\t\tif !seen[n] {\n\t\t\tseen[n] = true\n\t\t\tout = append(out, n)\n\t\t}\n\t}\n\tfmt.Println(out)\n}'), "[1 2 3]", { title: "去重保序" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\ta := [3]int{7, 8, 9}\n\ts := a[:2]\n\tfmt.Println(len(s), cap(a))\n}'), "2 3", { title: "切片窗口" })}

## 练习

append 两次，打印切片长度。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tvar s []int\n\ts = append(s, 1, 2)\n\tfmt.Println(len(s))\n}'), "2")}

${tail(["把切片当成永远指向原数组。append 超出容量时会换新数组。", "range map 的顺序当成稳定的。要稳定输出就收集键再排序。"])}`),

  G({ chapter: 5, slug: "funcs", title: "函数与闭包", level: "intermediate", goals: ["返回多个结果", "使用可变参数", "用闭包记住状态"] }, `
多返回值常用来同时给出结果和错误，下一章会专门讲错误。可变参数在函数内部是切片。

闭包可以改外层变量。计数器每次调用都让同一份 n 增加。

${run("go", pkg('import "fmt"\n\nfunc divmod(a, b int) (int, int) {\n\treturn a / b, a % b\n}\n\nfunc main() {\n\tq, r := divmod(17, 5)\n\tfmt.Println(q, r)\n}'), "3 2", { title: "多返回值" })}

${run("go", pkg('import "fmt"\n\nfunc sum(nums ...int) int {\n\ttotal := 0\n\tfor _, n := range nums {\n\t\ttotal += n\n\t}\n\treturn total\n}\n\nfunc main() {\n\tfmt.Println(sum(1, 2, 3))\n}'), "6", { title: "可变参数" })}

${run("go", pkg('import "fmt"\n\nfunc counter() func() int {\n\tn := 0\n\treturn func() int {\n\t\tn++\n\t\treturn n\n\t}\n}\n\nfunc main() {\n\tnext := counter()\n\tfmt.Println(next())\n\tfmt.Println(next())\n}'), "1", { title: "计数器" })}

## 练习

用闭包做记忆化，计算 fib(8)。0,1,1,2,3,5,8,13,21 的第 8 项是 21。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tmem := map[int]int{0: 0, 1: 1}\n\tvar fib func(int) int\n\tfib = func(n int) int {\n\t\tif v, ok := mem[n]; ok {\n\t\t\treturn v\n\t\t}\n\t\tmem[n] = fib(n-1) + fib(n-2)\n\t\treturn mem[n]\n\t}\n\tfmt.Println(fib(8))\n}'), "21")}

${tail(["可变参数再传给另一个可变参数时忘记用 ...。", "闭包里的循环变量在旧版本会共享。这里的计数器不依赖循环变量。"])}`),

  G({ chapter: 6, slug: "structs", title: "结构体与方法", level: "intermediate", goals: ["定义 struct", "区分值接收者和指针接收者", "用嵌入复用字段"] }, `
结构体是一组字段。方法写在类型后面：值接收者拿到副本，指针接收者可以改原对象。

嵌入不是继承。内层类型的字段和方法会被提升，外面可以直接调用。

${run("go", pkg('import "fmt"\n\ntype Account struct {\n\tOwner   string\n\tBalance int\n}\n\nfunc (a *Account) Deposit(n int) {\n\ta.Balance += n\n}\n\nfunc main() {\n\tacc := Account{Owner: "Ada", Balance: 100}\n\tacc.Deposit(25)\n\tfmt.Println(acc.Owner, acc.Balance)\n}'), "Ada 125", { title: "账户" })}

${run("go", pkg('import "fmt"\n\ntype Rect struct{ W, H int }\n\nfunc (r Rect) Area() int { return r.W * r.H }\n\nfunc main() {\n\tfmt.Println(Rect{W: 3, H: 4}.Area())\n}'), "12", { title: "矩形" })}

${run("go", pkg('import "fmt"\n\ntype Point struct{ X, Y int }\n\ntype Named struct {\n\tPoint\n\tName string\n}\n\nfunc main() {\n\tn := Named{Point: Point{1, 2}, Name: "原点旁"}\n\tfmt.Println(n.X+n.Y, n.Name)\n}'), "3 原点旁", { title: "嵌入" })}

## 练习

给 Point 加一个 Dist 方法，返回 X 和 Y 的和的绝对值，打印 (1, -4)。

${answerRun("参考答案", "go", pkg('import "fmt"\n\ntype Point struct{ X, Y int }\n\nfunc (p Point) Manhattan() int {\n\ts := p.X + p.Y\n\tif s < 0 {\n\t\treturn -s\n\t}\n\treturn s\n}\n\nfunc main() {\n\tfmt.Println(Point{1, -4}.Manhattan())\n}'), "3")}

${tail(["值接收者里修改字段，调用后原值不变。需要修改就用指针接收者。", "嵌入的字段和外部字段同名，提升会被挡住。"])}`),

  G({ chapter: 7, slug: "interfaces", title: "接口", level: "intermediate", goals: ["用隐式实现满足接口", "做类型断言", "实现 Stringer"] }, `
接口只描述方法。只要类型拥有这些方法，就自动满足接口，不用写 implements。

类型断言 \`v.(T)\` 有两个返回值时不会 panic。\`fmt\` 打印时如果发现 \`String() string\`，会用它。

${run("go", pkg('import "fmt"\n\ntype Shape interface{ Area() int }\n\ntype Rect struct{ W, H int }\n\nfunc (r Rect) Area() int { return r.W * r.H }\n\nfunc main() {\n\tvar s Shape = Rect{3, 4}\n\tfmt.Println(s.Area())\n}'), "12", { title: "形状" })}

${run("go", pkg('import "fmt"\n\ntype User struct{ Name string }\n\nfunc (u User) String() string { return "user:" + u.Name }\n\nfunc main() {\n\tfmt.Println(User{Name: "Ada"})\n}'), "user:Ada", { title: "Stringer" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tvar v any = 42\n\tif n, ok := v.(int); ok {\n\t\tfmt.Println(n + 1)\n\t}\n}'), "43", { title: "类型断言" })}

## 练习

定义一个只有 \`Error() string\` 的类型，并打印它。

${answerRun("参考答案", "go", pkg('import "fmt"\n\ntype Oops struct{}\n\nfunc (Oops) Error() string { return "oops" }\n\nfunc main() {\n\tvar err error = Oops{}\n\tfmt.Println(err.Error())\n}'), "oops")}

${tail(["类型断言不接 ok，类型不对时 panic。", "接口里放大方法集。实现者要全部满足，小接口更好组合。"])}`),

  G({ chapter: 8, slug: "errors", title: "错误处理", level: "intermediate", goals: ["返回 error 而不是忽略", "用 %w 包装错误", "用 errors.Is 判断原因"] }, `
Go 的惯用法是把错误当成返回值。\`fmt.Errorf\` 的 \`%w\` 保留原因，\`errors.Is\` 能顺着包装链找回去。

\`panic\` 留给真正无法继续的情况。\`recover\` 只能在 defer 里接住 panic。

${run("go", pkg('import (\n\t"errors"\n\t"fmt"\n)\n\nvar errEmpty = errors.New("empty")\n\nfunc parse(s string) error {\n\tif s == "" {\n\t\treturn fmt.Errorf("parse: %w", errEmpty)\n\t}\n\treturn nil\n}\n\nfunc main() {\n\tif errors.Is(parse(""), errEmpty) {\n\t\tfmt.Println("empty")\n\t}\n}'), "empty", { title: "errors.Is" })}

${run("go", pkg('import (\n\t"fmt"\n\t"strconv"\n)\n\nfunc main() {\n\tn, err := strconv.Atoi("41")\n\tif err != nil {\n\t\tfmt.Println("bad")\n\t\treturn\n\t}\n\tfmt.Println(n + 1)\n}'), "42", { title: "Atoi" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tdefer func() {\n\t\tif recover() != nil {\n\t\t\tfmt.Println("recovered")\n\t\t}\n\t}()\n\tpanic("boom")\n}'), "recovered", { title: "recover" })}

## 练习

Atoi 解析 \`"no"\`，出错时打印「不是整数」。

${answerRun("参考答案", "go", pkg('import (\n\t"fmt"\n\t"strconv"\n)\n\nfunc main() {\n\tif _, err := strconv.Atoi("no"); err != nil {\n\t\tfmt.Println("不是整数")\n\t}\n}'), "不是整数")}

${tail(["用 _ 丢掉 error。失败会变成后面的零值，很难查。", "panic 当普通分支用。可预期的输入错误应该返回 error。"])}`),

  G({ chapter: 9, slug: "concurrency", title: "goroutine 与 channel", level: "advanced", goals: ["用 channel 传递一个值", "理解缓冲避免立刻阻塞", "知道这里是协作调度而不是多核并行"] }, `
\`go\` 启动一个 goroutine。channel 用来交接数据。无缓冲 channel 的发送和接收必须碰面；缓冲为 1 时，发送可以先放进去。

Yaegi 在单线程里调度这些 goroutine，能演示通信，不代表并行加速。不要依赖 \`time.Sleep\` 的真实等待。

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tch := make(chan int, 1)\n\tgo func() { ch <- 42 }()\n\tfmt.Println(<-ch)\n}'), "42", { title: "交接一个数" })}

${run("go", pkg('import "fmt"\n\nfunc main() {\n\tch := make(chan string, 2)\n\tch <- "a"\n\tch <- "b"\n\tclose(ch)\n\tfor v := range ch {\n\t\tfmt.Print(v)\n\t}\n\tfmt.Println()\n}'), "ab", { title: "缓冲与关闭" })}

${note("更复杂的 select 扇入在 Yaegi 上容易和官方编译器不一致。下面只给阅读，不在自动测试里运行。")}

${fence("go", 'package main\n\nfunc main() {\n\t// select 多路扇入请在本地 Go 工具链里试验。\n}', { norun: true, title: "只读：select" })}

## 练习

用容量为 1 的 channel 发送 \`"ok"\` 再接收并打印。可以不用 goroutine。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\tch := make(chan string, 1)\n\tch <- "ok"\n\tfmt.Println(<-ch)\n}'), "ok")}

${tail(["对无缓冲 channel 先发送、没有人接收，程序会一直停着。", "忘记 close 就 range channel。发送方不再发送时要关闭，否则接收循环不结束。"])}`),

  G({ chapter: 10, slug: "generics", title: "泛型", level: "advanced", goals: ["写出一个类型参数", "知道 Yaegi 只适合简单泛型", "把复杂约束留在本地工具链"] }, `
类型参数写在函数名后面的方括号里。\`T any\` 表示任何类型。简单的恒等函数用来确认这条路径能跑。

Yaegi 0.16 对泛型的支持有限。带复杂约束、类型推断嵌套或泛型数据结构的代码标成只读，请在官方 \`go\` 命令里试验。

${run("go", pkg('import "fmt"\n\nfunc Identity[T any](v T) T {\n\treturn v\n}\n\nfunc main() {\n\tfmt.Println(Identity(42))\n}'), "42", { title: "恒等函数" })}

${run("go", pkg('import "fmt"\n\nfunc Second[T any](a, b T) T {\n\treturn b\n}\n\nfunc main() {\n\tfmt.Println(Second("x", "y"))\n}'), "y", { title: "取第二个" })}

${fence("go", 'package main\n\n// 只读：带自定义约束的泛型栈在 Yaegi 0.16 上不可靠。\n// func Push[T any](s []T, v T) []T { return append(s, v) }', { norun: true, title: "复杂泛型" })}

## 练习

写一个返回两个同类型参数之和的泛型函数，只实例化成 int，打印 20+22。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc Add(a, b int) int { return a + b }\n\nfunc main() {\n\tfmt.Println(Add(20, 22))\n}'), "42")}

${tail(["为了练泛型而把所有函数都加上类型参数。具体类型更清楚时不必泛化。", "在 Yaegi 里调试失败的复杂泛型。先换成具体类型确认逻辑，再拿到本地 Go 里恢复类型参数。"])}`),

  G({ chapter: 11, slug: "stdlib", title: "标准库精选", level: "advanced", goals: ["用 strings 和 sort", "用 time.Date 而不是 Sleep", "用 encoding/json 编解码"] }, `
\`strings\`、\`sort\`、\`strconv\` 和 \`encoding/json\` 覆盖了大部分小工具。\`time.Date\` 构造一个确定的时刻，不需要让程序真的睡下去。

JSON 的字段名由结构体标签决定。标签要用反引号。

${run("go", pkg('import (\n\t"fmt"\n\t"strings"\n)\n\nfunc main() {\n\tfmt.Println(strings.ToUpper("go"))\n\tfmt.Println(strings.Count("banana", "a"))\n}'), "GO", { title: "strings" })}

${run("go", pkg('import (\n\t"fmt"\n\t"sort"\n)\n\nfunc main() {\n\tnums := []int{3, 1, 2}\n\tsort.Ints(nums)\n\tfmt.Println(nums[0], nums[2])\n}'), "1 3", { title: "排序" })}

${run("go", pkg('import (\n\t"encoding/json"\n\t"fmt"\n\t"time"\n)\n\ntype Item struct {\n\tName string \`json:"name"\`\n}\n\nfunc main() {\n\tt := time.Date(2026, 10, 15, 0, 0, 0, 0, time.UTC)\n\tb, err := json.Marshal(Item{Name: "笔"})\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(t.Year())\n\tfmt.Println(string(b))\n}'), "2026", { title: "时间和 JSON" })}

## 练习

把 JSON \`{"name":"Ada"}\` 解到结构体并打印 Name。

${answerRun("参考答案", "go", pkg('import (\n\t"encoding/json"\n\t"fmt"\n)\n\ntype Item struct {\n\tName string \`json:"name"\`\n}\n\nfunc main() {\n\tvar item Item\n\tif err := json.Unmarshal([]byte(\`{"name":"Ada"}\`), &item); err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(item.Name)\n}'), "Ada")}

${tail(["用 time.Sleep 制造先后顺序。这里不保证真实等待，用 channel 交接更明确。", "JSON 字段是小写开头又没有标签。编码时不会导出未导出字段。"])}`),

  G({ chapter: 12, slug: "todo", title: "小项目：命令行待办", level: "advanced", minutes: 16, goals: ["用结构体保存一条待办", "从标准输入接收命令", "把清单只放在内存里"] }, `
待办事项用切片保存。命令 \`add 文字\` 追加一条，\`list\` 打印全部。程序读到 EOF 就结束，清单不写入磁盘。

示例一次喂入两行命令。

${run("go", pkg('import (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\ntype item struct{ title string }\n\nfunc main() {\n\tvar items []item\n\tin := bufio.NewScanner(os.Stdin)\n\tfor in.Scan() {\n\t\tfields := strings.SplitN(in.Text(), " ", 2)\n\t\tswitch fields[0] {\n\t\tcase "add":\n\t\t\titems = append(items, item{title: fields[1]})\n\t\tcase "list":\n\t\t\tfmt.Println(len(items))\n\t\t}\n\t}\n\tfmt.Println(items[0].title)\n}'), "买笔", { title: "待办", stdin: "add 买笔\nlist\n" })}

${run("go", pkg('import "fmt"\n\nfunc doneCount(flags []bool) int {\n\tn := 0\n\tfor _, ok := range flags {\n\t\tif ok {\n\t\t\tn++\n\t\t}\n\t}\n\treturn n\n}\n\nfunc main() {\n\tfmt.Println(doneCount([]bool{true, false, true}))\n}'), "2", { title: "完成数" })}

${note("想跨次运行保存清单，需要本环境之外的文件系统。刷新页面后内存清单会消失。")}

## 练习

只执行 \`add 书\`，打印条数 1。可以不读输入，直接 append。

${answerRun("参考答案", "go", pkg('import "fmt"\n\nfunc main() {\n\titems := []string{}\n\titems = append(items, "书")\n\tfmt.Println(len(items))\n}'), "1")}

${tail(["SplitN 的结果只有命令、没有正文时访问 fields[1]。先检查长度。", "把清单存进全局变量就以为下次运行还在。进程一结束就没了。"])}`),
];
