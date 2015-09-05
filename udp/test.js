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
    // sendipmsg()
    // server.setBroadcast(true);
    // var message = new Buffer("1:1441337488:air:book:18874369")
    //  18874368  noop
    // 
    // 18874392 = 24 IPMSG_BR_ISGETLIST2
	// server.send(message, 0, message.length, PORT, "192.168.2.255");
});
var noop ="1:1441412180:air:mac:18874368:"
var entry="1:1441412180:air:mac:18874369:mba\rUN:air\rHN:mac\rNN:air mac\rGN:gn"
var getlist2="1:1441412180:air:mac:188"
function sendipmsg(){
	var ip = "192.168.2.115"
	var message = new Buffer("1:1441337488:air:book:32:message")
	server.send(message, 0, message.length, PORT, ip);	
}
function sendmsg(ip,message){
    // var ip = "192.168.2.115"
    // var message = new Buffer("1:1441337488:air:book:32:message")
    server.send(message, 0, message.length, PORT, ip);  
}
function broadcast_message(message){
    // var ip = "192.168.2.115"
    // var message = new Buffer("1:1441337488:air:book:32:message")
    // server.send(message, 0, message.length, PORT, "255.255.255.255");  
    server.send(message, 0, message.length, PORT, "192.168.2.255");
    // server.send(message, 0, message.length, PORT, "192.168.2.115");  
}
var woo = true
function broadcast_entry(){
    // var remote ={}
    // remote.address = address
    // broadcast_message(noop)
    broadcast_message(entry)
    // broadcast_message(getlist2)
}
server.on('message', function (message, remote) {
    // console.log(remote.address + ':' + remote.port +' - ' + message);
    if (woo){
        // broadcast_entry()
        woo = false
    }
    var msg = buf2msg(message)
    var cmd = get_cmd(msg.commandraw)
    if (cmd == IPMSG_ANSENTRY){
        console.log("ansentry:"+msg.name)
    }
    // var msg = buf2msg(message)
    // msg.name = "air"
    // msg.group ="mac"

    // sendmsg(remote.address,msg2buf(msg))
    // console.log(buf2msg(message))
});
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
    var str = msg.version+":"
        // msg.no+":"+
        msg.no+":"+
        msg.name+":"+
        msg.group+":"+
        msg.commandraw+":"
        // msg.no+":"
    // if (msg.extension )
    //     str += msg.extension
    return new Buffer(msg)
}
server.bind(PORT);
/*

192.168.2.115:2425 - 1:1441412180:mobile:lcjiPhone.local:18874368:
192.168.2.115:2425 - 1:1441412180:mobile:lcjiPhone.local:18874369:lcj�CiPhoneiPhone
UN:mobile
HN:lcjiPhone.local
NN:lcj，iPhone
GN:iPhone

192.168.2.115:2425 - 1:1441412180:mobile:lcjiPhone.local:188





*/