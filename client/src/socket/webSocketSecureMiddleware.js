import {io} from "socket.io-client";
import {setOnlineUsers, setRecipients, setUsers} from "../features/user/UserSlice.js";
import {setChat, setUserChats} from "../features/chat/ChatSlice.js";
import {getMessages, getNotifications, setMessage, updateMessages} from "../features/message/MessageSlice.js";

let socket;
export const URL_WSS = "http://localhost:3000/users";
export const webSocketSecureMiddleware = (store) => (next) => (action) => {
    const messagesState = store.getState().messages;
    const chatsState = store.getState().chats;
    const usersState = store.getState().users;

    console.log(action.type)
    console.log(usersState)
    console.log(chatsState)
    console.log(messagesState)
    if (!socket && usersState.jwt) {
        socket = io(URL_WSS, {auth: {token: usersState.jwt}});

        socket.on("getUsers", (user) => {
            store.dispatch(setUsers(user));
        });
        socket.on("getChat", (chat) => {
            store.dispatch(setChat(chat));
        });
        socket.on("getUserChats", (userId) => {
            store.dispatch(setUserChats(userId));
        });
        socket.on("getMessagesById", (message) => {
            store.dispatch(getMessages(message));
        });
        socket.on("getOnlineUsers", (user) => {
            store.dispatch(setOnlineUsers(user));
        });
        socket.on("getMessage", (res) => {
            if (chatsState.currentChat?._id !== res.chatId) return;
            store.dispatch(updateMessages(res));
        });
        socket.on("getNotification", (res) => {
            const isChatOpen = chatsState.currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {
                store.dispatch(getNotifications({...res, isRead: true}))
            } else {
                store.dispatch(getNotifications(res))
            }
        });
        socket.on("getCreatedMessage", (message) => {
            store.dispatch(setMessage(message));
        });
        socket.on("getRecipient", (userId) => {
            store.dispatch(setRecipients(userId));
        });
    }
    if (socket) {
        if (chatsState.currentChat
            && messagesState.message
            && action.type === 'messages/setMessage') {
            const recipientId = chatsState.currentChat?.members.find(id => id !== usersState.user?._id);
            socket.emit("sendMessage", {...messagesState.message, recipientId});
        }
        if (usersState.user) {
            socket.emit("addNewUser", usersState.user?._id);
        }
        if (usersState.user
            && action.type === 'users/setUser') {
            socket.emit("findUserChats", usersState.user?._id);
        }
        if ((usersState.user
                && action.type === 'users/setUser')
            || (action.type === 'chats/setChat')
            || (messagesState.message
                && action.type === 'messages/setMessage')) {
            socket.emit("findRecipient", usersState.user?._id);
        }
        if (usersState.user
            && action.type === 'users/setUser') {
            socket.emit("findAll");
        }
        if (chatsState.chat
            && action.type === 'chats/setChat') {
            socket.emit("createChat", chatsState.chat);
        }
        if (chatsState.currentChat
            || (messagesState.message
                && action.type === 'messages/setMessage')) {
            socket.emit("getMessages", chatsState.currentChat);
        }
        if (messagesState.message
            && action.type === 'messages/setMessage') {
            socket.emit("creatMessage", messagesState.message);
        }
        if (action.type === 'users/logoutUser') {
            socket.disconnect();
            socket = null;
        }
    }
    next(action);
};