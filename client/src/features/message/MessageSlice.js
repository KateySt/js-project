import axios from "axios";
import {createSlice} from "@reduxjs/toolkit";

export const MessagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        message: {},
    },
    reducers: {
        createMessage: (state, action) => {
            state.message = action.payload;
            state.messages = [...state.messages, action.payload];
        },
        getMessages: (state, action) => {
            state.messages = action.payload;
        },
    },
});

export const {createMessage, getMessages} = MessagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectMessage = (state) => state.messages.message;
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