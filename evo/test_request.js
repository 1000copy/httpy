
var common ={}
common.PORT = 8011
var HttpServer = require("./HttpServer")
var server = HttpServer.createServer(function(req,res){
  // console.log(req)
  var i = req.incoming
  console.log(i.headers)
  console.log(i.upgrade)
  console.log(i.method)
  console.log(i.url)
  console.log(i.versionMajor)
  console.log(i.versionMinor)
  console.log(i.shouldKeepAlive)
  console.log(req.incoming.headers)
  req.on("header",function(header){console.log(header)})
  req.on("data",function(data){console.log(data.toString())})
  req.on("end",function(data){console.log("end...")})
  res.writeHeader(200,"OK",{"Content-Length":5})
  res.write("chunk")
  // res.end()
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
          console.log( "CLIENT",res.headers);
            var bodyChunks = [];
            res.on('data', function(chunk) {
              bodyChunks.push(chunk);        
            }).on('end', function() {
              var body = Buffer.concat(bodyChunks);        
              console.log( "CLIENT",body.toString());
            })
        }).on('error', function(e) {
            console.log(e.message);
      })
      req.write("chunk1")
      req.write("chunk2")
      req.end()
    }
