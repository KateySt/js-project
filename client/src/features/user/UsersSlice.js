import axios from "axios";
import {createSlice} from "@reduxjs/toolkit";

export const UsersSlice = createSlice({
    name: 'users',
    initialState: {
        usersList: [],
        jwt: "",
        user: null,
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
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

export const {register, getUser, login,logoutUser} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const selectUser = (state) => state.users.user;
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
        .then((user) => dispatch(getUser(user.data)))
        .catch((err) => console.log(err));
}
export default UsersSlice.reducer;