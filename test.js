

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
  var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain',"Content-Length":6});
    res.end("chunked", 'utf8');
  }).listen(8011);
  console.log('Server started 8011' );