const { createServer } = require("http");
const { stat } = require("fs/promises");
const { createReadStream } = require("fs");
const path = require("path");

const server = createServer(handleRequest);

const videoPath = path.join(__dirname, "../demo-files/powder-day.mp4");

server.listen(3000, () => {
  console.log("server listening on http://localhost:3000");
});

async function handleRequest(req, res) {
  // stat gives data about the file such as size of the file
  const { size } = await stat(videoPath);

  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Content-Length": size,
  });

  createReadStream(videoPath).pipe(res);
}
