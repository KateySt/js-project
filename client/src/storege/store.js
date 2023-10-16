import { configureStore } from '@reduxjs/toolkit'
import UsersReducer from '../features/users/UsersSlice';

export default configureStore({
    reducer: {
        users: UsersReducer,
    },
});