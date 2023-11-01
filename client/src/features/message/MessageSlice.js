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
export const createMessageAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("creatMessage", element);
    socket.on("getCreatedMessage", (user) => {
        dispatch(createMessage(user));
    });
}

export const getMessagesAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("getMessages", element);
    socket.on("getMessagesById", (user) => {
        dispatch(getMessages(user));
    });
}
export default MessagesSlice.reducer;