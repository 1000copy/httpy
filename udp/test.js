var PORT = 2425;
var HOST = '192.168.2.112';
// var HOST ="192.168.2.255"

var dgram = require('dgram');
//receiver 
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    var address = server.address();

    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    sendipmsg()
    // server.setBroadcast(true);
    // var message = new Buffer("1:1441337488:air:book:18874369")
    //  18874368  noop
    // 
    // 18874392 = 24 IPMSG_BR_ISGETLIST2
	// server.send(message, 0, message.length, PORT, "192.168.2.255");
});
function sendipmsg(){
	var ip = "192.168.2.115"
	var message = new Buffer("1:1441337488:air:book:32:message")
	server.send(message, 0, message.length, PORT, ip);	
}

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
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
server.bind(PORT);
/*
1:1441335544:mobile:lcjiPhone.local:18874369:lcj�CiPhoneiPhone
UN:mobile
HN:lcjiPhone.local
NN:lcj，iPhone
GN:iPhone


#define IPMSG_NOOPERATION		0x00000000UL

#define IPMSG_BR_ENTRY			0x00000001UL
#define IPMSG_BR_EXIT			0x00000002UL
#define IPMSG_ANSENTRY			0x00000003UL
#define IPMSG_BR_ABSENCE		0x00000004UL

#define IPMSG_BR_ISGETLIST		0x00000010UL
#define IPMSG_OKGETLIST			0x00000011UL
#define IPMSG_GETLIST			0x00000012UL
#define IPMSG_ANSLIST			0x00000013UL
#define IPMSG_BR_ISGETLIST2		0x00000018UL

#define IPMSG_SENDMSG			0x00000020UL
#define IPMSG_RECVMSG			0x00000021UL
#define IPMSG_READMSG			0x00000030UL
#define IPMSG_DELMSG			0x00000031UL
#define IPMSG_ANSREADMSG		0x00000032UL

#define IPMSG_GETINFO			0x00000040UL
#define IPMSG_SENDINFO			0x00000041UL

#define IPMSG_GETABSENCEINFO	0x00000050UL
#define IPMSG_SENDABSENCEINFO	0x00000051UL

#define IPMSG_GETFILEDATA		0x00000060UL
#define IPMSG_RELEASEFILES		0x00000061UL
#define IPMSG_GETDIRFILES		0x00000062UL

#define IPMSG_GETPUBKEY			0x00000072UL
#define IPMSG_ANSPUBKEY			0x00000073UL

*/