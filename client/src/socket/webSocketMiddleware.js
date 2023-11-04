import {io} from "socket.io-client";
import {setToken, setUser} from "../features/user/UserSlice.js";
import jwt from "jwt-decode";

let socket;
export const URL_WS = "http://localhost:3000";
export const webSocketMiddleware = (store) => (next) => (action) => {
    const usersState = store.getState().users;

    if (!socket) {
        socket = io(URL_WS);

        socket.on("getToken", (token) => {
            store.dispatch(setToken(token));
        });
        socket.on("getToken", (token) => {
            store.dispatch(setToken(token));
        });
        socket.on("getUser", (user) => {
            store.dispatch(setUser(user));
        });
    }
    if (socket) {
        if (usersState.cred && !usersState.jwt) {
            socket.emit("login", usersState.cred);
        }
        if (usersState.cred?.name && !usersState.jwt) {
            socket.emit("register", usersState.cred);
        }
        if (usersState.jwt && !usersState.user) {
            socket.emit("find", jwt(usersState.jwt)?._id);
        }
        if (action.type === 'users/logoutUser') {
            socket.disconnect();
            socket = null;
        }
    }
    next(action);
};