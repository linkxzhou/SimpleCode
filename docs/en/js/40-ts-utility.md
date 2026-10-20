---
language: js
chapter: 40
title: "TypeScript Utility Types"
level: advanced
minutes: 11
goals:
  - "Keep two fields with Pick"
  - "Allow missing fields with Partial"
  - "Remember a function return shape with ReturnType"
sources:
  - mdn-js
  - ts-handbook
  - lxiy-js
updated: "2026-10-20"
---

Utility types do not exist after transpile either. They constrain the object shape you write in the editor. At runtime you copy the fields yourself, or you fill in defaults yourself.

### A card keeps only name and age

Pick selects name and age from User. The function builds a new object and does not carry city out. Ada and 20 join into Ada20.

```ts run expect="Ada20" title="Card"
type User = { name: string; age: number; city: string };
type Card = Pick<User, "name" | "age">;
function card(user: User): Card {
  return { name: user.name, age: user.age };
}
const row = card({ name: "Ada", age: 20, city: "Ningbo" });
console.log(row.name + String(row.age));
```

The card prints Ada20.

### Missing fields take defaults

Partial lets both title and done be omitted. fill fills note and false with ??. When only title is passed, done prints false.

```ts run expect="false" title="Fill defaults"
type Draft = { title: string; done: boolean };
function fill(part: Partial<Draft>): Draft {
  return { title: part.title ?? "note", done: part.done ?? false };
}
console.log(fill({ title: "tea" }).done);
```

done is false.

### The return shape follows the function

ReturnType takes the return type of pair. pair(3) really returns an object with n. Printing n yields 3. The type alias does not take part in that print.

```ts run expect="3" title="Return shape"
function pair(n: number) {
  return { n: n, label: "row" };
}
type Row = ReturnType<typeof pair>;
const row: Row = pair(3);
console.log(row.n);
```

Field n is 3.

### Exercise: Readonly can still be read

Mark name as Readonly. Runtime does not actually lock assignment, but this block only reads name and should print elm.

```ts run expect="elm" title="Readonly name"
type Tree = { name: string };
function show(tree: Readonly<Tree>): string {
  return tree.name;
}
console.log(show({ name: "elm" }));
```

The name is elm.

### The handbook utility-type table

The utility-type table is in the TypeScript handbook, CC-BY-4.0: <https://www.typescriptlang.org/docs/handbook/intro.html>.
