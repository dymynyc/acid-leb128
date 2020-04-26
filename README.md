# acid-leb128

LEB128 codec in acidlisp.

same api as [chrisdickinson/varint](https://github.com/chrisdickinson/varint)
following [abstract-encoding](https://github.com/mafintosh/abstract-encoding)
interface.

currently, only int32 is supported.

## encode(int, byte_vector, start) => bytes

encode `int` as leb128 varint into `byte_vector` at position `start`.
returns the number of bytes used.

## decode(byte_vector, start) => int

decodes a varint from `byte_vector` at position `start`.
returns the `int` that was decoded.

## bytes()

returns the number of bytes used by previous call to `decode`
or `encode`

## encoding_length(int) => bytes

returns the number of bytes needed to encode `int`

## License

MIT
