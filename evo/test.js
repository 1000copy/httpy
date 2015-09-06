
// PENDING ,实验还不成功
// 客户端不end，就会看到FIN_WAIT 
// 服务端不end，就会看到另外一个FIN_WAIT 
// 有时候可以看到TIME_WAIT ,超时后会消失
// 看法：netstat -na |findstr "8888"
var assert = require("assert")
var h = "localhost"
var p = 8888
var net = require("net")
var options ={
  allowHalfOpen: true  
}
var tcp = net.createServer(options,function (socket){
  // tcp.getConnections(function(err,count){
  //   console.log("concurrent:"+count)
  // })
  socket.on("data",function(data){    
    socket.write("echo "+data)
    socket.end()
  })
})
tcp.listen(p,h,client)
options.host = h
options.port = p
function client(){
  var c = net.connect(options,function(){      
      c.on("data",function(data){    
        console.log("server echo"+data)
      })
      c.write("hello")      
      c.end()
  })
  
}