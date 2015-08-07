

var http = require("./httpy.js")

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello!\n');
    response.end();
}).listen(8011);
console.log('Server started 8011' );

var http = require('http');
 
