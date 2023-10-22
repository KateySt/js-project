import axios from "axios";
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
            state.chats = [...state.chats, action.payload];
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
export const createChatAsync = (element) => (dispatch) => {
    axios({
        method: 'post',
        url: 'chats/',
        data: element,
    })
        .then((chat) => dispatch(createChat(chat.data)))
        .catch((err) => console.log(err));
}

export const findUserChatsAsync = (element) => (dispatch) => {
    axios({
        method: 'get',
        url: `chats/${element}`,
    })
        .then((chat) => dispatch(findUserChats(chat.data)))
        .catch((err) => console.log(err));
}
export const findChatAsync = ({firstId, secondId}) => (dispatch) => {
    axios({
        method: 'get',
        url: `chats/find/${firstId}/${secondId}`,
    })
        .then((chat) => dispatch(findChat(chat.data)))
        .catch((err) => console.log(err));
}
export default ChatsSlice.reducer;