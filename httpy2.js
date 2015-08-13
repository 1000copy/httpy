var util = require('util');
var EventEmitter = require('events').EventEmitter;


var incoming = require('./_http_incoming2');
var IncomingMessage = exports.IncomingMessage = incoming.IncomingMessage;


var common = require('./_http_common2');
exports.METHODS = util._extend([], common.methods).sort();
exports.parsers = common.parsers;


var outgoing = require('./_http_outgoing2');
var OutgoingMessage = exports.OutgoingMessage = outgoing.OutgoingMessage;


var server = require('./_http_server2');
exports.ServerResponse = server.ServerResponse;
exports.STATUS_CODES = server.STATUS_CODES;



exports._connectionListener = server._connectionListener;
var Server = exports.Server = server.Server;

exports.createServer = function(requestListener) {
  return new Server(requestListener);
};



