// Yaegi WASI command: interpret one Go source file (package main + func main).
// Stdlib calls go through Yaegi's precompiled symbols into the wasip1 runtime,
// so fmt and os.Stdin use ordinary WASI stdout/stdin.
package main

import (
	"fmt"
	"os"

	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: yaegi <file>")
		os.Exit(2)
	}
	i := interp.New(interp.Options{
		Stdin:  os.Stdin,
		Stdout: os.Stdout,
		Stderr: os.Stderr,
		Args:   os.Args[1:],
	})
	if err := i.Use(stdlib.Symbols); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	if err := i.Use(interp.Symbols); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	if _, err := i.EvalPath(os.Args[1]); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
