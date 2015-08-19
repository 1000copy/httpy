var net = require('net');
var EE = require("events").EventEmitter
var util = require("util")
var IncomingMessage = require("./incoming.js")
exports.createServer = createServer
function createServer(pair){
	return new HttpServer(pair)
}
function HttpServer (pair){
	this.pair = pair 	
	this.server = net.createServer(this.connectionListener.bind(this));
}
HttpServer.prototype.connectionListener = function(socket) {
	var self = this
	var datas = []
	var msg = new IncomingMessage()
	msg.on("header",function(header){
		// console.log(header)
		var req = new Request(msg)
		var res = new Response(req)
		if (self.pair)
			self.pair(req,res)
	})
	msg.on("end",function(){
	  
	})
	
	socket.on("data",function(data){
		msg.execute(data)
	})       
}
HttpServer.prototype.listen = function(ok) {
	this.server.listen(this.port,ok)
};

function Response(req){
	this.req = req 
}
Response.prototype.writeHeader=function(statusCode,statusMessage,options){

}
Response.prototype.write=function(buffer){

}
Response.prototype.end=function(){

}

function Request(msg){
	EE.call(this)
	this.incoming = msg 
	var self = this
	this.incoming.on("data",function(data){self.emit("data",data)})
	this.incoming.on("end",function(){self.emit("end")})
}
util.inherits(Request,EE)



