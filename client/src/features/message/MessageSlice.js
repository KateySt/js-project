import {createSlice} from "@reduxjs/toolkit";

export const MessagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        message: {},
        notifications: [],
    },
    reducers: {
        createMessage: (state, action) => {
            state.message = action.payload;
        },
        getMessages: (state, action) => {
            state.messages = action.payload;
        },
        updateMessages: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        getNotification: (state, action) => {
            state.notifications = action.payload;
        },
        getNotifications: (state, action) => {
            state.notifications = [...state.notifications, action.payload];
        },
    },
});

export const {
    createMessage,
    getNotification,
    getNotifications,
    getMessages,
    updateMessages
} = MessagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectMessage = (state) => state.messages.message;
export const selectNotifications = (state) => state.messages.notifications;
export const createMessageAsync = (element) => (dispatch, getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.emit("creatMessage", element);
    socketSecure.on("getCreatedMessage", (user) => {
        dispatch(createMessage(user));
    });
}
export const sendMessageAsync = (message, currentChat, user) => (dispatch, getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    const recipientId = currentChat?.members.find(id => id !== user?._id);
    socketSecure.emit("sendMessage", {...message, recipientId});
}
export const getMessageAsync = (currentChat) => (dispatch, getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.on("getMessage", (res) => {
        if (currentChat?._id !== res.chatId) return;
        dispatch(updateMessages(res));
    });
}
export const getNotificationAsync = (currentChat) => (dispatch, getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.on("getNotification", (res) => {
        const isChatOpen = currentChat?.members.some(id => id === res.senderId);
        if (isChatOpen) {
            dispatch(getNotifications({...res, isRead: true}))
        } else {
            dispatch(getNotifications(res))
        }
    });
}
export const getMessagesAsync = (element) => (dispatch, getState) => {
    const {socketSecure} = getState().socket;
    if (socketSecure == null) return;
    socketSecure.emit("getMessages", element);
    socketSecure.on("getMessagesById", (user) => {
        dispatch(getMessages(user));
    });
}
export default MessagesSlice.reducer;