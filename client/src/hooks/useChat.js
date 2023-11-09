import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    findUsersAsync,
    getUsersOnlineAsync,
    selectJwt,
    selectUser,
    selectUsers,
    selectUsersOnline,
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
    const onlineUsers = useSelector(selectUsersOnline);
    const message = useSelector(selectMessage);
    const token = useSelector(selectJwt);
    const notification = useSelector(selectNotifications);
    console.log(notification)
    useEffect(() => {
        if (!user) return;
        dispatch(setUsersOnlineAsync(user?._id));
        dispatch(getUsersOnlineAsync());
    }, []);

    useEffect(() => {
        if (!currentChat) return;
        const recipientId = currentChat?.members.find(id => id !== user?._id);
        dispatch(sendMessageAsync({...message, recipientId}));
    }, [message]);

    useEffect(() => {
        dispatch(getNotificationAsync(currentChat));
        dispatch(getMessageAsync(currentChat));
    }, []);

    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat.chat);
        await dispatch(setRecipient(chat.user));
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Typing something...");
        await dispatch(createMessageAsync({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }));
        dispatch(getCreatedMessageAsync());
        setTextMessage("");
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
    }, [currentChat, message]);

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

    const markAllNotificationAsRead = useCallback((notification) => {
        const mNotification = notification.map(n => {
            return [{...n, isRead: true}]
        });
        dispatch(getNotification(mNotification));
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

    const markThisNotificationAsRead = useCallback((thisUserNotification, notifications) => {
        const mNotification = notifications.map(el => {
            let notification;
            thisUserNotification.forEach(n => {
                if (n.senderId === el.senderId) {
                    notification = {...n, isRead: true};
                } else {
                    notification = el;
                }
            });
            return notification;
        });
        dispatch(getNotification(mNotification));
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
        onlineUsers,
        users,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisNotificationAsRead,
    };
}

export default useChat;

