import axios from "axios";
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

export const {register, setUser, login, findUsers, logoutUser} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const selectUser = (state) => state.users.user;
export const selectUsers = (state) => state.users.users;
export const registerUserAsync = (element) => (dispatch) => {
    axios({
        method: 'post',
        url: 'users/register',
        data: element,
    })
        .then((user) => dispatch(register(user.data.token)))
        .catch((err) => console.log(err));
}

export const loginUserAsync = (element) => (dispatch) => {
    axios({
        method: 'post',
        url: 'users/login',
        data: element,
    })
        .then((user) => dispatch(login(user.data.token)))
        .catch((err) => console.log(err));
}
export const setUserAsync = (element) => (dispatch) => {
    axios({
        method: 'get',
        url: `users/find/${element}`,
    })
        .then((user) => dispatch(setUser(user.data)))
        .catch((err) => console.log(err));
}
export const findUsersAsync = () => (dispatch) => {
    axios({
        method: 'get',
        url: 'users',
    })
        .then((users) => dispatch(findUsers(users.data)))
        .catch((err) => console.log(err));
}
export default UsersSlice.reducer;