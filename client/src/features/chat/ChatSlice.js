import {createSlice} from "@reduxjs/toolkit";

export const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chat: null,
        chats: [],
        currentChat: null,
    },
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
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
    setChat,
    setCurrentChat,
} = ChatsSlice.actions;

export const selectChat = (state) => state.chats.chat;
export const selectChats = (state) => state.chats.chats;
export const selectCurrentChat = (state) => state.chats.currentChat;
export default ChatsSlice.reducer;