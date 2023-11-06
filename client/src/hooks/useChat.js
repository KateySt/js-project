import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    findUsersAsync,
    selectUser,
    selectUsers,
    selectUsersOnline,
    setRecipient,
    setUsersOnlineAsync
} from "../features/user/UserSlice.js";
import {createChatAsync, findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {
    createMessageAsync,
    getMessageAsync,
    getMessagesAsync,
    getNotification,
    getNotificationAsync,
    selectMessage,
    selectNotifications,
    sendMessageAsync
} from "../features/message/MessageSlice.js";
import {selectSocketSecure} from "../features/socket/SocketSlice.js";


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
    const notifications = useSelector(selectNotifications);
    const socket = useSelector(selectSocketSecure);

    useEffect(() => {
        if (!user) return;
        dispatch(setUsersOnlineAsync(user));
    }, [socket]);

    useEffect(() => {
        dispatch(sendMessageAsync(message, currentChat, user));
    }, [message]);

    useEffect(() => {
        dispatch(getMessageAsync(currentChat));
        dispatch(getNotificationAsync(currentChat));
    }, [currentChat]);

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
        setTextMessage("");
    }, []);

    useEffect(() => {
        if (user == null) return;
        setIsChatLoading(true);
        dispatch(findUserChatsAsync(user._id));
        setIsChatLoading(false);
    }, [user, chatInfo]);

    useEffect(() => {
        if (currentChat == null) return;
        setIsMessageLoading(true);
        dispatch(getMessagesAsync(currentChat?._id));
        setIsMessageLoading(false);
    }, [currentChat, message]);

    useEffect(() => {
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
    }, [chatsInfo, users]);

    const creatChat = useCallback(async (firstId, secondId) => {
        await dispatch(createChatAsync({
            firstId: firstId,
            secondId: secondId
        }));
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

