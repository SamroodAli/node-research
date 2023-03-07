// Duplex streams are both readable and writable
// they are very useful as a middleware between readable and writable streams
// they act as the writable for the preceding readable stream
// and they act as the readable for the next writable stream
// readable -> writable
// readable -> duplex -> writable
// in summary, they are great as 'pass through' streams.

const { PassThrough, Duplex } = require("stream");
const ArrayStreamer = require("../custom-readable-streams/string-mode");

/** CUSTOM duplex stream to throttle the stream */

class Throttle extends Duplex {
  constructor(ms) {
    super();
    this.delay = ms;
  }

  // read is needed in duplex streams
  _read(size) {
    // push with this.push if you want to add the
    // read stream which will be written to the write stream
    console.log(
      "throttle stream readable stream: one read operation of size: ",
      size
    );
  }

  // _write is needed in duplex streams
  _write(chunk, encoding, done) {
    this.push(chunk);
    // delaying each write
    setTimeout(done, this.delay);
  }

  // called when there's no more data from the read stream
  _final() {
    // end the write stream in this
    this.push(null);
  }
}

const array = ["one", "two", "three", "four", "five", "six"].map(
  // adding a new line
  (each) => `${each}\n`
);

// some readable stream
const readStream = new ArrayStreamer(array);

const writeStream = process.stdout;

// creating a duplex stream that reports the chunks passing through.
const report = new PassThrough();

// create a throttle stream
const throttle = new Throttle(1000); // delay between each chunk

let total = 0;

report.on("data", (chunk) => {
  total += chunk.length;
  console.log(`total: ${total}`);
});

readStream // readable
  //  we can add some duplex streams here
  .pipe(report) // reports every chunk
  .pipe(throttle) // delays each chunk
  .pipe(writeStream) // writable
  .on("error", console.error);
