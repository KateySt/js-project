import {io} from "socket.io-client";

let socket;
let socketSecure;
export const URL_WS = "http://localhost:3000";
export const URL_WSS = "http://localhost:3000/users";
export const webSocketMiddleware = (store) => (next) => (action) => {
   /* const usersState = store.getState().users;
    if (!socket) {
        socket = io(URL_WS);
    }
    if (!socketSecure && usersState.jwt) {
        socketSecure = io(URL_WSS, {auth: {token: usersState.jwt}});
    }
    store.socketSecure = socketSecure;
    store.socket = socket;
    next(action);*/
};
