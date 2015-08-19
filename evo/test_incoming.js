var i = require("./incoming.js")
var k = new i()
function test() {
  var CRLF = '\r\n';
  var assert = require('assert');
  var request = Buffer(
      'POST /it HTTP/1.1' + CRLF +
      'Transfer-Encoding: chunked' + CRLF +
      CRLF +
      '4' + CRLF +
      'ping' + CRLF +
      '3' + CRLF +
      'pon' + CRLF +
      '0' + CRLF +
      'Vary: *' + CRLF +
      'Content-Type: text/plain' + CRLF +
      CRLF);
  var msg = k
  msg.on("header",function(header){
    console.log(header)
  })
  msg.on("data",function(data){
    console.log("chunked:",data.toString("utf-8"))
  })
  msg.on("trailer",function(trailer){
    console.log(trailer)
  })
  msg.on("end",function(trailer){
    console.log("end..")
  })
  msg.execute(request)
}
test()