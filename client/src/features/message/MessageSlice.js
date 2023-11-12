import {createSlice} from "@reduxjs/toolkit";
import {webSocketSecureMiddleware} from "../../socket/chatAPI.js";

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
export const createMessageAsync = (element) => () => {
    webSocketSecureMiddleware.creatNewMessage(element);
}
export const getCreatedMessageAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeCreatedMessage((message) => dispatch(createMessage(message)));
}
export const sendMessageAsync = (element, groupId) => () => {
    webSocketSecureMiddleware.sendNewMessage(element, groupId);
}
export const getMessageAsync = (currentChat) => (dispatch) => {
    webSocketSecureMiddleware.subscribeGetMessage((message) => {
        if (currentChat?._id !== message.chatId) return;
        dispatch(updateMessages(message));
    });
}
export const getNotificationAsync = (currentChat) => (dispatch,getState) => {
    webSocketSecureMiddleware.subscribeNotification((res) => {
        const isChatOpen = currentChat?._id === res.chatId;
        const existingNotifications = getState().messages.notifications;
        const isNotificationExists = existingNotifications.some(notification => {
            return notification?._id === res._id
        } );
        if (!isNotificationExists) {
            if (isChatOpen) {
                dispatch(getNotifications({...res, isRead: true}))
            } else {
                dispatch(getNotifications(res))
            }
        }
    });
}
export const getMessagesAsync = (element) => () => {
    webSocketSecureMiddleware.getMessagesByUserId(element);
}
export const setMessagesAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeMessages((message) => {
        dispatch(getMessages(message));
    });
}
export default MessagesSlice.reducer;