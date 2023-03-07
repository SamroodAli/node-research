const { createReadStream, createWriteStream, write } = require("fs");
const path = require("path");

// USE stream pipes instead. this is more how it works under the head

const readStream = createReadStream(
  path.join(__dirname, "../demo-files/powder-day.mp4")
);

const writableStream = createWriteStream(
  path.join(__dirname, "./copy-power-day.mp4")
);

readStream.on("data", (chunk) => {
  // writing to a writable stream.
  // this doesn't handle back pressure. Find out how in dedicated handling back pressure in streams folder
  writableStream.write(chunk);
});

readStream.on("end", () => {
  // end writable stream
  writableStream.end();
});

readStream.on("error", onError);

writableStream.on("error", onError);

writableStream.on("close", () => {
  console.log("file copied.");
});

// helpers
function onError(error) {
  console.log("An error has occurred");
  console.error(error);
}
