   var Writable = require('stream').Writable;
  //default highWaterMark is 16K
  var ws = Writable({highWaterMark:1000});
  ws.cork()
  var i = 0
  var chunks = []
  ws._write = function (chunk, enc, next) {
      // console.dir(chunk);
      // console.log(chunk.length)
      i++
      chunks.push(chunk)
      next();
  };

  // process.stdin.pipe(ws);
  write1000()
  function write1000(){
    for (var i=0;i<200;i++)
      if (false === ws.write("0123456789"))
        {
          // console.log(ws.highWaterMark)
          console.log(i)
          ws.on('drain',function(){
            console.log("drain")
          })
          ws.uncork()
          // break ;
        }
  }