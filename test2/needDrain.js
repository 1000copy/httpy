// var ret = state.length < state.highWaterMark;
// if (!ret)
//   state.needDrain = true;

var Writable = require('stream').Writable;
var assert = require('assert')

var writer = Writable({highWaterMark:9});
writer.cork()// 一直不消费,或者慢速消费chunk。
// 导致highWaterMark被超过。可能是因为underly system PUSH 失败。
// push return false
// var chunks = []
// writer._write = function(chunk, encoding, next){
//    chunks.push(chunk)
//    assert.equal(CHUNK,chunk)
//    // console.log(chunk.toString())
//    // console.log(chunks.length)
//    // 要记得调用callback哦。不然后面的chunk不来的
//    next()
// }

assert.ok(!writer.write("0123456789"))
assert.ok(writer._writableState.needDrain)



console.log("needDrain tested")
