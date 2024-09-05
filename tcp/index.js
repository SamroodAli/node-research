import net from "node:net";

const PORT = 8080;
let connectionsCount = 0;
const server = net.createServer((socket) => {
  connectionsCount += 1;
  console.log("client connected");
  console.log(connectionsCount);

  socket.on("data", (data) => {
    console.log("new message");
    console.log(data.toString());

    // not necessary. tcp is stream based protocol
    // and need not follow request response
    // socket.write("response from server");
  });

  socket.on("end", () => {
    connectionsCount -= 1;
    console.log("Client disconnected");
    console.log(connectionsCount);
    console.log("-----------------");
  });

  // must to avoid ECONNRESET where client closes the connection when
  // the server is still reading from or writing to the socket
  socket.on("error", (err) => {
    console.error("Socket error from", socket.remoteAddress, ":", err.message);
  });
});

server.on("error", (err) => {
  console.error("Server error", err);
});

server.listen(PORT, () => {
  console.log(`started listening on ${PORT}`);
});
