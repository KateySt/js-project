import {createSlice} from "@reduxjs/toolkit";

export const SocketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
        socket_wss: null,
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setWSS: (state, action) => {
            state.socket_wss = action.payload;
        },
    },
});

export const {
    setWSS,
    setSocket,
} = SocketSlice.actions;

export const selectSocket = (state) => state.socket.socket;
export const selectWSS = (state) => state.socket.socket_wss;
export default SocketSlice.reducer;