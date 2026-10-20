---
language: js
chapter: 41
title: "TypeScript 待办列表"
level: advanced
minutes: 12
goals:
  - "添加一条未完成的待办"
  - "按序号切换完成"
  - "数出还没完成的条数"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

待办列表只放在内存数组里。没有按钮，也没有 localStorage。类型描述每一行有 title 和 done，转译后仍是普通对象。

### 添加以后长度是 1

add 推进一行，done 先是 false，并返回当前条数。放进 tea 以后，条数是 1。

```ts run expect="1" title="加一条"
type Row = { title: string; done: boolean };
function createList() {
  const rows: Row[] = [];
  return {
    add(title: string): number {
      rows.push({ title: title, done: false });
      return rows.length;
    },
  };
}
console.log(createList().add("tea"));
```

条数是 1。

### 切换第 0 条

toggle 把指定下标的 done 取反。tea 先是未完成，切换一次以后变成 true，打印 yes。

```ts run expect="yes" title="切换"
type Row = { title: string; done: boolean };
function createList() {
  const rows: Row[] = [];
  return {
    add(title: string): void {
      rows.push({ title: title, done: false });
    },
    toggle(index: number): void {
      rows[index].done = !rows[index].done;
    },
    isDone(index: number): boolean {
      return rows[index].done;
    },
  };
}
const list = createList();
list.add("tea");
list.toggle(0);
console.log(list.isDone(0) ? "yes" : "no");
```

完成后是 yes。

### 数还开着的条数

open 过滤 done 仍是 false 的行。两条里切换第 0 条，剩下 1 条开着。

```ts run expect="1" title="还开着"
type Row = { title: string; done: boolean };
function createList() {
  const rows: Row[] = [];
  return {
    add(title: string): void {
      rows.push({ title: title, done: false });
    },
    toggle(index: number): void {
      rows[index].done = !rows[index].done;
    },
    open(): number {
      return rows.filter(function (row) { return !row.done; }).length;
    },
  };
}
const list = createList();
list.add("tea");
list.add("bun");
list.toggle(0);
console.log(list.open());
```

还开着 1 条。

### 练习：清空已完成

keepOpen 留下未完成的行。tea 被切换成完成，bun 还开着，留下来的标题应是 bun。

```ts run expect="bun" title="留下未完成"
type Row = { title: string; done: boolean };
function createList() {
  const rows: Row[] = [];
  return {
    add(title: string): void {
      rows.push({ title: title, done: false });
    },
    toggle(index: number): void {
      rows[index].done = !rows[index].done;
    },
    keepOpen(): string {
      const left = rows.filter(function (row) { return !row.done; });
      return left[0].title;
    },
  };
}
const list = createList();
list.add("tea");
list.add("bun");
list.toggle(0);
console.log(list.keepOpen());
```

留下的标题是 bun。

### 界面书不搬待办示例

javascript.info 有待办界面的课，许可是 CC-BY-NC-SA，这里的列表没有页面：<https://javascript.info/> 。
