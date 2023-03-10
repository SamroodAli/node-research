const { createServer } = require("http");
const { stat } = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const multiparty = require("multiparty");

const server = createServer(handleRequest);

const videoPath = path.join(__dirname, "../demo-files/powder-day.mp4");

const uploadPath = (file) =>
  path.join(__dirname, `../ignored-demo-files/${file}`);

server.listen(3000, () => {
  console.log("server listening on http://localhost:3000");
});

async function handleRequest(req, res) {
  if (req.url === "/video") {
    handleVideo(req, res);
  } else if (req.url === "/upload" && req.method === "POST") {
    handleFileUpload(req, res);
  } else {
    handleMultiPartFrom(req, res);
  }
}

async function handleVideo(req, res) {
  // stat gives data about the file such as size of the file
  const { size } = await stat(videoPath);

  // handling range requests
  // range requests are when we click on different timestamps in the video
  // i.e, jumping to different parts of the video makes the browser send a request with the header 'range'
  // the 'range' header is in the format `bytes=${startingRange}-${endingRange}' where
  // starting range is always a number, but endingRange might not be present (empty string)
  //

  const range = req.headers.range;

  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");

    start = parseInt(start, 10);

    end = end ? parseInt(end, 10) : size - 1; // size - 1 because zero indexed

    res.writeHead(206, {
      "Content-Type": "video/mp4",
      "Content-Length": end - start + 1, // + 1 because it's zero indexed
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${start} - ${end}/${size}`,
    });

    createReadStream(videoPath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": size,
    });

    createReadStream(videoPath).pipe(res);
  }
}

async function handleMultiPartFrom(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(`
    <form enctype="multipart/form-data" method="POST" action="/upload">
      <input type="file" name="upload-file"/>
      <button type="submit">Upload file</button>
    </form>
  `);
}

async function handleFileUpload(req, res) {
  const formHandler = new multiparty.Form();

  // not what we want
  // formHandler.on("file", function (fileName, fileData) {
  // });

  // for one input tag
  formHandler.on("part", function (readable) {
    readable
      .pipe(createWriteStream(uploadPath(readable.filename)))
      .on("close", function onWriteFinish() {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });

        res.end(`
          <p>File uploaded</p>
        `);
      });

    res.end;
  });

  formHandler.parse(req);

  // forking streams
  // req.pipe(res);
  // req.pipe(process.stdout);
  // req.pipe(createWriteStream(uploadPath("someFile")));
}
