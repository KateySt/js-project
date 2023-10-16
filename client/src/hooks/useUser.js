import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {registerUserAsync, selectJwt} from "../features/users/UsersSlice.js";

function useUser() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const jwt = useSelector(selectJwt);

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const registerUser = (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        dispatch(registerUserAsync(registerInfo));
        localStorage.setItem("User", JSON.stringify(registerInfo));
        setIsRegisterLoading(false);
    };

    return {
        registerInfo,
        updateRegisterInfo,
        registerUser,
        isRegisterLoading,
    };
}

export default useUser;
