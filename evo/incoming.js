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

_renderHeaders = function() {
  if (this._header) {
    throw new Error('Can\'t render headers after they are sent to the client.');
  }

  if (!this._headers) return {};

  var headers = {};
  var keys = Object.keys(this._headers);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    headers[this._headerNames[key]] = this._headers[key];
  }
  return headers;
};

IncomingMessage.prototype.gateway = function(headers) {
  var r = {};
  for (var i = 0;i < headers.length; i+=2) {
    var key = headers[i];
    var value = headers[i+1];
    r[key] = value;
  }
  return r;
}
IncomingMessage.prototype.onheadercomplete = function(info) {
  this.headers = this.gateway(info.headers)
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




