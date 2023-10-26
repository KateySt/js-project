import axios from "axios";
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
            state.messages = [...state.messages, action.payload];
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

export const {createMessage,getNotification,getNotifications, getMessages, updateMessages} = MessagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectMessage = (state) => state.messages.message;
export const selectNotifications = (state) => state.messages.notifications;
export const createMessageAsync = (element) => (dispatch) => {
    axios({
        method: 'post',
        url: 'messages/',
        data: element,
    })
        .then((mes) => dispatch(createMessage(mes.data)))
        .catch((err) => console.log(err));
}

export const getMessagesAsync = (element) => (dispatch) => {
    axios({
        method: 'get',
        url: `messages/${element}`,
    })
        .then((mes) => dispatch(getMessages(mes.data)))
        .catch((err) => console.log(err));
}
export default MessagesSlice.reducer;