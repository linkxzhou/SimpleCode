---
language: js
chapter: 40
title: "TypeScript 工具类型"
level: advanced
minutes: 11
goals:
  - "用 Pick 只留下两字段"
  - "用 Partial 允许缺字段"
  - "用 ReturnType 记下函数的返回形状"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

工具类型在转译后也不存在。它们约束你写进编辑器的对象形状。运行时要自己把字段抄出来，或者自己补默认值。

### 名片只留名字和年龄

Pick 从 User 里选出 name 和 age。函数自己建一个新对象，不把 city 带出去。Ada 和 20 拼成 Ada20。

```ts run expect="Ada20" title="名片"
type User = { name: string; age: number; city: string };
type Card = Pick<User, "name" | "age">;
function card(user: User): Card {
  return { name: user.name, age: user.age };
}
const row = card({ name: "Ada", age: 20, city: "Ningbo" });
console.log(row.name + String(row.age));
```

名片是 Ada20。

### 缺的字段用默认值

Partial 让 title 和 done 都可以不写。fill 用 ?? 补上 note 和 false。只给 title 时，done 打印 false。

```ts run expect="false" title="补默认"
type Draft = { title: string; done: boolean };
function fill(part: Partial<Draft>): Draft {
  return { title: part.title ?? "note", done: part.done ?? false };
}
console.log(fill({ title: "tea" }).done);
```

done 是 false。

### 返回值的形状跟着函数走

ReturnType 取出 pair 的返回类型。pair(3) 实际返回的对象有 n。打印 n 得到 3。类型别名不参与这行打印。

```ts run expect="3" title="返回形状"
function pair(n: number) {
  return { n: n, label: "row" };
}
type Row = ReturnType<typeof pair>;
const row: Row = pair(3);
console.log(row.n);
```

字段 n 是 3。

### 练习：Readonly 以后仍然读得到

把 name 标成 Readonly。运行时没有真正锁住赋值，但这一段只读 name，应打印 elm。

```ts run expect="elm" title="只读名字"
type Tree = { name: string };
function show(tree: Readonly<Tree>): string {
  return tree.name;
}
console.log(show({ name: "elm" }));
```

名字是 elm。

### 手册的工具类型表

工具类型的表在 TypeScript 手册，CC-BY-4.0：<https://www.typescriptlang.org/docs/handbook/intro.html> 。
