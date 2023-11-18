import {configureStore} from '@reduxjs/toolkit'
import UsersReducer from '../features/user/UserSlice.js';
import MessagesReducer from '../features/message/MessageSlice.js';
import ChatsReducer from '../features/chat/ChatSlice.js';

export default configureStore({
    reducer: {
        users: UsersReducer,
        messages: MessagesReducer,
        chats: ChatsReducer,
    },
});