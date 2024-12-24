const WebSocket = require("ws");
const wsServer = new WebSocket.Server({ port: 8080 });

const { v4: uuidv4 } = require("uuid");

wsServer.on("error", console.error);

wsServer.on("connection", function connection(client) {
  let userId = uuidv4();
  client.id = userId;

  client.on("error", console.error);

  client.on("message", function message(data) {
    try {
      if (Buffer.isBuffer(data)) {
        data = data.toString("utf-8");
        data = JSON.parse(data);
      }
      console.log("Data: ", data);
      console.log("Data: ", client.id);
      if (data.username) {
        client.username = data.username;

        broadcastMsg(
          { text: `${client.username} has joined the chat!`, isSystem: true },
          wsServer.clients,
          client
        );
      } else if (data.msg) broadcastMsg(data.msg, wsServer.clients, client);
    } catch (error) {
      console.log(error);
    }
  });
});

function broadcastMsg(msg, clients, sender) {
  msg.username = sender.username;
  msg.date = new Date();
  console.log("broadcast: ", msg);
  for (let client of clients)
    if (sender.id !== client.id) client.send(JSON.stringify(msg));
}
