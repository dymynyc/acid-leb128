var tape = require('tape')
var leb = require('acidlisp/require')(__dirname)('../')
var varint = require('varint')
console.log(leb)

tape('encoding_length', function (t) {

  t.equal(leb.encoding_length(0), 1)
  t.equal(leb.encoding_length(1), 1)
  t.equal(leb.encoding_length(127), 1)
  t.equal(leb.encoding_length(128), 2)
  //TODO expose memory allocator so that it's
  //easy to safely send data
  var ptr = 10000
  leb.memory.writeUInt32LE(8, ptr)

  for(var i = 1; i < 4; i++) {
    var n = (1<<(i*7))-1
    var len = leb.encoding_length(n)
    t.equal(len, i, 'encoding length of:'+n+ ' ('+n.toString(2).length + ' bits)')
    t.equal(leb.encode(n, ptr, 0), i, 'encode returns bytes used')
    t.equal(leb.bytes(), len)
    t.deepEqual(Buffer.from(varint.encode(n)), leb.memory.slice(ptr+4, ptr+4+len))

    t.equal(leb.decode(ptr, 0), n)
    t.equal(leb.bytes(), len)
  }

  for(var i = 1; i < 4; i++) {
    var n = (1<<(i*7))
    var len = leb.encoding_length(n)
    t.equal(len, i+1, 'encoding length of:'+n+ ' ('+n.toString(2).length + ' bits)')
    t.equal(leb.encode(n, ptr, 0), i+1, 'encode returns bytes used')
    t.equal(leb.bytes(), len)
    t.deepEqual(leb.memory.slice(ptr+4, ptr+4+len), Buffer.from(varint.encode(n)))
    t.equal(leb.decode(ptr, 0), n)
    t.equal(leb.bytes(), len)
  }

  t.end()
})
