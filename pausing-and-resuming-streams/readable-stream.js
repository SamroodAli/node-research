const fs = require("fs");
const path = require("path");

const readStream = fs.createReadStream(
  path.join(__dirname, "./powder-day.mp4")
);

/***  PAUSING STREAM */
readStream.pause();

process.stdin.on("data", (chunk) => {
  const parsed = chunk.toString().trim();

  if (parsed === "read") {
    // read next chunk in readStream
    readStream.read();
  } else if (parsed === "finish") {
    /****************  RESUMING STREAM */
    readStream.resume();
  } else {
    console.log("use read or finish instead", parsed);
  }
});

readStream.on("data", (chunk) => {
  console.log("chunk size", chunk.length);
});

readStream.on("end", () => {
  console.log("stream finished");
});

readStream.on("error", (error) => {
  console.log("An error has occurred");
  console.error(error);
});
