// http://stackoverflow.com/questions/9191587/how-to-disconnect-from-tcp-socket-in-nodejs
// call end() is half open if allow half open options is true
// end() only closes the writing stream of the socket, the remote host can keep his writing stream open and send you data

//  如果我想要全关闭怎么办？我猜呢，是需要双方配合的。一方End，另一方也收到end事件如果不需要再写，就也调用end，就完全关闭。
//   而不能一方做出完全关闭的操作。这太野蛮了。
//  另一个人遇到的相同的问题：https://github.com/joyent/node/issues/3613
/*
I connect to socket server in NodeJs using this command:

client = net.createConnection()
How can I then properly disconnect from the server?

I tried client.end() and even client.destroy()

but when I check the connection status using netstat it shows that the connection is in state FIN_WAIT2.

How can I close and destroy the connection altogether?

  
Althrough docs say "Only necessary in case of errors" it seems the only method to close a connection. 
For myself I use something like 

socket.close = function(data) { 
  var Self = this; 
  if (data) 
    this.write(data, function(){ Self.destroy(); }); 
  else 
    this.destroy(); 
  }; 

*/
var assert = require("assert")
var h = "localhost"
var p = 8888
var net = require("net")
var options ={
  allowHalfOpen: true  
}
var tcp = net.createServer(options,function (socket){
  tcp.getConnections(function(err,count){
    console.log("concurrent:"+count)
  })
  // 尽管 Server因为end(),不能再写数据给客户端，但是它可以继续接受数据
  socket.on("end",function(data){
    console.log("SERVER: gotten end event")     
    assert.equal(socket._writableState.ended,true)   
    assert.equal(socket._readableState.ended,true)   
  })
  socket.on("data",function(data){
    console.log("SERVER: gotten"+data)    
    if (!socket._writableState.ended)      
      socket.end("server echo:"+data)    
    else{
      console.log("SERVER: but can't echo")
      // 不能写
      assert.equal(socket._writableState.ended,true)   
      // 但是可以读
      assert.equal(socket._readableState.ended,false)   
    }
  })
})
tcp.listen(p,h,client)
options.host = h
options.port = p
function client(){
  var c = net.connect(options,function(){
      c.setEncoding("utf-8")
      c.write("hello")
      // 模拟网络延迟而比较晚发到 Server 的数据
      setTimeout(function(){
        c.write("hello2")
        c.end()
        assert.equal(c._writableState.ended,true)   
        assert.equal(c._readableState.ended,true)   
      },1000)
      c.on("data",function(data){
        console.log("CLIENT: receive "+data)
        // c.write("hello2")
      })
      c.on("end",function(data){
        console.log("CLIENT: gotten end event")        
        assert.equal(c._writableState.ended,false)   
        assert.equal(c._readableState.ended,true)   
      })
  })
}