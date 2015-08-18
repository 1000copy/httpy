var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var assert = require('assert')
var rs = Readable({highWaterMark:23});

// var c = 97 - 1;
// var k = 0 
var CHUNK  ="0123456789\n"
rs._read = function () {      
   for (var i =0 ;i< 10 ;i++){
      if (false === rs.push(CHUNK))
        {
          // console.log(ws.highWaterMark)
          assert.equal(2,i)
          assert.equal(false,rs.push(null))
          break;
          //虽说返回false，但是这一条和后面多出来的数字和null还是接收了的。
          // 当然，这表示你可以继续蛮干，但是要不得。大家还是协商办事，不要一意孤行
          /*
          This method writes some data to the underlying system, and calls the supplied callback once the data has been fully handled.
          The return value indicates if you should continue writing right now. If the data had to be buffered internally, then it will return false. Otherwise, it will return true.
          This return value is strictly advisory. You MAY continue to write, even if it returns false. However, writes will be buffered in memory, so it is best not to do this excessively. Instead, wait for the drain event before writing more data.
          */            
        }
      }
        
};

var writer = Writable({highWaterMark:9});
var chunks = []
writer._write = function(chunk, encoding, next){
   chunks.push(chunk)
   assert.equal(CHUNK,chunk)
   // console.log(chunk.toString())
   // console.log(chunks.length)
   // 要记得调用callback哦。不然后面的chunk不来的
   next()
}
// rs.pause()
// rs.pipe(process.stdout);
// exit

rs.pipe(writer)


process.on('exit', function () {    
  assert.equal(3,chunks.length)
});



 