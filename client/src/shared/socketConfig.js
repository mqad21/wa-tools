import io from "socket.io-client";

const MAX_CONNECTED = 3;
const URL = "https://wa-tools.herokuapp.com";
// const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false, query: 'n=1' });

export {socket, URL, MAX_CONNECTED};