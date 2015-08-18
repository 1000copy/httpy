var Readable = require('stream').Readable;
var util = require('util');

var HTTPParser = require('./http_parser').HTTPParser

function IncomingMessage() {
  this.buffers= []
  Readable.call(this);
  this.parser = new HTTPParser(HTTPParser.REQUEST); 
  var parser = this.parser 
  parser[HTTPParser.kOnHeaders] = this.onHeaders.bind(this)
  parser[HTTPParser.kOnHeadersComplete] = this.onheadercomplete.bind(this)
  // 这个地方太关键了.只有这样，this指向才是IncomingMessage,而不是onbody本身
  //  this.onbody.bind(this) vs. onbody
  parser[HTTPParser.kOnBody] = this.onbody.bind(this) 
  parser[HTTPParser.kOnMessageComplete] = this.oncompleted.bind(this)
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
    // console.log("onHeaders",headers)

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
  var s = b.slice(start,start+len)
  this.buffers.push(s)
};
IncomingMessage.prototype._read = function(){
  while(this.buffers && (this.buffers.length >0))
    if (this.push(this.buffers.shift())==false)
      break;
}
IncomingMessage.prototype.oncompleted = function() {
    // console.log("oncompleted")
    // this.push(null)
    // this.push(null)
};
IncomingMessage.prototype.execute = function(buffer) {
  console.log("BODY:",this.buffers)
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
  msg.on("data",function(data){
    console.log(data.toString("utf-8"))
  })
  
  msg.execute(request)
})();




