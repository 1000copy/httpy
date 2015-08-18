 var http = require('http');
  var httpy = require('./httpy2');
  var server = httpy.createServer(function(req, res) {    
    setTimeout(function(){
      res.writeHead(200, {'Content-Length':11});
      var b = new Buffer([ 8, 6, 7]);
      res.write(b, 'binary');
      res.end("chunked2","utf-8")
    },2000)
    
  }).listen(8011,doRequestTimes);
  console.log('Server started 8011' );
  function doRequestTimes(){
    for(var i= 0;i<3;i++)
      doRequest(i)
  } 
  function doRequest(path){
    // console.log('listened' );  
    // var debug = require("./_http_common.js").debug
    // debug("listened")
    var req = http.request({
      host: 'localhost',
      port: "8011",
      method: 'POST',
      path: '/',
      keepAlive:true
    },function(res){
      console.dir(res.req._headers)

      // console.dir(res)
        var bodyChunks = [];
      res.on('data', function(chunk) {
        bodyChunks.push(chunk);        
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        console.log( body.slice(3).toString());
      })
  }).on('error', function(e) {
      console.log("e.message");
    })
    // req.write("abc")
    // req.write("2")
    // req.write("333")
    req.end();
  }
// console.log("a")
// console.log("b\n")
// console.log("c")
