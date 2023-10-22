import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import jwt from "jwt-decode";
import {createChatAsync, findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {findUsersAsync, selectJwt, selectUser, selectUsers} from "../features/user/UsersSlice.js";

function useChat() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const chatInfo = useSelector(selectChat);
    const chatsInfo = useSelector(selectChats);
    const token = useSelector(selectJwt);
    const user = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const [potentialChat, setPotentialChat] = useState();

    useEffect(() => {
        if (token) {
            setIsLoading(true);
            dispatch(findUserChatsAsync(jwt(token)._id));
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            dispatch(findUsersAsync());
            const pChats = users.filter((u) => {
                let isChatCreated = false;
                if (jwt(token)._id === u._id) return false;
                if (chatsInfo) {
                    isChatCreated = chatsInfo?.some(chat => {
                        return chat.members[0] === u._id ||
                            chat.members[1] === u._id;
                    })
                }
                return !isChatCreated;
            });
            setPotentialChat(pChats);
        }
    }, [chatsInfo]);

    const creatChat = useCallback(async (firstId, secondId) => {
        await dispatch(createChatAsync({firstId: firstId, secondId: secondId}));
    }, []);

    return {
        chatInfo,
        chatsInfo,
        isLoading,
        potentialChat,
        creatChat,
        user
    };
}

export default useChat;

