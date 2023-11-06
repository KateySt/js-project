import {createSlice} from "@reduxjs/toolkit";

export const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chat: null,
        chats: []
    },
    reducers: {
        setChat: (state, action) => {
            state.chat = action.payload;
        },
        setUserChats: (state, action) => {
            state.chats = action.payload;
        },
    },
});

export const {
    setUserChats,
    setChat
} = ChatsSlice.actions;

export const selectChat = (state) => state.chats.chat;
export const selectChats = (state) => state.chats.chats;
export const createChatAsync = (element) => (dispatch,getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.emit("createChat", element);
    socketSecure.on("getChat", (user) => {
        dispatch(setChat(user));
    });
}
export const findUserChatsAsync = (element) => (dispatch,getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.emit("findUserChats", element);
    socketSecure.on("getUserChats", (user) => {
        dispatch(setUserChats(user));
    });
}
export const findChatAsync = (element) => (dispatch,getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.emit("findChat", element);
    socketSecure.on("getFindChat", (user) => {
        dispatch(setChat(user));
    });
}
export default ChatsSlice.reducer;