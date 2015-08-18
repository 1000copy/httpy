  var Readable = require('stream').Readable;
  var rs = Readable({highWaterMark:100});

  // var c = 97 - 1;
  var k = 0 
  rs._read = function () {
    console.log("\n")
     console.log("begin fill")
      // if (c >= 'z'.charCodeAt(0)) return rs.push(null);

      // setTimeout(function () {
      //     rs.push(String.fromCharCode(++c));
      // }, 100);
     var i = 0 
     if (k!=0) {i = k ;console.log("resume from:",k) }
     for (;i<200;i++,k++){
        if (false === rs.push("0123456789"))
          {
            // console.log(ws.highWaterMark)
            console.log(i)
            console.log(rs.push("--\n"))
            //虽说返回false，但是这一条和后面的null还是接收了的。
            // 当然，这表示你可以继续蛮干，但是要不得。大家还是协商办事，不要一意孤行
            if (i===199)
              console.log(rs.push(null))
            break
            // ws.on('drain',function(){
            //   console.log("drain")
            // })
            // ws.uncork()
            // break ;
          }
        }
          // else{
          //   console.log("pushed"+i)
              
          // }
  };
  // rs.pause()
  rs.pipe(process.stdout);

  // process.on('exit', function () {
  //     console.error('\n_read() called ' + (c - 97) + ' times');
  // });
  // process.stdout.on('error', process.exit);


 