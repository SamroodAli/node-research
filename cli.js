#!/usr/bin/env node

"use strict";

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "stdin"],
  string: ["file"],
});

const path = require("path");
const fs = require("fs");

main();

async function main() {
  if (args.help) {
    printHelp();
  } else if (args.stdin || args._.includes("-")) {
    const getStdIn = await import("get-stdin");
    getStdIn.default().then(processFile).catch(error);
  } else if (args.file) {
    fs.readFile(path.resolve(args.file), function onContents(err, contents) {
      if (err) {
        error(err.toString());
      } else {
        processFile(contents);
      }
    });
  } else {
    error("Incorrect usage", true);
  }
}

//  ******************

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
  console.log("");
}

function processFile(contents) {
  contents = contents.toString().toUpperCase();
  process.stdout.write(contents);
}
