import {createSlice} from "@reduxjs/toolkit";
import {webSocketMiddleware, webSocketSecureMiddleware} from "../../socket/chatAPI.js";

export const UsersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        jwt: "",
        user: null,
        recipients: [],
        recipient: null,
        usersOnline: [],
    },
    reducers: {
        setUsersOnline: (state, action) => {
            state.usersOnline = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setToken: (state, action) => {
            state.jwt = action.payload;
        },
        setRecipients: (state, action) => {
            state.recipients = action.payload;
        },
        setRecipient: (state, action) => {
            state.recipient = action.payload;
        },
        logoutUser: (state) => {
            state.jwt = "";
            state.user = null;
        },
    },
});

export const {
    setToken,
    setUser,
    setUsers,
    logoutUser,
    setRecipients,
    setRecipient,
    setUsersOnline,
} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const selectRecipients = (state) => state.users.recipients;
export const selectRecipient = (state) => state.users.recipient;
export const selectUsersOnline = (state) => state.users.usersOnline;
export const setAuthAsync = (element) => () => {
    webSocketMiddleware.setJWT(element);
}
export const getTokenAsync = () => (dispatch) => {
    webSocketMiddleware.subscribeJWT((token) => dispatch(setToken(token)));
}
export const foundUserAsync = (element) => () => {
    webSocketMiddleware.findUser(element);
}
export const setUserAsync = () => (dispatch) => {
    webSocketMiddleware.subscribeUser((user) => dispatch(setUser(user)));
}
export const setUsersOnlineAsync = (element) => () => {
    webSocketSecureMiddleware.addNewUserOnline(element);
}
export const getUsersOnlineAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeOnlineUsers((users) => dispatch(setUsersOnline(users)));
}
export const setRecipientsAsync = (element) => () => {
    webSocketSecureMiddleware.findUsersRecipient(element);
}
export const getRecipientsAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeRecipient((user) => dispatch(setRecipients(user)));
}
export const findUsersAsync = () => () => {
    webSocketSecureMiddleware.findUsers();
}
export const setUsersAsync = () => (dispatch) => {
    webSocketSecureMiddleware.subscribeUsers((users) => dispatch(setUsers(users)));
}
export default UsersSlice.reducer;