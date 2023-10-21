import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import jwt from "jwt-decode";
import {findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {selectJwt, selectUser} from "../features/user/UsersSlice.js";

function useChat() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const chatInfo = useSelector(selectChat);
    const chatsInfo = useSelector(selectChats);
    const token = localStorage.getItem("jwt");

    useEffect(() => {
        if (token) {
            setIsLoading(true);
            dispatch(findUserChatsAsync(jwt(token)._id));
            setIsLoading(false);
        }
    }, [token]);


    return {
        chatInfo,
        chatsInfo,
        isLoading,

    };
}

export default useChat;