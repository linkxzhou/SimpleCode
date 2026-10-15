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
  quickjs: `const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

console.log("Hello from QuickJS!");
console.log("fib(20) =", fib(20));
console.log([1, 2, 3].map((x) => x * 2));
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
};
