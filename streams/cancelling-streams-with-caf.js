#!/usr/bin/env node

"use strict";
const path = require("path");
const fs = require("fs");
const { Transform } = require("stream");
const zlib = require("zlib");
const CAF = require("caf");

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "stdin", "stdout", "compress"],
  string: ["file", "outputFile"],
});

// **********

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

let OUT_FILE = path.resolve(BASE_PATH, args.outputFile || "out.text");

//  ******************

// pass to caf our function with the first argument the signal for cancelling it
const processFile = CAF(function* processFile(signal, inStream) {
  let outStream = inStream;

  if (args.extract) {
    const gUnzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gUnzipStream);
  }

  const upperStream = new Transform({
    transform(chunk, encoding, next) {
      this.push(chunk.toString().toUpperCase());
      next();
    },
  });

  outStream = outStream.pipe(upperStream);

  if (args.compress) {
    const gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);

    OUT_FILE = `${OUT_FILE}.gz`;
  }

  const targetStream = args.stdout
    ? process.stdout
    : fs.createWriteStream(OUT_FILE);

  outStream.pipe(targetStream);

  // cancelling streams
  signal.pr.catch(() => {
    outStream.unpipe(targetStream);
    // this destroys both outStream and the streams before this.
    outStream.destroy();
    console.log("Destroyed stream");
  });

  yield completeStream(outStream);
});

main();

async function main() {
  if (args.help) {
    printHelp();
  } else if (args.stdin || args._.includes("-")) {
    const tooLong = CAF.timeout(100, "Took too long");

    processFile(tooLong, process.stdin);
  } else if (args.file) {
    const tooLong = CAF.timeout(100, "Too too long");

    console.log(tooLong);
    const stream = fs.createReadStream(path.join(BASE_PATH, args.file));

    processFile(tooLong, stream);
    console.log("Complete"); // complete is printed before stream in processFile because streams are asynchronous
  } else {
    error("Incorrect usage", true);
  }
}

//  **** Helper functions

function error(msg, includeHelp = false) {
  console.error(msg);

  if (includeHelp) {
    console.log("");
    printHelp();
  }
}

function printHelp() {
  console.log("cli usage:");
  console.log("   cli.js --help");
  console.log("");
  console.log("--help                           print this help");
  console.log("--file={FILENAME}                give a file name ");
  console.log(
    "--outputFile                               outputs to the given file name"
  );
  console.log("--stdin                          take input from stdin ");
  console.log(
    "--stdout                                   outputs to stdout. If this is not mentioned, outputs to a file"
  );
  console.log("--compress                       gzip the output.");
  console.log("--extract                        extracts the input");
  console.log("");
}

function completeStream(stream) {
  return new Promise((resolve) => {
    stream.on("end", resolve);
  });
}
