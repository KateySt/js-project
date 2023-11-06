import {createSlice} from "@reduxjs/toolkit";

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
export const registerUserAsync = (element,socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("register", element);
    socket.on("getToken", (token) => {
        dispatch(setToken(token));
    });
}
export const loginUserAsync = (element,socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("login", element);
    socket.on("getToken", (token) => {
        dispatch(setToken(token));
    });
}
export const setUserAsync = (element,socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("find", element);
    socket.on("getUser", (user) => {
        dispatch(setUser(user));
    });
}
export const setUsersOnlineAsync = (element,socketSecure) => (dispatch) => {
    if (socketSecure == null) return;
    socketSecure.emit("addNewUser", element?._id);
    socketSecure.on("getOnlineUsers", (res) => {
        dispatch(setUsersOnline(res));
    });
}
export const setRecipientsAsync = (element,socketSecure) => (dispatch) => {
    if (socketSecure == null) return;
    socketSecure.emit("findRecipient", element?._id);
    socketSecure.on("getRecipient", (user) => {
        dispatch(setRecipients(user));
    });
}
export const findUsersAsync = (socketSecure) => (dispatch) => {
    if (socketSecure == null) return;
    socketSecure.emit("findAll");
    socketSecure.on("getUsers", (user) => {
        dispatch(setUsers(user));
    });
}
export default UsersSlice.reducer;