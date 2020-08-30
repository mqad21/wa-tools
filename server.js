console.log("WELCOME TO WHATSAPP TOOLS - by mqad21"); //dekstop

const express = require("express");
const cors = require("cors");
const { Client } = require("whatsapp-web.js");
const opn = require("opn");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const handleActions = require("./modules/handle-actions");
const { static } = require("express");

const clients = {};

const isNewClient = (sessionData) => {
  if (!sessionData) return true;
  return !clients[sessionData.WABrowserId];
};

const getClient = (sessionData) => {
  const additionalOptions = {
    puppeteer: {
      args: ["--no-sandbox"],
    },
  };

  const mainOptions = {
    takeoverOnConflict: true,
    takeoverTimeoutMs: 30000,
    restartOnAuthFail: true,
    authTimeoutMs: 30000,
  };

  if (sessionData) {
    const newClient = new Client({
      session: sessionData,
      ...mainOptions,
      ...additionalOptions,
    });
    return newClient;
  }
  const newClient = new Client({
    ...mainOptions,
    ...additionalOptions,
  });
  return newClient;
};

io.on("connection", (socket) => {
  const n = parseInt(socket.handshake.query.n);
  if (n !== 1) {
    console.log("clear old client");
    io.sockets.emit("clear");
    return;
  }
  socket.on("start", async (sessionJSON, setSession) => {
    try {
      const sessionData = JSON.parse(sessionJSON);
      const newClient = isNewClient(sessionData);
      if (sessionData) clients[sessionData.WABrowserId] = true;
      if (newClient) {
        console.log("New client started");

        const client = getClient(sessionData);

        client.on("auth_failure", (message) => {
          socket.emit("fail", message);
          clients[sessionData.WABrowserId] = null;
        });

        client.on("disconnected", (state) => {
          const message = `Client disconnected [${state}]`;
          socket.emit("fail", message);
          console.log(message);
          clients[sessionData.WABrowserId] = null;
        });

        client.on("change_state", (reason) => {
          const message = `Client state changed [${reason}]`;
          console.log(message);
        });

        client.on("qr", (qr) => {
          if (socket && qr) {
            socket.emit("fetch-qr", qr);
          }
        });

        client.on("ready", () => {
          socket.emit("ready", "");
          console.log("Whatsapp Ready!");
          handleActions(client, socket);
        });

        client.on("authenticated", (session) => {
          socket.emit("stop-qr");
          console.log("Authenticated!");
          setSession(JSON.stringify(session));
          clients[session.WABrowserId] = true;

          socket.on("leave", () => {
            console.log("Client left");
            socket.disconnect();
            client.destroy();
            if (session) {
              if (session.WABrowserId) {
                console.log("Client removed");
                delete clients[session.WABrowserId];
              }
            }
          });
        });

        socket.on("leave", () => {
          console.log("Client left");
          client.destroy();
          if (sessionData) {
            if (sessionData.WABrowserId) {
              console.log("Client removed");
              delete clients[sessionData.WABrowserId];
            }
          }
        });

        client.initialize();
      }
    } catch (error) {
      console.log(error);
      socket.emit("fail", error);
    }
  });
});

io.sockets.setMaxListeners(0);
io.setMaxListeners(0);

app.use(cors());

app.get("/test", (req, res) => {
  res.end("Everything is OK :)");
});

app.get("/count", (req, res) => {
  const currentConnection = Object.keys(io.sockets.connected).length;
  res.json({
    count: currentConnection,
  });
});

app.get("/close", (req, res) => {
  io.sockets.emit("kick");
  res.end("Kicked all :v");
});

const port = process.env.PORT || 5000;
server.listen(port);

opn("https://app.mqad21.com/wa-tools-desktop"); //dekstop
