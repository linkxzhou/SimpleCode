---
language: ruby
chapter: 26
title: "Ruby mixins"
level: intermediate
minutes: 8
goals:
  - "Mix in a label method with include"
  - "Compare milliliters with Comparable"
  - "Sort by milliliters and take the smallest"
sources:
  - lxiy-ruby
updated: "2026-10-20"
---

include mixes a module into a class. Comparable only requires <=>. Sorting calls that method repeatedly.

### After the mixin sku is tea

Label defines sku. After Cup includes that module, an instance can call sku and the line is tea.

```ruby run expect="tea" title="Mixin tea"
module Label
  def sku
    "tea"
  end
end
class Cup
  include Label
end
puts Cup.new.sku
```

### 3 milliliters is less than 5

<=> compares ml. 3 < 5 is true, so puts prints true. The comparison operator comes from Comparable.

```ruby run expect="true" title="3 is under 5"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
puts Cup.new(3) < Cup.new(5)
```

### The smallest after sorting is 1

The three cups hold 5, 1, and 3 milliliters. sort orders them with <=>, and the first ml is 1.

```ruby run expect="1" title="Smallest is 1"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
cups = [Cup.new(5), Cup.new(1), Cup.new(3)]
puts cups.sort.first.ml
```

### Equal milliliters print true

Both cups hold 4 milliliters. == from Comparable checks whether <=> is 0, so the line is true.

```ruby run expect="true" title="Same milliliters"
class Cup
  include Comparable
  attr_reader :ml
  def initialize(ml)
    @ml = ml
  end
  def <=>(other)
    ml <=> other.ml
  end
end
puts Cup.new(4) == Cup.new(4)
```
