import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {registerUserAsync, selectJwt} from "../features/users/UsersSlice.js";

function useUser() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const jwt = useSelector(selectJwt);

    const updateRegisterInfo = (values, actions) => {
        setIsRegisterLoading(true);
        dispatch(registerUserAsync(values));
        localStorage.setItem("User", JSON.stringify(values));
        setIsRegisterLoading(false);
        actions.setSubmitting(false);
    }

    return {
        updateRegisterInfo,
        isRegisterLoading,
    };
}

export default useUser;
