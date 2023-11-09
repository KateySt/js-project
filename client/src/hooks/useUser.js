import {useCallback, useEffect, useState} from "react";
import jwt from 'jwt-decode';
import {useDispatch, useSelector} from "react-redux";
import {
    foundUserAsync,
    getTokenAsync,
    logoutUser,
    selectJwt,
    selectUser,
    setAuthAsync,
    setToken,
    setUser,
    setUserAsync
} from "../features/user/UserSlice.js";

function useUser() {
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector(selectJwt);
    const userInfo = useSelector(selectUser);
    const dispatch = useDispatch();

    const register = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(setAuthAsync(values));
        await dispatch(getTokenAsync());
        setIsLoading(false);
        setSubmitting(false);
    }, []);

    const login = useCallback(async (values, {setSubmitting}) => {
        setIsLoading(true);
        await dispatch(setAuthAsync(values));
        await dispatch(getTokenAsync());
        setIsLoading(false);
        setSubmitting(false);
    }, []);

    useEffect(() => {
        if (!token) return
        localStorage.setItem("jwt", JSON.stringify(token));
        dispatch(foundUserAsync(jwt(token)._id));
    }, [token]);

    useEffect(() => {
        dispatch(setUserAsync());
    }, []);

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
