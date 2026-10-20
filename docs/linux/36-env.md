---
language: linux
chapter: 36
title: "Linux 环境变量"
level: intermediate
minutes: 8
goals:
  - "导出 SKU 后再读出来"
  - "unset 之后用默认值 none"
  - "用 env 看到 SKU=tea"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

赋值只留在当前壳。export 之后，子命令才能从环境里看见它。unset 删掉变量。${SKU:-none} 在变量为空时换成 none。

### 导出的 SKU 是 tea

SKU=tea 然后 export。printf 读 $SKU，打出 tea。

```linux run expect="tea" title="读出 tea"
SKU=tea
export SKU
printf '%s\n' "$SKU"
```

### env 里有 SKU=tea

导出之后用 env 配合 grep 只留 SKU 这一行。输出是 SKU=tea。

```linux run expect="SKU=tea" title="环境里的一行"
SKU=tea
export SKU
env | grep '^SKU='
```

### 删掉之后打印 none

unset SKU 之后变量为空。${SKU:-none} 换成 none。

```linux run expect="none" title="回到 none"
SKU=tea
unset SKU
printf '%s\n' "${SKU:-none}"
```

### 没有 export 时子命令看不见

只赋值 SKU=tea，不 export。sh -c 是子壳，它读到的是空，于是打印 child-none。

```linux run expect="child-none" title="子壳看不见"
SKU=tea
sh -c 'echo child-${SKU:-none}'
```
