import {createSlice} from "@reduxjs/toolkit";

export const MessagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        message: null,
        notifications: [],
    },
    reducers: {
        setMessage: (state, action) => {
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
    setMessage,
    getNotification,
    getNotifications,
    getMessages,
    updateMessages
} = MessagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectMessage = (state) => state.messages.message;
export const selectNotifications = (state) => state.messages.notifications;
export default MessagesSlice.reducer;