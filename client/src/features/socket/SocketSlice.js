import {createSlice} from "@reduxjs/toolkit";

export const SocketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
        socketSecure: null,
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setSocketSecure: (state, action) => {
            state.socketSecure = action.payload;
        },
    },
});

export const {
    setSocketSecure,
    setSocket,
} = SocketSlice.actions;

export const selectSocket = (state) => state.socket.socket;
export const selectSocketSecure = (state) => state.socket.socketSecure;
export default SocketSlice.reducer;