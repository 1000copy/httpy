var PORT = 2425;
var HOST = '192.168.2.112';
// var HOST ="192.168.2.255"

var dgram = require('dgram');
//receiver 
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    // server.setBroadcast(true);
    // setInterval(broadcastNew, 3000);
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
// var BROADCAST_ADDR ="255.255.255.255"
// function broadcastNew() {
//     var message = new Buffer("Broadcast message!");
//     server.send(message, 0, message.length, PORT, BROADCAST_ADDR, function() {
//         console.log("Sent '" + message + "'");
//     });
// }

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

});

server.bind(PORT);
// server.setBroadcast(true)

// // sender

// // var dgram = require('dgram');
// var message = new Buffer('My KungFu is Good!');

// var client = dgram.createSocket('udp4');
// client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//     if (err) throw err;
//     console.log('UDP message sent to ' + HOST +':'+ PORT);
//     client.close();
// });