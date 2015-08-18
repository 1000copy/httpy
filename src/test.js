var a = 
`HTTP/1.1 201 OK
Connection: close
Transfer-Encoding: chunked

6
echo_1
6
echo_2
6
echo_4
0`

var common ={}
common.PORT = 8011
// ccc()
b()
function b(){
  var http = require('http');
  // var httpy = require('./httpy2');
  var server = createServer(function(socket) {
      socket.on("data",function(data){
        // socket.write(new Buffer(a));
        socket.write(a);
      })        
      
      // socket.write(a)
      // // socket.write("chunk2")
      // // socket.write("chunk3")
      // socket.end(a,"utf-8");
      

    }).listen(8011,req);
    console.log('Server started 8011' );

    function req(){
      
      var req = http.request({
        host: 'localhost',
        port: common.PORT,
        method: 'POST',
        path: '/'
      },function(res){
          var bodyChunks = [];
        res.on('data', function(chunk) {
          bodyChunks.push(chunk);        
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);        
          console.log( body.toString());
        })
    }).on('error', function(e) {
        console.log(e.message);
      })
      req.write("chunk1")
      req.write("chunk2")
      req.write("chunk3")
      req.end();
    }
  function createServer(connectionListener){
    var net = require('net');
    var server = net.createServer(connectionListener);
    return server
  }

}
function ccc(){
  // var a = "HTTP/1.1  200 OK\r\n"
  var HTTPParser = require("./http_parser.js").HTTPParser
  var parser = new HTTPParser(HTTPParser.RESPONSE); 
  // var parser = new HTTPParser(HTTPParser.REQUEST); 
  // 
    
  onHeaders =  function(headers, url) {
    // console.log("1")
      // parser.headers = parser.headers.concat(headers);
      // parser.url += url;
      console.log("onHeaders",headers)

  };

  onheadercomplete = function(info) {
    // console.log("1")
    this.headers = info.headers
    this.upgrade = info.upgrade
    this.method = info.method = HTTPParser.methods[info.method]
    this.url = info.url
    this.versionMajor= info.versionMajor
    this.versionMinor= info.versionMinor 
    this.shouldKeepAlive = info.shouldKeepAlive
    console.log("kOnHeadersComplete",info)
  };

  onbody = function(b, start, len) {
    
    var s = b.slice(start,start+len)
    console.log(s.toString("utf-8"))
  };
  oncompleted = function() {
    console.log("3")
      // console.log("oncompleted")
      // this.push(null)
      // this.push(null)
  };

  parser[HTTPParser.kOnHeadersComplete] = onheadercomplete
  parser[HTTPParser.kOnBody] = onbody
  parser[HTTPParser.kOnMessageComplete] = oncompleted
  parser[HTTPParser.kOnTrailers] = onHeaders
  var CRLF = '\r\n';
  var b = Buffer(
        // 'POST /it HTTP/1.1' + CRLF +
        "HTTP/1.1 200 OK" + CRLF +
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
  var b = Buffer(a);
  parser.execute(b,0,b.length)
  console.log("parser started")
}