// var a = 
// `HTTP/1.1 201 OK
// Connection: close
// Transfer-Encoding: chunked

// 6
// echo_1
// 0

// `
var common ={}
common.PORT = 8011
var HttpServer = require("./HttpServer")
var server = HttpServer.createServer(function(req,res){
  // console.log(req)
  // var i = req.incoming
  // console.log(i.headers)
  // console.log(i.upgrade)
  // console.log(i.method)
  // console.log(i.url)
  // console.log(i.versionMajor)
  // console.log(i.versionMinor)
  // console.log(i.shouldKeepAlive)
  req.on("data",function(data){console.log(data.toString())})
})
server.port = common.PORT
server.listen(req__)
console.log('Server started 8011' );
// ccc()
  var http = require('http');

 function req__(){
      // return
      var req = http.request({
        host: 'localhost',
        port: common.PORT,
        method: 'POST',
        path: '/'
      },function(res){
          // console.log("+")
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
      req.end()
    }
