import {applyMiddleware, configureStore} from '@reduxjs/toolkit'
import UsersReducer from '../features/user/UserSlice.js';
import MessagesReducer from '../features/message/MessageSlice.js';
import ChatsReducer from '../features/chat/ChatSlice.js';
import SocketReducer from "../features/SocketSlice.js"
import thunkMiddleware from 'redux-thunk';

export default configureStore({
    reducer: {
        users: UsersReducer,
        messages: MessagesReducer,
        chats: ChatsReducer,
        socket: SocketReducer,
    },
    // middleware: [webSocketMiddleware],
}, applyMiddleware(thunkMiddleware));