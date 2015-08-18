var Readable = require('stream').Readable;
var util = require('util');
function IncomingMessage() {
  Readable.call(this)
}

util.inherits(IncomingMessage, Readable);
IncomingMessage.prototype._read = function(){
  // this.push("abc")
  // this.push(null)
  this.push(this.buffers.shift())
}
var assert = require('assert');


(function() {
  var msg = new IncomingMessage()
  msg.buffers = []
  var buffers = msg.buffers
  buffers.push("AAA")
  buffers.push("BBB")
  msg.on("data",function(d){
    console.log(d.toString())
  })
})();




