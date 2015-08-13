

// var http = require("./httpy.js")

// http.createServer(function (request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     console.log(response._headerSent)
//     console.log(response.output.length)
//     response.write('Hello!\n');
//     console.log(response._headerSent)
//     console.log(response.output.length)
//     response.end();
//     console.log(response._headerSent)
//     console.log(response.output.length)
// }).listen(8011);
// console.log('Server started 8011' );

// var http = require('http');
// var server = http.createServer(function(req, res) {
//   res.end("chunked", 'utf8');
// }).listen(8011);
// console.log('Server started 8011' );
 
  var http = require('http');
  var httpy = require('./httpy2');
  var server = httpy.createServer(function(req, res) {
    // 这样写就会导致header+first chunk 合并后发送。
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.write("chunked1", 'utf8');
    // res.write("chunked2", 'utf8');
    // res.end("chunked3", 'utf8');
    req.on("data",function(data){})
    res.writeHead(200, {'Content-Length':11});
    var b = new Buffer([ 8, 6, 7]);
    res.write(b, 'binary');
    res.end("chunked2","utf-8")
  }).listen(8011,function(){
    // console.log('listened' );	
    // var debug = require("./_http_common.js").debug
    // debug("listened")
    var req = http.request({
      host: 'localhost',
      port: "8011",
      method: 'POST',
      path: '/'
    },function(res){
    	  var bodyChunks = [];
		  res.on('data', function(chunk) {
		    bodyChunks.push(chunk);
		    // console.log(chunk.toString("utf-8"))
		  }).on('end', function() {
		    var body = Buffer.concat(bodyChunks);
      //   console.log( "body");
		    // console.log( body);
      //   console.log( body.slice(3).toString());
		  })
	}).on('error', function(e) {
      console.log(e.message);
    })
    req.write("abc")
    req.write("2")
    req.write("333")
    req.end();

  });
  console.log('Server started 8011' );


// var events = require("events")
// var obj = new events.EventEmitter;
// obj.on('event', a);
// obj.on('event', b);
// function a() { obj.removeListener('event', b) ;console.log("aaaa\n")}
// function b() { throw "BAM!" }
// obj.emit('event');  // throws
// function Foo(){

// }
// var FreeList = require("./_http_common2").FreeList
// var foo = new FreeList('foo', 1000, function() {
//   return Foo()
// }




  