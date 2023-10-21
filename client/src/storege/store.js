import {configureStore} from '@reduxjs/toolkit'
import UsersReducer from '../features/user/UsersSlice';
import MessagesReducer from '../features/message/MessageSlice';
import ChatsReducer from '../features/chat/ChatSlice';

export default configureStore({
    reducer: {
        users: UsersReducer,
        messages: MessagesReducer,
        chats: ChatsReducer,
    },
});