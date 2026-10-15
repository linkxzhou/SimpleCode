// The language books are hand-written essays in docs/.
// This generator used to stamp the same 常见错误 / 最佳实践 skeleton
// into every chapter. Running it would erase that prose, so it refuses.
console.error("docs/ is the source of the essays. Refusing to overwrite them from scripts/curriculum.");
process.exit(1);
