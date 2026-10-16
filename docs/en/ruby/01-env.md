---
language: ruby
chapter: 1
title: "Ruby Environment"
level: beginner
minutes: 8
goals:
  - "Separate this page from a local install"
  - "Treat the interpreter as already ready"
  - "Use only libraries that ship with Ruby"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

A local install looks different on Linux and on Windows. Here the interpreter is already present, so you do not choose an installer. The samples use only what that Ruby already includes.

### Run the current file

Press Run and the editor text executes at once. No package is downloaded first. The string in the program is the line you will see.

```ruby run expect="已就绪" title="No install"
puts "已就绪"
```

The printed line is `已就绪`.

### Command-line flags are not source

`ruby -v` is a flag you pass when starting the interpreter. Placed inside a source file, it is not a version query. Leave the line unread.

```ruby norun title="Not a statement"
ruby -v
```

### Require the standard library

`stringio` ships with Ruby, so there is nothing to download. `StringIO` keeps text in memory. `write` stores the characters, and `string` reads them back.

```ruby run expect="茶" title="In-memory buffer"
require "stringio"
b = StringIO.new
b.write("茶")
puts b.string
```

The printed line is `茶`.
