const { Buffer } = require("buffer");

//buffers are fixed length sequence of bytes

// 10 bytes
const buffer = Buffer.alloc(10);

console.log(buffer);

// 10 bytes but each byte is representing '2'
const buffer2 = Buffer.alloc(10, 2);

// creating buffer from an array, length is length of the array
// and each value is the value in the array
const buffer3 = Buffer.from([1, 2, 3]);

console.log(buffer3);

// 257 will be mod to 1, as this can only be in the range 0 to 255
const buffer4 = Buffer.alloc(3, 257);

console.log({ buffer4 });
