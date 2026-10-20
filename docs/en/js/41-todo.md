---
language: js
chapter: 41
title: "TypeScript Todo List"
level: advanced
minutes: 12
goals:
  - "Add one todo that is not done"
  - "Toggle done by index"
  - "Count the rows that are not done"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

The todo list lives in an in-memory array. There is no button and no localStorage. The type says each row has title and done, and after transpile it is still a plain object.

### Adding makes the length 1

add pushes one row, done starts as false, and the method returns the current count. After tea is stored, the count is 1.

```ts run expect="1" title="Add one"
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

The count is 1.

### Toggle index 0

toggle flips done at the given index. tea starts not done, and one toggle makes it true, so the sample prints yes.

```ts run expect="yes" title="Toggle"
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

After the toggle, the line is yes.

### Count the rows still open

open filters rows whose done is still false. Of two rows, toggling index 0 leaves 1 open.

```ts run expect="1" title="Still open"
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

1 row is still open.

### Exercise: drop the finished rows

keepOpen keeps rows that are not done. tea is toggled to done, bun stays open, and the remaining title should be bun.

```ts run expect="bun" title="Keep the open row"
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

The remaining title is bun.

### The interface book is not a source of the todo sample

javascript.info has a todo-interface lesson under CC-BY-NC-SA. The list here has no page: <https://javascript.info/>.
