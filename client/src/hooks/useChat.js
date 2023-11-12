import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    findUsersAsync,
    getUsersOnlineAsync,
    selectJwt,
    selectUser,
    selectUsers,
    setRecipient,
    setUsersAsync,
    setUsersOnlineAsync
} from "../features/user/UserSlice.js";
import {
    createChatAsync,
    findUserChatsAsync,
    getChatAsync,
    selectChat,
    selectChats,
    setUserChatsAsync
} from "../features/chat/ChatSlice.js";
import {
    createMessageAsync,
    getCreatedMessageAsync,
    getMessageAsync,
    getMessagesAsync,
    getNotification,
    getNotificationAsync,
    selectMessage,
    selectNotifications,
    sendMessageAsync,
    setMessagesAsync
} from "../features/message/MessageSlice.js";


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
    const message = useSelector(selectMessage);
    const token = useSelector(selectJwt);
    const notification = useSelector(selectNotifications);

    useEffect(() => {
        if (!user) return;
        dispatch(setUsersOnlineAsync(user?._id));
        dispatch(getUsersOnlineAsync());
    }, []);

    useEffect(() => {
        if (!currentChat) return;
        if (currentChat?.groupName) {
            dispatch(sendMessageAsync({...message}, currentChat?._id));
        } else {
            const recipientId = currentChat?.members.find(id => id !== user?._id);
            dispatch(sendMessageAsync({...message, recipientId}));
        }
    }, [message]);

    useEffect(() => {
        dispatch(getNotificationAsync(currentChat));
        dispatch(getMessageAsync(currentChat));
    }, []);

    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat.chat);
        await dispatch(setRecipient(chat?.user ? chat?.user : chat?.chat));
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Typing something...");
        await dispatch(createMessageAsync({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }));
        setTextMessage("");
        await dispatch(getCreatedMessageAsync());
    }, []);

    useEffect(() => {
        if (!user) return;
        setIsChatLoading(true);
        dispatch(findUserChatsAsync(user._id));
        dispatch(setUserChatsAsync());
        setIsChatLoading(false);
    }, [user, chatInfo]);

    useEffect(() => {
        if (!currentChat) return;
        setIsMessageLoading(true);
        dispatch(getMessagesAsync(currentChat?._id));
        dispatch(setMessagesAsync());
        setIsMessageLoading(false);
    }, [currentChat, message, notification]);

    useEffect(() => {
        if (!token) return;
        dispatch(findUsersAsync());
    }, [token]);

    useEffect(() => {
        dispatch(setUsersAsync());
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
    }, [chatsInfo, users]);

    const creatChat = useCallback(async (firstId, secondId) => {
        await dispatch(createChatAsync({
            firstId: firstId,
            secondId: secondId
        }));
        await dispatch(getChatAsync());
    }, []);

    const markAllNotificationAsRead = useCallback(() => {
        dispatch(getNotification([]));
    }, []);

    const markNotificationAsRead = useCallback((n, userChats, user, notification) => {
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];
            return chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
        });
        const mNotifications = notification.map(el => {
            return n.senderId === el.senderId ? {...n, isRead: true} : el;
        });
        updateCurrentChat(desiredChat);
        dispatch(getNotification(mNotifications));
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
        users,
        markAllNotificationAsRead,
        markNotificationAsRead,
    };
}

export default useChat;

