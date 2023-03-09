#!/usr/bin/env node

"use strict";

var { spawn } = require("child_process");
const path = require("path");

// ************************************

main().catch(console.error);

// ************************************

async function main() {
  // this has to be
  const childProcess = spawn("node", [path.join(__dirname, "./child.js")]);

  childProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  childProcess.on("exit", function (code) {
    console.log(`child process finished with exit code ${code}`);
  });
}
