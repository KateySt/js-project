import axios from "axios";
import {createSlice} from "@reduxjs/toolkit";

export const UsersSlice = createSlice({
    name: 'users',
    initialState: {
        usersList: [],
        jwt: "",
        user: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        register: (state, action) => {
            state.jwt = action.payload;
        },
    },
});

export const {register, setUser} = UsersSlice.actions;

export const selectJwt = (state) => state.users.jwt;
export const registerUserAsync = (element) => (dispatch) => {
    const result = axios({
        method: 'post',
        url: 'users/register',
        data: element
    })
        .then((user) => dispatch(register(user.token)))
        .catch((err) => console.log(err));
}
export default UsersSlice.reducer;