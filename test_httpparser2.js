// var common = require('../common');
var assert = require('assert');

// var HTTPParser = process.binding('http_parser').HTTPParser;
var HTTPParser = require('./http_parser').HTTPParser;

var CRLF = '\r\n';
var REQUEST = HTTPParser.REQUEST;
var RESPONSE = HTTPParser.RESPONSE;

var methods = HTTPParser.methods;

var kOnHeaders = HTTPParser.kOnHeaders | 0;
var kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
var kOnBody = HTTPParser.kOnBody | 0;
var kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;


function newParser(type) {
  var parser = new HTTPParser(type);

  parser.headers = [];
  parser.url = '';

  parser[kOnHeaders] = function(headers, url) {
    parser.headers = parser.headers.concat(headers);
    parser.url += url;
  };

  parser[kOnHeadersComplete] = function(info) {
  };

  parser[kOnBody] = function(b, start, len) {
    // assert.ok(false, 'Function should not be called.');
  };

  parser[kOnMessageComplete] = function() {
  };

  return parser;
}
// info.headers and info.url are set only if .onHeaders()
// has not been called for this request.

function mustCall(f, times) {
  var actual = 0;

  process.setMaxListeners(256);
  process.on('exit', function() {
    assert.equal(actual, times || 1);
  });

  return function() {
    actual++;
    return f.apply(this, Array.prototype.slice.call(arguments));
  };
}

// // test onHeaders vs. onHeadersCompleted

// (function() {
//   var request = Buffer(
//       'POST /it HTTP/1.1' + CRLF +
//       'Transfer-Encoding: chunked' + CRLF +
//       CRLF +
//       '4' + CRLF +
//       'ping' + CRLF +
//       '3' + CRLF +
//       'pon' + CRLF +
//       '0' + CRLF +
//       'Vary: *' + CRLF +
//       'Content-Type: text/plain' + CRLF +
//       CRLF);

//   var seen_body = false;

//   function onHeaders(headers, url) {
//     assert.ok(seen_body); // trailers should come after the body
//     assert.deepEqual(headers,
//         ['Vary', '*', 'Content-Type', 'text/plain']);
//   }
//   function onHeaders1(headers, url) {
//     console.log(headers)
//     console.log(url)
//   }
//   var parser = newParser(REQUEST);
//   parser[kOnHeaders] = onHeaders1;
//   // parser[kOnHeadersComplete] = mustCall(function(info) {
//   //   assert.equal(info.method, methods.indexOf('POST'));
//   //   assert.equal(info.url || parser.url, '/it');
//   //   assert.equal(info.versionMajor, 1);
//   //   assert.equal(info.versionMinor, 1);
//   //   // expect to see trailing headers now
//   //   // parser[kOnHeaders] = mustCall(onHeaders);
//   // });

//   // parser[kOnBody] = mustCall(function(buf, start, len) {
//   //   var body = '' + buf.slice(start, start + len);
//   //   if (len==4)
//   //     assert.equal(body, 'ping');
//   //   else
//   //     assert.equal(body, 'pon');
//   //   seen_body = true;
//   // },2);

//   parser.execute(request, 0, request.length);
// })();


(function() {
  var request = Buffer(
      'POST /it HTTP/1.1' + CRLF +
      'k1: v1' + CRLF+ CRLF );

  function onHeaders(headers, url) {
    console.log("headers")
  }

  var parser = newParser(REQUEST);
  
  parser[kOnHeaders] =onHeaders;
  parser[kOnHeadersComplete] = mustCall(function(info) {
    console.log(info.headers)
    assert.equal(info.method, methods.indexOf('POST'));
    assert.equal(info.url || parser.url, '/it');
    assert.equal(info.versionMajor, 1);
    assert.equal(info.versionMinor, 1);
    // expect to see trailing headers now
    // parser[kOnHeaders] = mustCall(onHeaders);
  });
  parser.execute(request, 0, request.length);
    var request = Buffer(
      'ab'+ CRLF +
      'k2: v2' + CRLF + CRLF +
      'k3: v3' + CRLF +
      CRLF);
  parser.execute(request,0,request.length)
})();




