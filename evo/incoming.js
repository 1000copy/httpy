// exports.IncomingMessage = IncomingMessage
module.exports = IncomingMessage
var Readable = require('stream').Readable;
var EE = require("events").EventEmitter
var util = require('util');

var HTTPParser = require('./http_parser').HTTPParser

function IncomingMessage() {

  Readable.call(this)
  this.buffers= []
  Readable.call(this);
  this.parser = new HTTPParser(HTTPParser.REQUEST); 
  var parser = this.parser 
  // console.log(this)
  parser[HTTPParser.kOnTrailers] = this.onTrailer.bind(this)
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
}

util.inherits(IncomingMessage, Readable);
IncomingMessage.prototype.onTrailer =  function(headers, url) {
    this.headers = this.headers.concat(headers);
    this.url += url;
    this.emit("trailer",headers)
};

IncomingMessage.prototype.onheadercomplete = function(info) {
  this.headers = info.headers
  this.upgrade = info.upgrade
  this.method = info.method = HTTPParser.methods[info.method]
  this.url = info.url
  this.versionMajor= info.versionMajor
  this.versionMinor= info.versionMinor 
  this.shouldKeepAlive = info.shouldKeepAlive
  this.emit("header",info)
};

IncomingMessage.prototype.onbody = function(b, start, len) {
  var s = b.slice(start,start+len)
  this.push(s)
};
IncomingMessage.prototype._read = function(){
}
IncomingMessage.prototype.oncompleted = function() {
    this.push(null)
};
IncomingMessage.prototype.execute = function(buffer) {
  this.parser.execute(buffer,0,buffer.length)
};




