import {createSlice} from "@reduxjs/toolkit";

export const UsersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        jwt: "",
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        findUsers: (state, action) => {
            state.users = action.payload;
        },
        register: (state, action) => {
            state.jwt = action.payload;
        },
        login: (state, action) => {
            state.jwt = action.payload;
        },
        logoutUser: (state) => {
            state.jwt = "";
            state.user = null;
        },
    },
});

export const {
    register,
    setUser,
    login,
    findUsers,
    logoutUser
} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const selectRecipients = (state) => state.users.recipients;
export const registerUserAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("register", element);
    socket.on("getToken", (token) => {
        dispatch(register(token));
    });
}

export const loginUserAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("login", element);
    socket.on("getToken", (token) => {
        dispatch(login(token));
    });
}
export const setUserAsync = (element, socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("find", element);
    socket.on("getUser", (user) => {
        dispatch(setUser(user));
    });
}
export const findUsersAsync = (socket) => (dispatch) => {
    if (socket == null) return;
    socket.emit("findAll");
    socket.on("getUsers", (user) => {
        dispatch(findUsers(user));
    });
}
export default UsersSlice.reducer;