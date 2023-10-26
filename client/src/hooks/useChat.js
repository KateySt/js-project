import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {createChatAsync, findUserChatsAsync, selectChat, selectChats} from "../features/chat/ChatSlice.js";
import {findUsersAsync, selectUser, selectUsers} from "../features/user/UsersSlice.js";
import {
    createMessageAsync,
    getMessagesAsync,
    getNotification, getNotifications,
    selectMessage,
    selectNotifications,
    updateMessages
} from "../features/message/MessageSlice.js";
import {io} from "socket.io-client";

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
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const message = useSelector(selectMessage);
    const notifications = useSelector(selectNotifications);

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    useEffect(() => {
        if (socket == null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });
        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    useEffect(() => {
        if (socket == null) return;
        const recipientId = currentChat?.members.find(id => id !== user?._id);
        socket.emit("sendMessage", {...message, recipientId});
    }, [message]);

    useEffect(() => {
        if (socket == null) return;
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            dispatch(updateMessages(res));
        });
        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {
                dispatch(getNotifications({...res, isRead: true}))
            } else {
                dispatch(getNotifications(res))
            }
        });
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

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
    }, [user, notifications]);

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

