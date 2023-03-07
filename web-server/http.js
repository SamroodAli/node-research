#!/usr/bin/env node

"use strict";

var path = require("path");
var http = require("http");

var staticAlias = require("node-static-alias");

// ************************************

const DB_PATH = path.join(__dirname, "my.db");
const WEB_PATH = path.join(__dirname, "../demo-files");
const HTTP_PORT = 3000;

var fileServer = new staticAlias.Server(WEB_PATH, {
  cache: 100,
  serverInfo: "Node Workshop: ex5",
  alias: [
    {
      match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
      serve: "index.html",
      force: true,
    },
    {
      match: /^\/js\/.+$/,
      serve: "<% absPath %>",
      force: true,
    },
    {
      match: /^\/(?:[\w\d]+)(?:[\/?#].*$)?$/,
      serve: function onMatch(params) {
        return `${params.basename}.html`;
      },
    },
    {
      match: /[^]/,
      serve: "404.html",
    },
  ],
});

var httpServer = http.createServer(handleRequest);

main();

// ************************************

async function main() {
  httpServer.listen(HTTP_PORT);
  console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

async function handleRequest(req, res) {
  if (req.url === "/api/get-records") {
    await getAllRecordsHandler(req, res);
  } else {
    fileServer.serve(req, res);
  }
  // if (req.url === "/hello") {
  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.write("<p>Hello world</p>");
  //   res.end();
  // } else {
  //   res.writeHead(404, { "Content-Type": "text/html" });
  //   res.end("<p>Page not found. Sorry : (</p>");
  // }
}

async function getAllRecordsHandler(req, res) {
  const records = await getAllRecords();

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Cache-Control": "max-age: 0, no-cache",
  });

  res.write(JSON.stringify(records));
  res.end();
}

async function getAllRecords() {
  // fake DB results returned
  return [
    { something: 53988400, other: "hello" },
    { something: 342383991, other: "hello" },
    { something: 7367746, other: "world" },
  ];
}
