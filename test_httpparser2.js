var assert = require('assert');
var HTTPParser = require('./http_parser').HTTPParser
var REQUEST = HTTPParser.REQUEST;
var methods = HTTPParser.methods;

var kOnHeaders = HTTPParser.kOnHeaders | 0;
var kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
var kOnBody = HTTPParser.kOnBody | 0;
var kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;

var im = IncomingMessage.prototype 
function IncomingMessage() {
  this.parser = new HTTPParser(HTTPParser.REQUEST); 
  var parser = this.parser 
  parser[kOnHeaders] = this.onHeaders
  parser[kOnHeadersComplete] = this.onheadercomplete
  parser[kOnBody] = this.onbody 
  parser[kOnMessageComplete] = this.oncompleted   
  // property
  this.headers = [];//: [ 'k1', 'v1' ],
  this.upgrade = false//: false,
  this.method = ""//: 3,
  this.url = ""//: '/it',
  this.versionMajor= 1//: 1,
  this.versionMinor=1 //: 1,
  this.shouldKeepAlive = false//: true 
}
im.onHeaders =  function(headers, url) {
    // parser.headers = parser.headers.concat(headers);
    // parser.url += url;
    console.log("onHeaders",headers)
};

im.onheadercomplete = function(info) {
  this.headers = info.headers
  this.upgrade = info.upgrade
  this.method = info.method = HTTPParser.methods[info.method]
  this.url = info.url
  this.versionMajor= info.versionMajor
  this.versionMinor= info.versionMinor 
  this.shouldKeepAlive = info.shouldKeepAlive
  // console.log("kOnHeadersComplete",info)
};

im.onbody = function(b, start, len) {
  // this.emit("chunk",b.slice(start,len))
  console.log("BODY:")
  var s = b.slice(start,start+len)
  // console.log(b.toString())
  console.log(s.toString())
  // console.log(start,len)

};

im.oncompleted = function() {
    console.log("oncompleted")
};
im.execute = function(buffer) {
  this.parser.execute(buffer,0,buffer.length)
};


var CRLF = '\r\n';


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
  var msg = new IncomingMessage();
  msg.execute(request)
})();




