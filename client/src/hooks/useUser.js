import {useCallback, useEffect, useState} from "react";
import jwt from 'jwt-decode';
import {useDispatch, useSelector} from "react-redux";
import {
    loginUserAsync,
    logoutUser,
    registerUserAsync,
    selectJwt,
    selectUser,
    setToken,
    setUser,
    setUserAsync
} from "../features/user/UserSlice.js";
import {selectSocket} from "../features/socket/SocketSlice.js";

function useUser() {
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector(selectJwt);
    const userInfo = useSelector(selectUser);
    const dispatch = useDispatch();
    const socket = useSelector(selectSocket);

    const register = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(registerUserAsync(values));
        setIsLoading(false);
        setSubmitting(false);
    }, [socket]);

    const login = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(loginUserAsync(values));
        setIsLoading(false);
        setSubmitting(false);
    }, [socket]);

    useEffect(() => {
        if (!token) return
        localStorage.setItem("jwt", JSON.stringify(token));
        dispatch(setUserAsync(jwt(token)._id));
    }, [token]);

    useEffect(() => {
        if (!userInfo) return;
        localStorage.setItem("User", JSON.stringify(userInfo));
    }, [userInfo]);

    useEffect(() => {
        const storedJWT = localStorage.getItem("jwt");
        if (storedJWT == null) return;
        dispatch(setToken(JSON.parse(storedJWT)));
        const storedUser = localStorage.getItem("User");
        if (storedUser == null) return;
        dispatch(setUser(JSON.parse(storedUser)));
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
