---
language: ruby
chapter: 21
title: "Ruby JSON"
level: beginner
minutes: 8
goals:
  - "Parse text into a hash"
  - "Write a hash out as text"
  - "Catch damaged text"
sources:
  - lxiy-ruby
updated: "2026-10-16"
---

`json` belongs to the standard library. A key in JSON text must use double quotes. `JSON.parse` reads that text, and `JSON.generate` writes it back out.

### Parse

`JSON.parse` returns a hash. A string key then pulls a number out of it. The source is a one-key object, and the value under `"n"` is 3.

```ruby run expect="3" title="Read the number"
require "json"
puts JSON.parse("{\"n\":3}")["n"]
```

The printed line is `3`.

### Generate

`JSON.generate` returns a string of JSON. Parsing that string again recovers the original number. The hash uses a string key so the JSON key matches.

```ruby run expect="3" title="Write then read"
require "json"
text = JSON.generate({ "n" => 3 })
puts JSON.parse(text)["n"]
```

The printed line is `3`.

### Damaged text

A missing closing brace makes the parse fail. Rescue `JSON::ParserError` for that case. The success line inside `begin` does not run.

```ruby run expect="broken" title="Parse failure"
require "json"
begin
  JSON.parse("{")
  puts "passed"
rescue JSON::ParserError
  puts "broken"
end
```

The printed line is `broken`.
