const http = require("http");
const webSocketServer = require("websocket").server;

// Require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");

// WebSocket initialization
const webSocketsServerPort = 3009;
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

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: ", message.utf8Data);
      console.log("webData: ", message);
    }
  });
});

// Initialize express and define a port
const PORT = process.env.PORT || 3000;

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

  res.status(200).end(); // Responding is important
});

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
