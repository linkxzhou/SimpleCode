export const samples: Record<string, string> = {
  python: `name = input("What's your name? ")
print(f"Hello, {name}! 👋")

squares = [n * n for n in range(1, 6)]
print("Squares:", squares)
`,
  ruby: `print "What's your name? "
name = gets.to_s.strip
puts "Hello, #{name}!"

puts (1..5).map { |n| n * n }.inspect
`,
  "quickjs:js": `const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

console.log("Hello from JS!");
console.log("fib(20) =", fib(20));
console.log([1, 2, 3].map((x) => x * 2));
`,
  "quickjs:ts": `interface Greeting {
  name: string;
  n: number;
}

function fib(n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

const hello: Greeting = { name: "TypeScript", n: 20 };
console.log(\`Hello from \${hello.name}!\`);
console.log("fib(20) =", fib(hello.n));
`,
  sqlite: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);
INSERT INTO users (name, age) VALUES ('Ada', 36), ('Linus', 28), ('Grace', 45);

.mode box
SELECT name, age FROM users WHERE age > 30 ORDER BY age DESC;
`,
  clang: `#include <stdio.h>

int main(void) {
    char name[64];
    printf("What's your name? ");
    fflush(stdout);
    if (scanf("%63s", name) == 1) {
        printf("Hello, %s!\\n", name);
    }
    return 0;
}
`,
  clangpp: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> langs = {"Python", "Ruby", "C++"};
    for (const auto& l : langs) {
        std::cout << "Hello, " << l << "!" << std::endl;
    }
    return 0;
}
`,
  "php-cgi": `<?php
$name = "World";
echo "Hello, $name!\\n";

$squares = array_map(fn($n) => $n * $n, range(1, 5));
echo implode(", ", $squares) . "\\n";
`,
  lua: `io.write("What's your name? ")
io.flush()
local name = io.read("*l") or ""
print(string.format("Hello, %s!", name))

local squares = {}
for n = 1, 5 do
  squares[#squares + 1] = tostring(n * n)
end
print(table.concat(squares, ", "))

local ok, err = pcall(function() error("boom") end)
print(ok and "pcall missed the error" or ("pcall caught: " .. tostring(err)))
`,
  go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	fmt.Print("What's your name? ")
	in := bufio.NewReader(os.Stdin)
	name, _ := in.ReadString('\\n')
	fmt.Printf("Hello, %s!\\n", strings.TrimSpace(name))

	squares := make([]int, 0, 5)
	for n := 1; n <= 5; n++ {
		squares = append(squares, n*n)
	}
	fmt.Println(squares)
}
`,
  shell: `printf "What's your name? "
read name
printf "Hello, %s!\\n" "$name"

echo "builtin pipe" | cat
echo "squares:"
for n in 1 2 3 4 5; do
  echo "$n"
done
`,
  linux: `echo "Hello from Linux"
ls --color=never -1 / | head -n 4
printf '%s\\n' 甲 乙 | grep 乙
`,
};
