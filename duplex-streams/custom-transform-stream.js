// Duplex streams are both readable and writable
// they are very useful as a middleware between readable and writable streams
// they act as the writable for the preceding readable stream
// and they act as the readable for the next writable stream
// readable -> writable
// readable -> duplex -> writable
// unlike pass through stream, a transform stream transforms data/chunks

const { Transform } = require("stream");
const ArrayStreamer = require("../custom-readable-streams/string-mode");

/** CUSTOM transform stream to uppercase a specific character the stream */

class UpperCase extends Transform {
  constructor(char) {
    super();
  }

  // transform streams need a custom _transform method
  _transform(chunk, encoding, done) {
    this.push(chunk.toString().toUpperCase());
    done();
  }

  // optional, called when read stream is over
  // only called once
  _flush(done) {
    this.push("some more data from _flush method \n"); // this is directly pushed to writable stream
    // and no transforms are done here

    done(); // not calling done here made the stream not emit 'end' event.
  }
}

const array = ["one", "two", "three", "four", "five", "six"].map(
  // adding a new line
  (each) => `${each}\n`
);

// some readable stream
const readStream = new ArrayStreamer(array);

const writeStream = process.stdout;

const upperCase = new UpperCase();

upperCase.on("end", () => {
  console.log("ended");
});

readStream // readable
  //  we can add some duplex streams here
  .pipe(upperCase) // delays each chunk
  .pipe(writeStream) // writable
  .on("error", console.error);
