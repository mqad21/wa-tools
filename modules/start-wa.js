const fs = require("fs");
const { Client, WAState } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.json";

const startWa = (client) => {
  return new Promise((resolve, reject) => {
    if (client.getState() == WAState.CONNECTED) {
      resolve(client);
    } else {
      reject("There is no WA session");
    }
  });
};

module.exports = startWa;
