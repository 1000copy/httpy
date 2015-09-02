
// return 


var common ={"PORT": 8011}
var HttpServer = require("./HttpServer")
var server = HttpServer.createServer(function(req,res){
  var n = 30
  var b = n.toString(16)
  res.writeHeader(200,"OK",{"Content-Length":30})
  res.write("chunkchunkchunkchunkchunkchunk")
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
