---
language: cpp
chapter: 11
title: "按写下的次序留着的待办"
level: advanced
minutes: 28
goals:
  - "把 buy pen 放进待办的第一格"
  - "用计数问过线的事，而不重排文字"
  - "让 min_element 不改变向量的次序"
sources:
  - learncpp
  - cppreference
updated: "2026-10-15"
---

木牌上的一行已经能进进程。一天的活不只这一行。待办是一个 `vector<string>`：第一格来自标准输入，后面两格写在源码里。次序是它们被写下的次序。有人会想按字母排，让 `buy pen` 因为以 `b` 开头而排到 `measure` 前面。那是字典序，不是农活的先后。先买笔、再浇水、再量中畦，这个先后若被排掉，下午就不知道哪一件先做。这一章不调用排序。链接期缺少 `__lttf2` 是一个原因，工单会被重排是另一个原因。就算链接能过，这里也不排。

第一份程序读入 `buy pen`，再放入 `water` 和 `measure`。打印时用竖线把三格接成 `buy pen|water|measure`。竖线不是待办的内容，是为了让期望子串能一次看见次序。若算法或手写交换把它们按字典序排过，`buy` 仍会在最前，光看第一格发现不了。竖线后面若先出现 `measure`，就说明次序被改过。`water` 夹在中间，是这份数据里最有用的证人。

读取失败时打印 `失败` 并返回，不去放入空字符串。围栏提供了那一行，成功路径才会看到三格。空字符串若被放进向量，个数会变成 3，其中一格却不是木牌。个数就不能再代表「三件事」。

```cpp run stdin="buy pen\n" expect="buy pen|water|measure" title="三件活的次序"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) {
    std::cout << "失败\n";
    return 0;
  }
  std::vector<std::string> todos;
  todos.push_back(line);
  todos.push_back("water");
  todos.push_back("measure");
  std::cout << todos[0] << "|" << todos[1] << "|" << todos[2] << "\n";
  return 0;
}
```

第二份程序在同一份待办上计数，仍然不重排。个数是 3。`count_if` 数字节数大于 5 的条目：`buy pen` 是 7，`water` 是 5，`measure` 是 7。大于 5 的有两件。5 本身不计入，所以 `water` 被留下当证人，既在次序的中间，又不满足这条谓词。输出写成 `3 2`。不要只打印 `2`，免得和别的次数混在子串里；这一行同时把个数和谓词结果放在一起。

谓词看的是 `size()`。对这三条英文，字节数和你看见的字符数相同。若把中文农活放进来，`size()` 会按字节变大，大于 5 可能只代表「超过一个汉字多一点」，不是「超过五个字」。这一章的三条都是英文，就是为了让 5 和 7 可以被直接数。中文的字节账在向量那一章已经用「北畦」算过，这里不再混进同一行输出。

```cpp run stdin="buy pen\n" expect="3 2" title="三件里有两件更长"
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) {
    std::cout << "失败\n";
    return 0;
  }
  std::vector<std::string> todos;
  todos.push_back(line);
  todos.push_back("water");
  todos.push_back("measure");
  int long_ones = std::count_if(todos.begin(), todos.end(), [](const std::string &task) {
    return task.size() > 5;
  });
  std::cout << todos.size() << " " << long_ones << "\n";
  return 0;
}
```

lambda 的参数是 const 引用，绑到向量里的字符串上，不拷贝字条，也不修改它。引用在 lambda 调用时初始化，那时候元素已经在向量里。lambda 本身不跨越后面的 `push_back`，因为三次放入都在计数之前完成。若先取迭代器再 `push_back`，迭代器可能失效，算法的范围就配错了。次序是：读入、放完、再问。

第三份程序问字典序最小的那一条，同时再把原次序印出来。`min_element` 用字符串的 `<`，`buy pen` 以 `b` 开头，比 `measure` 和 `water` 都小。它返回迭代器，解引用得到 `buy pen`。下一行仍是 `buy pen|water|measure`。两行放在一起，证明「问到了最小的文字」和「向量被排成字典序」不是同一件事。最小的那条碰巧在第一格，是因为木牌先被写入，不是因为算法把它换到了第一格。若要证得更狠，可以把 `water` 先放入、木牌后放入，最小的文字就不再等于第一格。练习里做这个对照。正文这一份保持「先木牌」的叙述，用第二行的 `water` 证明没有人把 `measure` 插到它前面。

```cpp run stdin="buy pen\n" expect="buy pen|water|measure" title="问最小也不改次序"
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) {
    std::cout << "失败\n";
    return 0;
  }
  std::vector<std::string> todos;
  todos.push_back(line);
  todos.push_back("water");
  todos.push_back("measure");
  std::vector<std::string>::iterator it = std::min_element(todos.begin(), todos.end());
  std::cout << *it << "\n";
  std::cout << todos[0] << "|" << todos[1] << "|" << todos[2] << "\n";
  return 0;
}
```

厘米还在这块菜地里，只是不再和待办挤在同一个向量。待办是文字。若你想知道哪一件对应短畦，可以另放一个 `vector<int>`，下标和待办对齐：买笔不对应某一畦，用 0 占位；浇水对应 120；量中畦对应 80。0 在这里是「没有畦」，它会让 `if (beds[i])` 变成假。那是条件的规则，不是待办被删掉了。这一章的可运行例子不把 0 和文字塞进同一行输出，避免再开一条状态通道。你若要拒绝「没有畦」的项，沿用返回 0 或 1 的函数，成功才放入待办。不要因为 `min_element` 能找到最小整数，就把 0 这个占位当成最短的畦。

取舍是：保持写入次序，查询用算法的只读问题。`count`、`count_if`、`min_element`、`max_element` 都回答问题而不重排。排序会把「先做哪件」换成「哪个单词靠前」，还会在这个目标上链接失败。两份理由里，工单的理由更值得留在最后一章。链接失败换一个工具链可能会消失，农活的先后不会因为工具链换了就变成字母表。

类那一章的卡片也可以变成待办的元素：每件活一个名字、一个可选的厘米。可选在这份方言里不要用 `std::optional`。没有厘米时，用状态码或用一个单独的布尔成员表示「这件活不量地」。布尔成员为假时不要去读厘米。这和 `keep` 的约定相同，只是字段换成了成员。最后一章不再展开新的类，免得把已经分开的失败通道又合成一个什么都会做的类型。三件文字活已经够把次序说清。

单文件、无线程、无文件系统，这些边界到最后一章仍然在。待办活不过下一次点击。你不能把向量写进磁盘再在下一章打开。跨次运行的记忆只在围栏的 `stdin` 和源码的字面量里。所以 `buy pen`、`water`、`measure` 要写死在这一章，120、80、150 仍是那三条边，只是它们不再被排序、也不再被当成待办的文字。

待办的次序是一种数据，不是打印时的装饰。第一格先做，第二格后做。算法若按字典序重排，`measure` 会跑到 `water` 前面，因为 `m` 在 `w` 之前，而量中畦并不该早于浇水。查询「哪一条文字最小」可以另走 `min_element`，它只交出迭代器，不交换元素。把查询的结果和原次序印在相邻两行，就是为了让这两种需求同时可见。只印最小的那条，读者会以为向量已经被排过，因为结果碰巧看起来像排过之后的第一名。第二行的竖线序列否定了这种看法。

竖线本身不要写进待办的文字。若某一条农活的原文含有竖线，打印格式就和内容撞车，期望子串无法分辨格式和数据。三条英文都没有竖线，格式才站得住。换分隔符时，选一个数据里不会出现的字节。空格不行，因为 `buy pen` 内部已经有空格。换行可以，但换行会让期望跨越多行，读日志时仍清楚，只是子串要带上换行。竖线是为了让一行里看见三格。这是展示用的选择，不是待办类型的一部分。类型仍然是 `vector<string>`，元素里没有分隔符。

`count_if` 的门槛放在字节数上，和厘米的门槛 100 是两套单位。文字的 5 不是 5 厘米。把两套门槛写成同一个魔法数会让以后的修改伤到不该伤的那一边。所以厘米的 100 留在边长的向量里，文字的 5 留在字条的谓词里，两者不共用一个变量。共用变量看起来省事，类型却都是 `int`，编译器不会因为你把字节门槛拿去比厘米而失败。名字必须不同。`long_ones` 表示长字条的件数，不表示长畦的条数。

放入向量的时机也是失败通道的一部分。`getline` 失败时不 `push_back`。若先放一个空串再试图读，失败后向量里会留下那条空串，个数变成 1，后面的 `water` 和 `measure` 若仍放入，三格或四格里会有一格是空的。`min_element` 对空串的字典序往往把它当成最小，因为空串是其他字符串的前缀意义上的更小。你就会看见「最小的待办是空的」，而空来自失败的读取，不是来自木牌。先读、成功才放，空串就进不来。空白木牌是成功的空串，那一章把它印成 `空` 并返回，没有放进待办。待办这一章的围栏不是空白木牌，因此不处理那种成功的空。若要处理，应当在 `push_back` 之前拒绝空串，拒绝的方式仍是返回，而不是抛出。

增长时的搬家对迭代器的约束，在这份程序里用顺序来满足：所有 `push_back` 结束之后才调用 `min_element` 和 `count_if`。算法返回的迭代器只在打印的那一行使用，使用完就不再保存。若把迭代器放进一个变量，接着再 `push_back` 第四件，变量可能失效，再解引用就是未定义行为。练习里打印个数之前的第四次放入发生在任何迭代器诞生之前，所以安全。需要记住「字典序最小的那件」并且之后还要增长时，记住它的下标，或者把它的文字按值拷贝出来。拷贝不受搬家影响。引用和迭代器受影响。

课程停在这份清单上，是因为再往后就会重复已经付过的账：引用必须在初始化时绑上，0 在条件里为假，`substr` 要起点和长度，`size()` 对多字节文字是字节数，失败用返回值，比较的模板不要偷换意思，算法选择那些链得过的。待办把这些账收成一次运行里的三件活。它不排序，不是少做了最后一步，而是最后一步会同时破坏次序和链接。留下次序，就是留下这一天真正要做的事。

## 小结

待办的第一格是读入的 `buy pen`，后面是 `water` 和 `measure`，打印出来的次序是 `buy pen|water|measure`。`count_if` 数出字节数大于 5 的两件，向量个数仍是 3。`min_element` 能指出字典序最小的字条，第二行仍是原来的次序。

这些查询都不重排元素。排序既会打乱农活的先后，也会在这份链接线上要到 `__lttf2`。长度和失败继续走以前的约定：厘米用整数，拒绝用返回的状态，0 在条件里为假。课程在这一份不排序的清单上停住。

## 练习

先放入 `water`，再放入读到的 `buy pen`，最后放入 `measure`。字典序最小的仍是 `buy pen`，但第一格应当是 `water`。输出两行：第一行是最小的字条，第二行用竖线接出三格。期望至少要能匹配第二行 `water|buy pen|measure`，用来证明最小的那条没有被换到开头。

::: answer 参考答案：最小的不在第一格
```cpp run stdin="buy pen\n" expect="water|buy pen|measure" title="参考答案"
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) {
    std::cout << "失败\n";
    return 0;
  }
  std::vector<std::string> todos;
  todos.push_back("water");
  todos.push_back(line);
  todos.push_back("measure");
  std::vector<std::string>::iterator it = std::min_element(todos.begin(), todos.end());
  std::cout << *it << "\n";
  std::cout << todos[0] << "|" << todos[1] << "|" << todos[2] << "\n";
  return 0;
}
```
:::

在原来的三件之后再放入 `weed`，只打印个数。应当看到 4。不要按字母重排，也不要打印容量。

::: answer 参考答案：第四件
```cpp run stdin="buy pen\n" expect="4" title="参考答案"
#include <iostream>
#include <string>
#include <vector>
int main() {
  std::string line;
  if (!std::getline(std::cin, line)) {
    std::cout << "失败\n";
    return 0;
  }
  std::vector<std::string> todos;
  todos.push_back(line);
  todos.push_back("water");
  todos.push_back("measure");
  todos.push_back("weed");
  std::cout << todos.size() << "\n";
  return 0;
}
```
:::

延伸阅读只作链接。[LearnCpp](https://www.learncpp.com/) 版权保留，[cppreference 的 vector](https://en.cppreference.com/w/cpp/container/vector) 说明了 `push_back` 与次序。待办按写入顺序保留，查询用只读算法。
