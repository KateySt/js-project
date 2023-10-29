import {createSlice} from "@reduxjs/toolkit";

export const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chat: {},
        chats: []
    },
    reducers: {
        createChat: (state, action) => {
            state.chat = action.payload;
        },
        findUserChats: (state, action) => {
            state.chats = action.payload;
        },
        findChat: (state, action) => {
            state.chat = action.payload;
        },
    },
});

export const {findChat, findUserChats, createChat} = ChatsSlice.actions;

export const selectChat = (state) => state.chats.chat;
export const selectChats = (state) => state.chats.chats;
export const createChatAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("createChat", element);
    socket.on("getChat", (user) => {
        dispatch(createChat(user));
    });
}

export const findUserChatsAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("findUserChats", element);
    socket.on("getUserChats", (user) => {
        dispatch(findUserChats(user));
    });
}
export const findChatAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("findChat", element);
    socket.on("getFindChat", (user) => {
        dispatch(findChat(user));
    });
}
export default ChatsSlice.reducer;