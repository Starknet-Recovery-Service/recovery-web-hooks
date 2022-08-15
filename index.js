const http = require("http");
const webSocketServer = require("websocket").server;

// Require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");

// WebSocket initialization
const app = express();
const server = http.createServer(app);
const wsServer = new webSocketServer({
  httpServer: server,
});
const clients = {};
const getUniqueID = function () {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  console.log(
    new Date() + "Received a new connection from origin " + request.origin + "."
  );
  // rewrite this part to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  clients[userID].send("hello");

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: ", message.utf8Data);
      console.log("webData: ", message);
    }
  });
});

// Initialize express and define a port
const PORT = 3009;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());
app.post("/hook", (req, res) => {
  console.log(req.body); // Call your action on the request here

  // TODO: send message back to websocket

  res.status(200).end(); // Responding is important
});

app.post("/callFossil", (req, res) => {
  console.log(req.body); // Call your action on the request here

  // TODO: call the fossil api
  res.send("hi");

  res.status(200).end(); // Responding is important
});

// Start express on the defined port
server.listen(PORT, async () => {
  console.log(`🚀 Websocket running on port ${PORT}`);
});
