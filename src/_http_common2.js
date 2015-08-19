// This is a free list to avoid creating so many of the same object.
FreeList = function(name, max, constructor) {
  this.name = name;
  this.constructor = constructor;
  this.max = max;
  this.list = [];
};


FreeList.prototype.alloc = function() {
  // debugparser("alloc " + this.name + " " + this.list.length);
  return this.list.length ? this.list.shift() :
                            this.constructor.apply(this, arguments);
};

FreeList.prototype.free = function(obj) {
  // debugparser("free " + this.name + " " + this.list.length);
  if (this.list.length < this.max) {
    this.list.push(obj);
  }
};


var HTTPParser = require('./http_parser').HTTPParser;
var incoming = require('./_http_incoming2');
var IncomingMessage = incoming.IncomingMessage;
var readStart = incoming.readStart;
var readStop = incoming.readStop;

var isNumber = require('util').isNumber;
var debug = require('util').debuglog('http');
var debugparser = require('util').debuglog('parser');

var kOnHeaders = HTTPParser.kOnHeaders | 0;
var kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
var kOnBody = HTTPParser.kOnBody | 0;
var kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;
//  kOnHeadersComplete vs. kOnHeaders
//  后面的仅仅用于trailers !至少在http-parser的javascript版本
// 2. tested oK:This method is also called to process trailing HTTP headers.
function kOnTrailers(headers, url) {
  // Once we exceeded headers limit - stop collecting them
  if (this.maxHeaderPairs <= 0 ||
      this._headers.length < this.maxHeaderPairs) {
    this._headers = this._headers.concat(headers);
  }
  this._url += url;
}

function parserOnHeadersComplete(info) {
  // debugparser('parserOnHeadersComplete', info);
  var parser = this;
  parser.incoming = new IncomingMessage(parser.socket);
  parser.incoming.init(parser,info)
  // response to HEAD or CONNECT
  var skipBody = false; 

  if (!info.upgrade) {
    // For upgraded connections and CONNECT method request,
    // we'll emit this after parser.execute
    // so that we can capture the first part of the new protocol 
    skipBody = parser.onIncoming(parser.incoming, info.shouldKeepAlive);
  }

  return skipBody;
}

// XXX This is a mess.
// TODO: http.Parser should be a Writable emits request/response events.
function parserOnBody(b, start, len) {
  // debugparser("parserOnBody",b.toString("utf-8"),start,len)
  var parser = this;
  var stream = parser.incoming;

  // if the stream has already been removed, then drop it.
  if (!stream)
    return;

  var socket = stream.socket;

  // pretend this was the result of a stream._read call.
  if (len > 0 && !stream._dumped) {
    var slice = b.slice(start, start + len);
    var ret = stream.push(slice);
    if (!ret)
      readStop(socket);
  }
}

function parserOnMessageComplete() {
  var parser = this;
  var stream = parser.incoming;

  if (stream) {
    stream.complete = true;
    // Emit any trailing headers.
    var headers = parser._headers;
    if (headers) {
      parser.incoming._addHeaderLines(headers, headers.length);
      parser._headers = [];
      parser._url = '';
    }

    if (!stream.upgrade)
      // For upgraded connections, also emit this after parser.execute
      stream.push(null);
  }

  if (stream && !parser.incoming._pendings.length) {
    // For emit end event
    stream.push(null);
  }

  // force to read the next incoming message
  readStart(parser.socket);
}


var parsers = new FreeList('parsers', 1000, function() {
  var parser = new HTTPParser(HTTPParser.REQUEST);

  parser._headers = [];
  parser._url = '';

  // Only called in the slow case where slow means
  // that the request headers were either fragmented
  // across multiple TCP packets or too large to be
  // processed in a single run. This method is also
  // called to process trailing HTTP headers.
  parser[kOnHeaders] = kOnTrailers;
  parser[kOnHeadersComplete] = parserOnHeadersComplete;
  parser[kOnBody] = parserOnBody;
  parser[kOnMessageComplete] = parserOnMessageComplete;
  // debug("parserparserparser",parser)
  return parser;
});


// Free the parser and also break any links that it
// might have to any other things.
// TODO: All parser data should be attached to a
// single object, so that it can be easily cleaned
// up by doing `parser.data = {}`, which should
// be done in FreeList.free.  `parsers.free(parser)`
// should be all that is needed.
function freeParser(parser, req) {
  if (parser) {
    parser._headers = [];
    parser.onIncoming = null;
    if (parser.socket)
      parser.socket.parser = null;
    parser.socket = null;
    parser.incoming = null;
    parsers.free(parser);
    parser = null;
  }
  if (req) {
    req.parser = null;
  }
}


function ondrain() {
  if (this._httpMessage) this._httpMessage.emit('drain');
}


function httpSocketSetup(socket) {
  socket.removeListener('drain', ondrain);
  socket.on('drain', ondrain);
}
exports.httpSocketSetup = httpSocketSetup;
exports.freeParser = freeParser;
exports.parsers = parsers;
exports.debug = debug;
exports.debugparser = debugparser;
exports.CRLF = '\r\n';
exports.chunkExpression = /chunk/i;
exports.continueExpression = /100-continue/i;
exports.methods = HTTPParser.methods;
