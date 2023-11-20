import {createSlice} from "@reduxjs/toolkit";
import {webSocketSecureMiddleware} from "../../socket/chatAPI.js";

export const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chat: null,
        chats: [],
        group: null,
        members: [],
    },
    reducers: {
        setMembers: (state, action) => {
            state.members = action.payload;
        },
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
    setMembers,
    setGroup,
    setUserChats,
    setChat
} = ChatsSlice.actions;

export const selectChat = (state) => state.chats.chat;
export const selectGroup = (state) => state.chats.group;
export const selectChats = (state) => state.chats.chats;
export const selectMembers = (state) => state.chats.members;
export const createChatAsync = (element) => () => {
    webSocketSecureMiddleware.creatNewChat(element);
}
export const getChatAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeNewChat((chat) => {
        dispatch(setChat(chat));
    });
}

export const createGroupAsync = (element, user) => () => {
    webSocketSecureMiddleware.creatNewGroup(element, user);
}
export const updateMemberInGroupAsync = (element, user) => () => {
    webSocketSecureMiddleware.updateMemberInGroup(element, user);
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
export const findUsersFromChatAsync = (element) => () => {
    webSocketSecureMiddleware.findUsersFromChat(element);
}
export const getUsersFromChatAsync = () => (dispatch) => {
    webSocketSecureMiddleware.getUsersFromChat((member) => dispatch(setMembers(member)));
}
export default ChatsSlice.reducer;