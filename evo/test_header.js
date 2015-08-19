
var CRLF = "\r\n"
var Header = require("./header.js")
var header = new Header()
var statusCode = 200
var statusMessage = "OK"
var statusLine = 'HTTP/1.1 ' + statusCode.toString() + ' ' +
                   statusMessage + CRLF;
console.log(header._storeHeader(statusLine,{"Content-Length":20}))
console.log(header.state)

console.log(header._storeHeader(statusLine,{}))
console.log(header.state)

console.log(header._storeHeader(statusLine,{"Transfer-Encoding":"chunked"}))
console.log(header.state)