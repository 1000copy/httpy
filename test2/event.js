var EventEmitter = require("events").EventEmitter
var assert =  require("assert")

var ev = new EventEmitter()

assert.ok(!ev.emit("data","eventname"))

ev.on("data",function(d){
	assert.ok("eventname"===d)
})

assert.ok(ev.emit("data","eventname"))

// Returns true if event had listeners, false otherwise.