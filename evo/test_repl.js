
function Foo(){
	this.bar = 10
}
var repl = require("repl");

var replServer = repl.start({
  prompt: "my-app > ",
});

replServer.context.Foo = Foo

/*
λ node test_repl.js
my-app > Foo
Foo
[Function: Foo]
my-app > a = new Foo()
{ bar: 10 }
my-app > a.bar
10
my-app > a.bar =11
11
my-app > a
{ bar: 11 }
my-app >
*/