import {createSlice} from "@reduxjs/toolkit";
import {webSocketSecureMiddleware} from "../../socket/chatAPI.js";

export const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chat: null,
        chats: [],
        group: null,
    },
    reducers: {
        setChat: (state, action) => {
            state.chat = action.payload;
        },
        setGroup: (state, action) => {
            state.group = action.payload;
        },
        setUserChats: (state, action) => {
            state.chats = action.payload;
        },
    },
});

export const {
    setGroup,
    setUserChats,
    setChat
} = ChatsSlice.actions;

export const selectChat = (state) => state.chats.chat;
export const selectGroup = (state) => state.chats.group;
export const selectChats = (state) => state.chats.chats;
export const createChatAsync = (element) => () => {
    webSocketSecureMiddleware.creatNewChat(element);
}
export const getChatAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeNewChat((chat) => {
        dispatch(setChat(chat));
    });
}

export const createGroupAsync = (element) => () => {
    webSocketSecureMiddleware.creatNewGroup(element);
}
export const getGroupAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeNewGroup((group) => {
        dispatch(setGroup(group));
    });
}
export const findUserChatsAsync = (element) => () => {
    webSocketSecureMiddleware.findUserChats(element);
}
export const setUserChatsAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeUserChats((chats) => {
        dispatch(setUserChats(chats));
    });
}
export const findChatAsync = (element) => () => {
    webSocketSecureMiddleware.findOneChat(element);
}
export const setChatAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeChat((chat) => dispatch(setChat(chat)));
}
export default ChatsSlice.reducer;