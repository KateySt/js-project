import {createSlice} from "@reduxjs/toolkit";

export const SocketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});

export const {
    setSocket,
} = SocketSlice.actions;

export const selectSocket = (state) => state.socket.socket;

export default SocketSlice.reducer;