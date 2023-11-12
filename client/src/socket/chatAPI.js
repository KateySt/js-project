import {io} from "socket.io-client";

export const URL_WSS = "http://localhost:3000/users";
export const URL_WS = "http://localhost:3000";

let socket;
let socketSecure;
export const webSocketMiddleware = {
    startSocket() {
        if (socket) return;
        socket = io(URL_WS);
    },
    subscribeJWT(callback) {
        if (!socket) return;
        socket.on("getToken", (token) => {
            callback(token);
        });
        return () => {
            socket.off("getToken");
        }
    },
    subscribeUser(callback) {
        if (!socket) return;
        socket.on("getUser", (foundUser) => {
            callback(foundUser);
        });
        return () => {
            socket.off("getUser");
        }
    },
    setJWT(cred) {
        if (!socket) return;
        if (cred?.name) {
            socket.emit("register", cred);
        } else {
            socket.emit("login", cred);
        }
    },
    findUser(userId) {
        if (!socket) return;
        socket.emit("find", userId);
    },
    disconnectSocket() {
        if (!socket) return;
        socket.disconnect();
        socket = null;
    }
};

export const webSocketSecureMiddleware = {
    connectSocket(jwt) {
        if (socketSecure) return;
        socketSecure = io(URL_WSS, {auth: {token: jwt}});
        return () => {
            socketSecure.disconnect();
        }
    },
    addNewUserOnline(user) {
        if (!socketSecure) return;
        socketSecure.emit("addNewUser", user);
    },
    subscribeOnlineUsers(callback) {
        if (!socketSecure) return;
        socketSecure.on("getOnlineUsers", (res) => {
            callback(res);
        });
        return () => {
            socketSecure.off("getOnlineUsers");
        }
    },
    findUsersRecipient(userId) {
        if (!socketSecure) return;
        socketSecure.emit("findRecipient", userId);
    },
    subscribeRecipient(callback) {
        if (!socketSecure) return;
        socketSecure.on("getRecipient", (user) => {
            callback(user);
        });
        return () => {
            socketSecure.off("getRecipient");
        }
    },
    findUsers() {
        if (!socketSecure) return;
        socketSecure.emit("findAll");
    },
    subscribeUsers(callback) {
        if (!socketSecure) return;
        socketSecure.on("getUsers", (user) => {
            callback(user);
        });
        return () => {
            socketSecure.off("getUsers");
        }
    },
    creatNewMessage(message) {
        if (!socketSecure) return;
        socketSecure.emit("creatMessage", message);
    },
    subscribeCreatedMessage(callback) {
        if (!socketSecure) return;
        socketSecure.on("getCreatedMessage", (message) => {
            callback(message);
        });
        return () => {
            socketSecure.off("getCreatedMessage");
        }
    },
    sendNewMessage(message,groupId) {
        if (!socketSecure) return;
        socketSecure.emit("sendMessage", message, groupId);
    },
    subscribeGetMessage(callback) {
        if (!socketSecure) return;
        socketSecure.on("getMessage", (res) => {
            callback(res);
        });
        return () => {
            socketSecure.off("getMessage");
        }
    },
    subscribeNotification(callback) {
        if (!socketSecure) return;
        socketSecure.on("getNotification", (res) => callback(res));
        return () => {
            socketSecure.off("getNotification");
        }
    },
    getMessagesByUserId(userId) {
        if (!socketSecure) return;
        socketSecure.emit("getMessages", userId);
    },
    subscribeMessages(callback) {
        if (!socketSecure) return;
        socketSecure.on("getMessagesById", (user) => {
            callback(user);
        });
        return () => {
            socketSecure.off("getMessagesById");
        }
    },
    creatNewChat(chat) {
        if (!socketSecure) return;
        socketSecure.emit("createChat", chat);
    },
    subscribeNewChat(callback) {
        if (!socketSecure) return;
        socketSecure.on("getChat", (chat) => {
            callback(chat);
        });
        return () => {
            socketSecure.off("getChat");
        }
    },
    creatNewGroup(group) {
        if (!socketSecure) return;
        socketSecure.emit("createGroup", group);
    },
    subscribeNewGroup(callback) {
        if (!socketSecure) return;
        socketSecure.on("getGroup", (group) => {
            callback(group);
        });
        return () => {
            socketSecure.off("getGroup");
        }
    },
    findUserChats(userId) {
        if (!socketSecure) return;
        socketSecure.emit("findUserChats", userId);
    },
    subscribeUserChats(callback) {
        if (!socketSecure) return;
        socketSecure.on("getUserChats", (chats) => {
            callback(chats);
        });
        return () => {
            socketSecure.off("getUserChats");
        }
    },
    findOneChat(chatInfo) {
        if (!socketSecure) return;
        socketSecure.emit("findChat", chatInfo);
    },
    subscribeChat(callback) {
        if (!socketSecure) return;
        socketSecure.on("getFindChat", (chat) => {
            callback(chat);
        });
        return () => {
            socketSecure.off("getFindChat");
        }
    },
    disconnectSocket() {
        if (!socketSecure) return;
        socketSecure.disconnect();
        socketSecure = null;
    }
};
