import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getUser,
    loginUserAsync,
    logoutUser,
    registerUserAsync,
    selectJwt,
    selectUser,
    setUserAsync
} from "../features/user/UsersSlice.js";
import jwt from 'jwt-decode';

function useUser() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector(selectJwt);
    const userInfo = useSelector(selectUser);

    const register = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(registerUserAsync(values));
        setIsLoading(false);
        setSubmitting(false);
    }, []);

    const login = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(loginUserAsync(values));
        setIsLoading(false);
        setSubmitting(false);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("jwt", JSON.stringify(token));
            dispatch(setUserAsync(jwt(token)._id));
            localStorage.setItem("User", JSON.stringify(userInfo));
        }
    }, [token, userInfo]);

    useEffect(() => {
        const storedUser = localStorage.getItem("User");
        if (storedUser) {
            dispatch(getUser(JSON.parse(storedUser)));
        }
    }, []);

    const logout = useCallback(async () => {
        localStorage.removeItem("User");
        localStorage.removeItem("jwt");
        await dispatch(logoutUser());
    }, []);

    return {
        userInfo,
        register,
        isLoading,
        logout,
        login,
        token,
    };
}

export default useUser;
