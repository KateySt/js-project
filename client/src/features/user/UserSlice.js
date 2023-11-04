import {createSlice} from "@reduxjs/toolkit";

export const UsersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        jwt: "",
        user: null,
        cred: null,
        onlineUsers: null,
        recipients: [],
        recipient: null,
    },
    reducers: {
        setRecipient: (state, action) => {
            state.recipient = action.payload;
        },
        setRecipients: (state, action) => {
            state.recipients = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setCred: (state, action) => {
            state.cred = action.payload;
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
        logoutUser: (state) => {
            state.jwt = "";
            state.user = null;
        },
    },
});

export const {
    setRecipient,
    setRecipients,
    setOnlineUsers,
    setUser,
    setToken,
    setUsers,
    logoutUser,
    setCred,
} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const selectRecipients = (state) => state.users.recipients;
export const selectRecipient = (state) => state.users.recipient;
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const selectOnlineUsers = (state) => state.users.onlineUsers;
export default UsersSlice.reducer;