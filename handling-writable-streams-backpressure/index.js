// USE stream pipes instead. this is more how it works under the head

// back pressure is when the writable stream can't handle the readable stream's chunks
// if we increase the size of the stream, we can handle more chunks.
// The size of the stream is called 'watermark'. having a high water mark is one way to handle backpressure
// but there's a better way which is given here
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");

// We are copying a file here
const filePath = path.join(__dirname, "../demo-files/powder-day.mp4");
const copyPath = path.join(
  __dirname,
  "../ignored-demo-files/copy-power-day.mp4"
);

const readStream = createReadStream(filePath);

const writeStream = createWriteStream(copyPath, {
  // we can have a custom high water mark here
  // highWaterMark: 100000,
});

readStream.on("data", (chunk) => {
  //
  const streamIsFine = writeStream.write(chunk); // writeStream.write returns whether the stream is facing back pressure or not

  if (!streamIsFine) {
    // stream is facing backpressure
    console.log("writable streaming is having backpressure");
    readStream.pause();
  }
});

// when a writestream is free again after back pressure, it emits a 'drain' event
// this is where we can resume our readStream
writeStream.on("drain", () => {
  console.log("writeStream has drained and is free");
  readStream.resume();
});

readStream.on("end", () => {
  writeStream.end();
});

writeStream.on("close", () => {
  console.log("file copied");
});

readStream.on("error", onError);

writeStream.on("error", onError);

function onError(err) {
  console.log("An error occurred");
  console.error(err);
}
