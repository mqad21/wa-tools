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
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
      ],
    },
  };

  if (sessionData) {
    const newClient = new Client({
      session: sessionData,
      takeoverOnConflict: true,
      takeoverTimeoutMs: 30000,
      restartOnAuthFail: true,
      ...additionalOptions,
    });
    return newClient;
  }
  const newClient = new Client({
    takeoverOnConflict: true,
    takeoverTimeoutMs: 30000,
    restartOnAuthFail: true,
    ...additionalOptions,
  });
  // clients[sessionData.WABrowserId] = newClient;
  return newClient;
};

io.on("connection", (socket) => {
  socket.on("start", async (sessionJSON, setSession) => {
    try {
      const sessionData = JSON.parse(sessionJSON);
      const newClient = isNewClient(sessionData);

      if (newClient) {
        const client = getClient(sessionData);

        client.on("auth_failure", (message) => {
          socket.emit("error", message);
          console.log(message);
          clients[sessionData.WABrowserId] = null;
        });

        client.on("disconnected", (state) => {
          const message = `Client disconnected [${state}]`;
          socket.emit("error", message);
          console.log(message);
          clients[sessionData.WABrowserId] = null;
        });

        client.on("change_state", (reason) => {
          const message = `Client change state [${reason}]`;
          socket.emit("error", message);
          console.log(message);
          clients[sessionData.WABrowserId] = null;
        });

        client.on("qr", (qr) => {
          socket.emit("fetch-qr", qr);
          console.log("Fetching QR...");
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
          clients[session.WABrowserId] = client;
        });

        client.initialize();
      } else {
        const client = clients[sessionData.WABrowserId];
        if (client) {
          try {
            const state = await client.getState();
            if (state !== "CONNECTED") {
              clients[sessionData.WABrowserId] = null;
              socket.emit("error", state);
            } else {
              socket.emit("stop-qr");
              handleActions(client, socket);
            }
          } catch (error) {
            socket.emit("error", "error");
          }
        } else {
          socket.emit("error", state);
        }
      }
    } catch (error) {
      socket.emit("error", error);
    }
  });
});

io.sockets.setMaxListeners(0);
io.setMaxListeners(0);

app.use(cors());

// app.use("/wa-tools", express.static("public"));

app.get("/test", (req, res) => {
  res.end("Everything is OK :)");
});

app.get("/count", (req, res) => {
  const currentConnection = Object.keys(io.sockets.connected).length;
  res.json({
    count: currentConnection
  });
});

app.get("/close", (req, res) => {
  io.sockets.emit("kick");
  res.end("Kicked all :v");
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Socket is listening on port " + port);
});

// opn("http://localhost:5000/wa-tools");
