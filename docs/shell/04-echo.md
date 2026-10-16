---
language: shell
chapter: 4
title: "Shell echo 命令"
level: beginner
minutes: 8
goals:
  - "用 echo 打出几个词"
  - "用 -n 去掉末尾换行"
  - "知道词与词之间有空格"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`echo` 适合原样打出几个词。需要控制格式时改用 `printf`。

### 几个词

参数之间会插入一个空格。

```sh run expect="first second" title="中间有空格"
echo first second
```

输出里能看到 `first second`。

### 不换行

`-n` 去掉末尾的换行。后面再补一个换行，方便看清。

```sh run expect="firstsecond" title="接在下一行前"
echo -n first
echo second
```

输出里能看到 `firstsecond`。

### 一个词

只有一个参数时，不会多出空格。

```sh run expect="tea" title="一个词"
echo tea
```

输出里能看到 `tea`。
