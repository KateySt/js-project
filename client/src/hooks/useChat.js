import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {createChatAsync, findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {findUsersAsync, selectUser, selectUsers} from "../features/user/UsersSlice.js";
import {createMessageAsync, getMessagesAsync} from "../features/message/MessageSlice.js";

function useChat() {
    const dispatch = useDispatch();
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatInfo = useSelector(selectChat);
    const chatsInfo = useSelector(selectChats);
    const user = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const [potentialChat, setPotentialChat] = useState();
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Typing something...");
        await dispatch(createMessageAsync({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }));
        setTextMessage("");
    }, []);

    useEffect(() => {
        if (user) {
            setIsChatLoading(true);
            dispatch(findUserChatsAsync(user._id));
            setIsChatLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (currentChat) {
            setIsMessageLoading(true);
            dispatch(getMessagesAsync(currentChat?._id));
            setIsMessageLoading(false);
        }
    }, [currentChat]);

    useEffect(() => {
        if (user) {
            dispatch(findUsersAsync());
            const pChats = users.filter((u) => {
                let isChatCreated = false;
                if (user._id === u._id) return false;
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
        await dispatch(createChatAsync({
            firstId: firstId,
            secondId: secondId
        }));
    }, []);

    return {
        chatInfo,
        chatsInfo,
        isChatLoading,
        potentialChat,
        creatChat,
        user,
        updateCurrentChat,
        currentChat,
        isMessageLoading,
        sendTextMessage,
    };
}

export default useChat;

