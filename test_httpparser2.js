var Readable = require('stream').Readable;
var util = require('util');

var HTTPParser = require('./http_parser').HTTPParser



function IncomingMessage() {
  Readable.call(this);
  this.parser = new HTTPParser(HTTPParser.REQUEST); 
  var parser = this.parser 
  parser[HTTPParser.kOnHeaders] = this.onHeaders
  parser[HTTPParser.kOnHeadersComplete] = this.onheadercomplete
  parser[HTTPParser.kOnBody] = this.onbody 
  parser[HTTPParser.kOnMessageComplete] = this.oncompleted   
  // property
  this.headers = [];//: [ 'k1', 'v1' ],
  this.upgrade = false//: false,
  this.method = ""//: 3,
  this.url = ""//: '/it',
  this.versionMajor= 1//: 1,
  this.versionMinor=1 //: 1,
  this.shouldKeepAlive = false//: true 
  var self = this 
}

util.inherits(IncomingMessage, Readable);
// var im = IncomingMessage.prototype 
IncomingMessage.prototype.onHeaders =  function(headers, url) {
    // parser.headers = parser.headers.concat(headers);
    // parser.url += url;
    console.log("onHeaders",headers)
};

IncomingMessage.prototype.onheadercomplete = function(info) {
  this.headers = info.headers
  this.upgrade = info.upgrade
  this.method = info.method = HTTPParser.methods[info.method]
  this.url = info.url
  this.versionMajor= info.versionMajor
  this.versionMinor= info.versionMinor 
  this.shouldKeepAlive = info.shouldKeepAlive
  // console.log("kOnHeadersComplete",info)
};

IncomingMessage.prototype.onbody = function(b, start, len) {
  // this.emit("chunk",b.slice(start,len))
  // console.log("BODY:")
  var s = b.slice(start,start+len)
  // 在何处push？1
  if (!this.buffer)
    {this.buffer = []}
  this.buffer.push(s)
  // console.log(this.buffer.length,this.buffer)
  // this.push(s)
  // console.log(b.toString())
  // console.log(s.toString())

  // console.log(start,len)

};
IncomingMessage.prototype._read = function(){
  // this.
  // 在何处push？2
  console.log("read___",this.buffer)
  while(this.buffer && (this.buffer.length >0))
    if (this.push(this.buffer.shift())==false)
      break;
  // if (this.buffer && this.buffer.length==0)
  //   this.push(null)
}
IncomingMessage.prototype.oncompleted = function() {
    console.log("oncompleted")
    // this.push(null)
    // this.push(null)
};
IncomingMessage.prototype.execute = function(buffer) {
  this.parser.execute(buffer,0,buffer.length)
};


var CRLF = '\r\n';
var assert = require('assert');


(function() {
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
  var msg = new IncomingMessage()
  // msg.on("Readable",function(data){
  //   console.log(data)
  // })
  
  msg.execute(request)
  // console.log("---------",msg.buffer)
  // console.log("---------")
  // msg.pipe(process.stdout)
  // console.log(msg.read())
})();




