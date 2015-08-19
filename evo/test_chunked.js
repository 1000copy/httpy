

// return 
var common ={"PORT": 8011}
var HttpServer = require("./HttpServer")
var server = HttpServer.createServer(function(req,res){
  res.write("A"+"\r\n")
  res.write("chunkchunk"+"\r\n")
  res.write("5"+"\r\n")
  res.write("chunk"+"\r\n")
  res.write("0"+"\r\n"+"\r\n")
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
