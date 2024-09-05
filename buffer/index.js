const { Buffer } = require("buffer");

// Buffer module in nodejs provides a way to handle raw binary data efficiently

// Let's say we want to create a Buffer of 1 byte, i.e 8 bits
const buffer = Buffer.alloc(1);
// When you use console.log to print a Buffer in Node.js,
// the output is displayed in a compact hexadecimal format rather than
// showing each byte as 8 individual bits.
// This is a standard way to represent binary data in a more readable format.
// so for one byte of just the value 0, you will see two zeroes, <Buffer 00>
console.log("buffer of 1 byte. i.e 8 bits", buffer);

// for value 9, you will see <Buffer 09>
// Buffer.alloc takes in two arguments, the size and what to fill each byte with
// Here we are creating a buffer of 1 byte and fill it with the value '9'
const bufferNine = Buffer.alloc(1, 9);
console.log("one byte Buffer with value 9", bufferNine);

// but we can have several bytes all filled with the same value
// This will log Buffer as <Buffer 0b 0b 0b 0b 0b>
// as 'b' in hexadecimal represents the number 11
const bufferEleven = Buffer.alloc(5, 11);
console.log("five bytes Buffer with value 11", bufferEleven);

const bufferFifteen = Buffer.alloc(2, 15);
console.log("five bytes Buffer with value 11", bufferFifteen); // <Buffer 0f 0f>

const bufferEighteen = Buffer.alloc(2, 18);
// this will log <Buffer 12 12> because hexa for number 18 (decimal) is 12 (hexa)
console.log("five bytes Buffer with value 11", bufferEighteen);

// creating buffer from an array, length is length of the array
// and each value is the value in the array
const bufferWithDifferentValues = Buffer.from([1, 2, 3]);
console.log(bufferWithDifferentValues);

// This will log <Buffer 01 01 01> which is like wrapping around because of the overflow
// as one byte can only range from values 0 to 255. 256 becomes 00, 257 becomes 01 ....
const bufferOverflow = Buffer.alloc(3, 257);
console.log({ buffer4: bufferOverflow });
