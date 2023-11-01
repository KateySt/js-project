import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {findUsersAsync, selectUser, selectUsers} from "../features/user/UserSlice.js";
import {createChatAsync, findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {
    createMessageAsync,
    getMessagesAsync,
    getNotification,
    getNotifications,
    selectMessage,
    selectNotifications,
    updateMessages
} from "../features/message/MessageSlice.js";
import {selectWSS} from "../features/socket/SocketSlice.js";

function useChat() {
    const dispatch = useDispatch();
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatInfo = useSelector(selectChat);
    const chatsInfo = useSelector(selectChats);
    const user = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const wss = useSelector(selectWSS);
    const [potentialChat, setPotentialChat] = useState();
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const message = useSelector(selectMessage);
    const notifications = useSelector(selectNotifications);

    useEffect(() => {
        if (wss == null) return;
        wss.emit("addNewUser", user?._id);
        wss.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });
        return () => {
            wss.off("getOnlineUsers");
        };
    }, [wss]);

    useEffect(() => {
        if (wss == null) return;
        const recipientId = currentChat?.members.find(id => id !== user?._id);
        wss.emit("sendMessage", {...message, recipientId});
    }, [message]);

    useEffect(() => {
        if (wss == null) return;
        wss.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            dispatch(updateMessages(res));
        });
        wss.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {
                dispatch(getNotifications({...res, isRead: true}))
            } else {
                dispatch(getNotifications(res))
            }
        });
        return () => {
            wss.off("getMessage");
            wss.off("getNotification");
        }
    }, [currentChat]);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat.chat);
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Typing something...");
        await dispatch(createMessageAsync({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }, wss));
        setTextMessage("");
    }, []);

    useEffect(() => {
        if (user == null) return;
        setIsChatLoading(true);
        dispatch(findUserChatsAsync(user._id, wss));
        setIsChatLoading(false);
    }, [user, notifications]);

    useEffect(() => {
        if (currentChat == null) return;
        setIsMessageLoading(true);
        dispatch(getMessagesAsync(currentChat?._id, wss));
        setIsMessageLoading(false);
    }, [currentChat, message]);

    useEffect(() => {
        if (user == null) return;
        dispatch(findUsersAsync(wss));
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
    }, [chatsInfo]);

    const creatChat = useCallback(async (firstId, secondId) => {
        await dispatch(createChatAsync({
            firstId: firstId,
            secondId: secondId
        }, wss));
    }, [wss]);

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

