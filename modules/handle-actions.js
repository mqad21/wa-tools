const { MessageMedia } = require("whatsapp-web.js");

const handleActions = (client, socket) => {
  socket.on("request", ({ requestType, payload }, response) => {
    switch (requestType) {
      case "GET_CONTACTS":
        getContacts({ client, response });
        break;
      case "SEND_DELAYED_MESSAGE":
        sendDelayedMessage({ client, payload, response });
        break;
      case "GET_GROUPS":
        getGroups({ client, response });
        break;
      case "GET_CHATS":
        getChats({ client, response, payload });
        break;
      case "GET_PRIVATES":
        getPrivates({ client, response });
        break;
    }
  });
};

const getPrivates = ({ client, response }) => {
  if (client) {
    client
      .getChats()
      .then((chats) => {
        const group = chats
          .filter((chat) => !chat.isGroup)
          .map((chat) => {
            return {
              id: chat.id._serialized,
              name: chat.name,
            };
          });
        response(group);
      })
      .catch((err) => {
        console.log(err);
        response(null, err);
      });
  }
};

const getChats = ({ client, response, payload }) => {
  if (client) {
    client
      .getChatById(payload.id)
      .then((chat) => {
        return chat.fetchMessages({ limit: payload.limit || Infinity });
      })
      .then((result) => {
        const messages = result.map((res) => {
          return {
            ...res,
            id: res.id._serialized,
            body: res.body.replace(/\s+/g, " "),
          };
        });
        response(messages);
      })
      .catch((err) => {
        response(null, err);
      });
  }
};

const getGroups = ({ client, response }) => {
  if (client) {
    client
      .getChats()
      .then((chats) => {
        const group = chats
          .filter((chat) => chat.isGroup && chat.name)
          .map((chat) => {
            return {
              id: chat.id._serialized,
              name: chat.name,
            };
          });
        response(group);
      })
      .catch((err) => {
        console.log(err);
        response(null, err);
      });
  }
};

const getContacts = ({ client, response }) => {
  client
    .getContacts()
    .then((contacts) => {
      response(contacts);
    })
    .catch((err) => {
      console.log(err);
      response(null, err);
    });
};

const sendDelayedMessage = ({ client, response, payload }) => {
  const { contacts, time, message, files, id } = payload;
  const now = new Date();
  // now.setHours(now.getHours() + 7);
  const diffMilis = Date.parse(time) - now;
  const send = async (response) => {
    for (const contact of contacts) {
      await client.sendMessage(contact.id, message);
      for (const file of files) {
        try {
          const media = await new MessageMedia("image/png", file);
          await client.sendMessage(contact.id, media);
        } catch(err) {
          console.log(err);
        }
      }
    }
    response(id);
  };

  setTimeout(() => {
    send(response);
  }, diffMilis);
};

module.exports = handleActions;
