// MILESTONE  ：1
// 想要让http.server 响应一个connection:keep-alive ,不容易。
// 需要多个req用一个Agent。
// 指定req‘s options为keepAlive:true,是毫无用处的。
// 可是在connectionListner内打印的两次socket的client port并不相等！要是共享了一个连接的话，
// 应该remote_address:remote_port:local_address:localport都相等才对。

var http = require('http');
var httpy = require('../httpy2');
var server = httpy.createServer(function(req, res) {
  // res.writeHead(200,{"Content-Length":4,"Connection":"keep-alive"})
  console.log(req.socket._getpeername().port,req.url
    ,req.headers.connection)

  // res.writeHead(200,{"connection":"keep-alive"})
  res.end("echo")
}).listen(8011,function(){
  var a = new http.Agent({keepAlive:true})
  req("path",a,function(){
    req("path1",a)
  })
})

console.log('Server started 8011' );

function req(path,agent,then){
  // var agent = new 
  var options = {
                  host: 'localhost',
                  port: "8011",
                  method: 'POST',
                  path: path,
                  // keepAlive:true,
                  // keepAliveMsecs:2000,
                  agent:agent             
                }
   var req = http.request(options,function(res){
                  var assert = require("assert")
                  // assert.equal(res.headers.connection,"keep-alive")
                  console.log(res.headers.connection)
                  res.on("data",function(d){
                      // console.log(d)
                  })
                  res.on("end",function(d){

                      if (then)
                        process.nextTick(function(){then()})
                  })
                  // console.log(http.globalAgent.sockets)
                  // assert.equal(res.headers.connection,"close")
                })
   req.end()
        
 }



