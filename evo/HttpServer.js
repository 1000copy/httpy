var Header = require("./header.js")
var net = require('net');
var EE = require("events").EventEmitter
var util = require("util")
var Stream = require("stream")
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
		var res = new Response(req,socket)
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

function Response(req,socket){
	this.socket = socket
	Stream.Writable.call(this)
	this.HeadHunter = new Header()
	this.header = ""
	this.req = req 
	this.headerSent = false
}
util.inherits(Response,Stream.Writable)

Response.prototype.writeHeader=function(statusCode,statusMessage,options){
	this.header = this.HeadHunter.gate(statusCode,statusMessage,options)
}
Response.prototype.write=function(buffer){
    // var expected ="HTTP/1.1 200 OK\r\nContent-Length: 5\r\nConnection: keep-alive\r\n\r\nchunk"
    // this.socket.write(expected)
    // return
	if (this.header==""){
		this.header = this.HeadHunter.gate(200,"OK",{})
	}
	// console.log(this.header)
	if(!this.headerSent){
		this.socket.write(this.header)
		this.headerSent = true
	}

	this.socket.write(buffer)
}
Response.prototype.end=function(){
	this.socket.write(null)
}

function Request(msg){
	EE.call(this)
	this.incoming = msg 
	var self = this
	this.incoming.on("data",function(data){self.emit("data",data)})
	this.incoming.on("end",function(){self.emit("end")})
}
util.inherits(Request,EE)



