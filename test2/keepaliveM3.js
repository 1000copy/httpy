var assert = require('assert');
var http = require('http');
var http = require('http');
var EventEmitter = require('events').EventEmitter;

var common = {PORT:8088}

var agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 5,
  maxFreeSockets: 5,
});
// var clientport = undefined


function get(path, callback) {
  return http.get({
    host: 'localhost',
    port: common.PORT,
    path: path,
    agent:agent
  }, callback);
}

function second() {
  visit("/second")
}
function first(){
  visit("/first",second)
}


function visit(path,then) {
  // request second, use the same socket
  get(path, function (res) {
    assert.equal(res.statusCode, 200);
    // 必须有callback消费data。否则end无法emit
    res.on('data', function(){});
    res.on('end', function () {
      // 必须nextTick 以便保证then在前一个visit全部完成再执行，
      // 方可以利用keep-alive的连接。否则利用不上。
      process.nextTick(function () {
        if (then)
          then()
      });
    });
  });
}
var server = http.createServer(function (req, res) {
  // console.log(req.headers)
  res.end('any data');
  // 尽管url不同，但是客户端端口是一样的！这说明connection确实被共享了。
  console.log(
      req.socket._getpeername().port,req.url
    ,req.headers.connection)
}).listen(common.PORT, function() {
  first()
});



