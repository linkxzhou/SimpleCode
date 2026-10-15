---
language: cpp
chapter: 9
title: "只问最小、最大和次数"
level: advanced
minutes: 25
goals:
  - "用 min_element 找到 80"
  - "用 max_element 找到 150"
  - "用 count 与 count_if 计数而不重排"
sources:
  - learncpp
  - cppreference
updated: "2026-10-15"
---

三条边已经在向量里，次序是测量次序：120，然后 80，然后 150。工单常常只想知道最短的那条、最长的那条、以及有几条过了一米。自己写循环能做到，上一章的控制流也写过类似的圈。标准库的算法把「遍历」收成一个名字，你提供范围和条件。这一章用四个：`min_element`、`max_element`、`count`、`count_if`。它们都不改元素的相对次序。问完之后，下标 1 仍然是中畦。

不用 `std::sort`。它会把 libc++ 里需要 `__lttf2` 的路径拉进链接，那是长双精度比较的辅助符号，这条 wasm 链接线没有提供。失败发生在链接期，即使你排序的元素只是 `int`。可运行例子因此不包含排序。不能运行的块里留着调用的形状，提醒你这不是风格问题，是这个目标上的链接问题。要最短的边，不需要先把整段记录按大小排好。排序还会毁掉测量次序，而测量次序本身就是工单的一部分。

```cpp norun title="排序会在链接期失败"
#include <algorithm>
#include <vector>
void demo() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  std::sort(beds.begin(), beds.end());
}
```

`min_element` 接受一个范围，返回指向最小元素的迭代器。范围用 `begin()` 和 `end()`，`end()` 是末尾之后的位置，不是最后一条边。空范围上调用它，返回的迭代器等于 `end()`，解引用是未定义行为。我们的向量有三条边，返回值可以解引用。最小的是 80。迭代器的类型写全，不用 `auto`，这样能看见它是向量的迭代器，不是一份拷出来的厘米。算法没有把 80 从向量里拿掉，也没有把它换到下标 0。

```cpp run expect="80" title="最短的边还在原处"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  std::vector<int>::iterator it = std::min_element(beds.begin(), beds.end());
  std::cout << *it << "\n";
  return 0;
}
```

`max_element` 用同一对端点，返回指向 150 的迭代器。两次询问是两次遍历。三条边不值得为了少走一遍而手写一个同时记最小和最大的循环，除非你在更长的记录上测出了开销。算法的取舍是：每次调用说清一个问题，遍历的次数是问题的次数。手写循环可以把两个问题并进一圈，函数体却要同时维护两个候选，改一个条件时容易把另一个改坏。菜地选择说清问题。

```cpp run expect="150" title="最长的边"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  std::vector<int>::iterator it = std::max_element(beds.begin(), beds.end());
  std::cout << *it << "\n";
  return 0;
}
```

计数分两种。`count` 数某个值出现了几次。80 出现 1 次。`count_if` 数谓词为真的元素。谓词用 lambda：`[](int n) { return n >= 100; }`。120 和 150 过线，80 不过，结果是 2。两个结果印在一行，期望 `2 1`，前面是过线的条数，后面是 80 的出现次数。不要只期望 `1`，向量里的 120 和 150 都含有数字 1，单独的 `1` 会误伤；`2 1` 这个整体不会出现在边长的十进制写法里。

lambda 是一个临时的函数对象。它没有名字，参数 `n` 被用在返回的比较里，所以不是未使用的参数。它不捕获周围的局部变量，方括号是空的。若门槛 100 放在变量里，就要捕获它，捕获的方式会决定 lambda 里看到的是副本还是引用。引用捕获又回到那条老规则：绑上的变量必须活过 lambda 的使用。这一份谓词把 100 写死，避开捕获。

```cpp run expect="2 1" title="过线几条、80 出现几次"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  int wide = std::count_if(beds.begin(), beds.end(), [](int n) {
    return n >= 100;
  });
  int mids = std::count(beds.begin(), beds.end(), 80);
  std::cout << wide << " " << mids << "\n";
  return 0;
}
```

算法返回的计数类型是迭代器的差值类型，插入到 `cout` 时按整数印出。我们不把它和状态码混用。这里没有失败的空范围，所以也不返回 0 当错误。若向量可能为空，应当先看 `empty()` 或比较 `begin()` 与 `end()`，再决定要不要解引用最小元素。空向量的 `empty()` 为真，真值转换在这里用在容器上，而不是用在厘米上。0 个元素为假这个说法并不准确：`if (beds.empty())` 在空的时候为真。不要写成 `if (beds.size())` 又把「有元素」当成真、把空当成假，除非你确实想要这个转换。两种写法都能工作，`empty()` 把意图写成了单词。

和模板那一章的关系是：`min_element` 默认用 `<` 比较元素。对 `int`，`<` 就是厘米的大小。对 `string`，`<` 是字典序，不一定是更短。待办那一章若对文字取 `min_element`，得到的是字典序最小的那条，向量本身仍然不重排。这一章先只对厘米用，避免两套 `<` 叠在同一次输出里。

取舍还有性能以外的一层。算法要求你把范围的两端传对。两端若来自不同容器，或 `end` 在 `begin` 前面，行为没有定义，编译器不一定警告。手写下标循环用 `i < beds.size()` 把边界写在一处，更不容易配错一对迭代器。三条边看不出这个差别。记录变长以后，配对的 `begin` 与 `end` 应当来自同一次、同一个容器的调用，不要把一个迭代器存下来，跨越会使迭代器失效的 `push_back` 再送给算法。失效规则和握住元素引用跨越增长是同一笔账。

迭代器是算法和容器之间的接缝。`begin()` 指向第一格，`end()` 指向最后一格的后面。空向量上两者相等，范围里没有元素。`min_element` 在这种范围上返回 `end()`，你必须先判断再解引用。三条边的例子跳过了判断，因为我们刚放进了元素，中间没有清空。判断一旦省略成习惯，以后有人把向量的填充挪到条件后面，解引用就会碰到空范围。补上判断的写法是比较迭代器和 `end()`，相等就不要打印星号后面的值。不相等才表示找到了元素。这个判断和「厘米是不是 0」无关，它问的是位置在不在范围里。

算法不修改次序，不意味着它不读取全部元素。`count_if` 会把谓词用在每一格上，包括你觉得显然不过线的那格。谓词应当没有副作用。若 lambda 里顺便 `cout`，打印的次数等于元素个数，而且会混进你想要的那一行 `2 1` 里，期望子串就得把这些额外输出也算进去。我们的 lambda 只返回布尔值。布尔值在条件里为真或假，`count_if` 自己负责把真的次数累加。累加的结果再一次性插入流。这样输出只有一行，次序由我们的 `<<` 决定，不由谓词被调用的次序决定。

`count` 找的是相等，不是小于。80 和 80 相等，120 和 80 不相等。相等用 `==`。若元素类型是类，你要确定 `==` 比较的是哪几个成员。只比较名字会把两条同名不同长度的畦数成两次，只比较长度会把 80 厘米的两条不同畦数成同一条。这一章的元素是 `int`，相等没有歧义。歧义留到文字：字符串的 `==` 比较全部字节，`buy pen` 和 `buy  pen` 因为空格个数不同就不相等。多一个空格在眼睛里像同一句话，在 `count` 里是两次不同的值。字条要先约定是否修剪空白，再拿去计数。

比较器可以换成你自己的。`min_element` 有一个多出来的参数，接受一个「谁应该排在更前」的可调用物。默认是 `<`。我们不传这个参数，让厘米的大小保持默认。真要按「谁更接近 100」找一条边，那个可调用物会捕获 100，或者把 100 写进 lambda 体。捕获用引用时，被捕获的变量要活过算法的调用。调用是同步的，返回之后 lambda 就不再被使用，所以栈上的门槛活得够久。若把 lambda 存起来以后再用，引用捕获就会悬空。这一章不存储 lambda，门槛写死成 100，连捕获都不用。

链接失败的 `__lttf2` 值得再讲一句它为什么会缠上整数排序。模板的实现可能为了通用比较而实例化到更宽的浮点类型，或者同一个头里的其他函数被一起拉进目标文件。你看不到自己写下了 `long double`，链接器却提到它。这种失败不能靠改比较的元素类型来躲，因为触发点不在你的元素上。能躲的办法是不调用那个算法。`min_element` 和 `count` 的实现停留在元素类型的 `<` 和 `==` 上，整数的这些运算符不需要长双精度辅助。选择算法变成了选择依赖。依赖付得起的那些，写进可运行块；付不起的，留在只读块里当对照。

问完最小和次数之后，向量的容量、次序、每个元素的值都不应被这些调用改掉。若你在调用前后各打印一次 `beds[0]`、`beds[1]`、`beds[2]`，应当仍是 120、80、150。示例为了让期望干净，没有把前后各打一遍，散文里把这个不变写成约定。约定被破坏时，优先怀疑自己写了交换或赋值，而不是怀疑 `count_if` 会重排。它的名字里没有排列的意思。名字和效果一致，是这一章挑选算法的标准之一。

`max_element` 在所有元素都相等时返回指向第一格的迭代器，因为没有任何一格严格大于当前候选时，它保持先遇到的那个。三条边互不相等，这个平局规则碰不到。若以后两畦都是 120，最大值的位置会是较早的那条，而不是「任意一条」。位置因此仍受测量次序影响，即使值相同。这又是一个不重排的理由：次序决定平局时谁被指到。排过之后，相等元素的相对次序是否保持，取决于你用的是哪一种排序，而我们根本不排。需要稳定的「第一格优先」时，就保持现在的测量次序，让 `max_element` 的平局规则有一个可预期的输入。

计数的返回值是带符号的差值类型，可能比 `int` 宽。三条边的次数远小于这个宽度的上限，插入到流里就是普通的十进制。不要把这个返回值再塞回一个更窄的类型又忽略截断。示例直接把返回值交给 `<<`，或者先放进 `int` 变量再打印。放进 `int` 对次数 1 和 2 没有损失。若记录长到 `int` 装不下，应当保留算法返回的类型。菜地用不上那个宽度，仍避免把返回值丢掉不用。不用的局部变量会在更严的警告下失败，也会让次数白算。

## 小结

`min_element` 指向 80，`max_element` 指向 150，向量的测量次序不变。`count_if` 数出不小于 100 的两条，`count` 数出 80 出现一次，输出是 `2 1`。这些算法都不重排元素。

`std::sort` 留在不能运行的块里，因为链接期缺少 `__lttf2`。下一章从标准输入读进一行字条。字条的原文是 `buy pen`，读入用 `getline`，不再从源码字面量里取这一行。

## 练习

用 `count` 数 150 出现了几次。向量仍是 120、80、150。应当打印 1。把期望放在单独一行的数字上，不要再打印别的含有 `1` 的边长。

::: answer 参考答案：南畦出现一次
```cpp run expect="1" title="参考答案"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  int n = std::count(beds.begin(), beds.end(), 150);
  std::cout << n << "\n";
  return 0;
}
```
:::

再用 `count_if` 数严格小于 100 的边。同一组 120、80、150 里只有中畦，应当打印 1。谓词写在 lambda 里，不要把向量重排后再去数。

::: answer 参考答案：不到一米的一条
```cpp run expect="1" title="参考答案"
#include <algorithm>
#include <iostream>
#include <vector>
int main() {
  std::vector<int> beds;
  beds.push_back(120);
  beds.push_back(80);
  beds.push_back(150);
  int n = std::count_if(beds.begin(), beds.end(), [](int x) {
    return x < 100;
  });
  std::cout << n << "\n";
  return 0;
}
```
:::

延伸阅读只作链接。[LearnCpp](https://www.learncpp.com/) 版权保留，[cppreference 的 min_element](https://en.cppreference.com/w/cpp/algorithm/min_element)、[count](https://en.cppreference.com/w/cpp/algorithm/count) 与 [count_if](https://en.cppreference.com/w/cpp/algorithm/count_if) 写了范围和返回值。排序不在可运行例子里。
