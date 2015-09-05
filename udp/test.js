var IPMSG_NOOPERATION    =  0x00000000

var IPMSG_BR_ENTRY       =   0x00000001
var IPMSG_BR_EXIT        =   0x00000002
var IPMSG_ANSENTRY       =   0x00000003
var IPMSG_BR_ABSENCE     =   0x00000004

var IPMSG_BR_ISGETLIST   =   0x00000010
var IPMSG_OKGETLIST      =   0x00000011
var IPMSG_GETLIST        =   0x00000012
var IPMSG_ANSLIST        =   0x00000013
var IPMSG_BR_ISGETLIST2  =   0x00000018

var IPMSG_SENDMSG         =  0x00000020
var IPMSG_RECVMSG         =  0x00000021
var IPMSG_READMSG         =  0x00000030
var IPMSG_DELMSG          =  0x00000031
var IPMSG_ANSREADMSG      =  0x00000032

var IPMSG_GETINFO         = 0x00000040
var IPMSG_SENDINFO         = 0x00000041

var IPMSG_GETABSENCEINFO   = 0x00000050
var IPMSG_SENDABSENCEINFO  = 0x00000051

var IPMSG_GETFILEDATA      = 0x00000060
var IPMSG_RELEASEFILES     = 0x00000061
var IPMSG_GETDIRFILES      = 0x00000062

var IPMSG_GETPUBKEY        = 0x00000072
var IPMSG_ANSPUBKEY        =0x00000073


var PORT = 2425;
var HOST = '192.168.2.112';
var PEER = '192.168.2.115';
var BROADCAST_ADDRESS = "192.168.2.255"
var members = {}
var config ={}
config.LogOnUser = "lcj"
config.HostName ="myair"
config.UserName ="user"
config.GroupName ="group"
// UN:logOnUser
// HN:Host Name 
// NN:Ipmsg User Name
// GN:Ipmsg Group Name
function name_extension(){
    var line_sp ="\n"
    return line_sp+
        "UN:"+config.LogOnUser+line_sp+
        "HN:"+config.HostName+line_sp+
        "NN:"+config.UserName+line_sp+
        "GN:"+config.GroupName+line_sp
} 


// var HOST ="192.168.2.255"
function get_cmd(raw){
    return raw & 0xff
}
var dgram = require('dgram');
//receiver 
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    var address = server.address();

    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    // broadcast_entry("255.255.255.255")
    // broadcast_entry("192.168.2.115")
    server.setBroadcast(true);
    broadcast_entry()
});

var LOCALIP ="192.168.2.112"
function sendmsg(ip,message){
    server.send(message, 0, message.length, PORT, ip);  
}
function broadcast(message){
    var address = BROADCAST_ADDRESS
    server.send(message, 0, message.length, PORT, address);
}

function broadcast_entry(){
    var msg = {}
    msg.version = 1
    msg.no =1
    msg.name = config.LogOnUser
    msg.group = config.HostName
    msg.commandraw = IPMSG_BR_ENTRY
    msg.message = config.LogOnUser
    msg.extension = name_extension()
    // broadcast(entry)
    broadcast(msg2buf(msg))
    // broadcast(getlist2)
}
function memberpush (msg,ip){
    members[ip] = {name:msg.name,group:msg.group}
    // ipmsg_sendmsg(PEER,"girl")
}
server.on('message', function (message, remote) {
    // console.log(remote.address + ':' + remote.port +' - ' + message);

    var msg = buf2msg(message)
    var cmd = get_cmd(msg.commandraw)
    if (cmd == IPMSG_ANSENTRY){
        memberpush(msg,remote.address)
        // console.log(members)
    }else if (cmd==IPMSG_BR_ENTRY && remote.address !=LOCALIP){
        memberpush(msg,remote.address)
        answer_entry(remote.address)
        // console.log(msg)
    }else if (cmd==IPMSG_RECVMSG ){
        console.log("received:"+msg.extension)
        // console.log(msg)
    }else if (cmd==IPMSG_SENDMSG ){
        answer_send(remote.address,msg)
        console.log("RECV:"+msg.extension)
        // console.log(msg)
    }else if (cmd==IPMSG_BR_EXIT ){
        // answer_send(remote.address,msg)
        // console.log("RECV:"+msg.extension)
        // console.log(msg)
        var key = members[remote.address]
        if (key){
            members[remote.address] =null
            delete members[remote.address]
        }

    }
});
function answer_send(ip,src){
    var msg ={}
    msg.version = 1
    msg.no = 1
    msg.name = config.LogOnUser
    msg.group = config.HostName
    // msg.commandraw = IPMSG_SENDMSG
    // msg.commandraw = 16777218 //0x800120 
    msg.commandraw = IPMSG_RECVMSG
    msg.message =src.no +"\0"
    // msg.extension = name_extension()
    // msg.message = message+"\0"
    var buffer = msg2buf(msg)
    // console.log(buffer,buffer.length)
    server.send(buffer, 0, buffer.length, PORT, ip);
}
function answer_entry(ip){
    var msg ={}
    msg.version = 1
    msg.no = 1
    msg.name = config.LogOnUser
    msg.group = config.HostName
    // msg.commandraw = IPMSG_SENDMSG
    // msg.commandraw = 16777218 //0x800120 
    msg.commandraw = IPMSG_ANSENTRY
    msg.message =config.LogOnUser +"\0"
    msg.extension = name_extension()
    // msg.message = message+"\0"
    var buffer = msg2buf(msg)
    // console.log(buffer,buffer.length)
    server.send(buffer, 0, buffer.length, PORT, BROADCAST_ADDRESS);
}
function buf2msg(message){
	var bsplit = require('buffer-split')
    var snap = new Buffer(':')
    var msg = {}
    var list = bsplit(message,snap)
    msg.version = list[0].toString() 
    msg.no = list[1].toString() 
    msg.name = list[2].toString() 
    msg.group = list[3].toString() 
    msg.commandraw = list[4].toString() 
    msg.command = list[4].toString() & 0x000000ff 
    if (list[5])
    	msg.extension = list[5].toString() 
	return msg
}
function msg2buf(msg){
    var str = msg.version+":"+
        // msg.no+":"+
        msg.no+":"+
        msg.name+":"+
        msg.group+":"+
        msg.commandraw+":"+msg.message
        // msg.no+":"
    if (msg.extension )
        str += msg.extension
    // console.log(str)
    return new Buffer(str)
}
function ipmsg_sendmsg(ip,message){
    var msg ={}
    msg.version = 1
    msg.no = 1
    msg.name = config.LogOnUser
    msg.group = config.HostName
    // msg.commandraw = IPMSG_SENDMSG
    msg.commandraw = 8388896 //0x800120 
    msg.message = message+"\0"
    var buffer = msg2buf(msg)
    // console.log(buffer,buffer.length)
    server.send(buffer, 0, buffer.length, PORT, ip);
}
var confirming_packages = {}
server.bind(PORT);
function br_exit(){
    var msg ={}
    msg.version = 1
    msg.no = 1
    msg.name = config.LogOnUser
    msg.group = config.HostName
    // msg.commandraw = IPMSG_SENDMSG
    // msg.commandraw = 16777218 //0x800120 
    msg.commandraw = 0x0000002
    msg.message =config.LogOnUser +"\0"
    msg.extension = name_extension()
    // msg.message = message+"\0"
    var buffer = msg2buf(msg)
    // console.log(buffer,buffer.length)
    server.send(buffer, 0, buffer.length, PORT, BROADCAST_ADDRESS);
}


var repl = require ("repl"); 

var replServer = repl.start ({ 
prompt: "ipmsg-node.js> ", 
}); 

replServer.context.t = ipmsg_sendmsg.bind(this,"192.168.2.115")
replServer.context.q = br_exit
replServer.context.e = broadcast_entry
replServer.context.members = members

/* TEST CASE 
ipmsg-node.js> members

{ '192.168.2.112': { name: 'lcj', group: 'myair' } }
ipmsg-node.js> members
members
{ '192.168.2.112': { name: 'lcj', group: 'myair' },
  '192.168.2.115': { name: 'mobile', group: 'lcjiPhone.local' } }
ipmsg-node.js> members
members
{ '192.168.2.112': { name: 'lcj', group: 'myair' } }
ipmsg-node.js> t(1234)
t(1234)
undefined
ipmsg-node.js> t(1234)
t(1234)
undefined
ipmsg-node.js> received:1
RECV:hgg
*/