// Duplex streams are both readable and writable
// they are very useful as a middleware between readable and writable streams
// they act as the writable for the preceding readable stream
// and they act as the readable for the next writable stream
// readable -> writable
// readable -> duplex -> writable
// in summary, they are great as 'pass through' streams.

const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const { PassThrough } = require("stream");

// We are copying a file here
const filePath = path.join(__dirname, "../demo-files/powder-day.mp4");

const copyPath = path.join(
  __dirname,
  "../ignored-demo-files/copy-power-day.mp4"
);

const readStream = createReadStream(filePath);

const writeStream = createWriteStream(copyPath);

// creating a duplex stream that reports the chunks passing through.
const report = new PassThrough();

let total = 0;
report.on("data", (chunk) => {
  total += chunk.length;
  console.log(`total: ${total}`);
});

readStream // readable
  //  we can add some duplex streams here
  .pipe(report) // reports every chunk
  .pipe(writeStream) // writable
  .on("error", console.error);
