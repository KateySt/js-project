import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectOnlineUsers, selectUser, selectUsers, setRecipient} from "../features/user/UserSlice.js";
import {selectChat, selectChats, selectCurrentChat, setChat, setCurrentChat} from "../features/chat/ChatSlice.js";
import {getNotification, setMessage} from "../features/message/MessageSlice.js";

function useChat() {
    const dispatch = useDispatch();
    const chatInfo = useSelector(selectChat);
    const chatsInfo = useSelector(selectChats);
    const user = useSelector(selectUser);
    const users = useSelector(selectUsers);
    const [potentialChat, setPotentialChat] = useState();
    const currentChat = useSelector(selectCurrentChat);
    const onlineUsers = useSelector(selectOnlineUsers);

    const updateCurrentChat = useCallback(async (chat) => {
        await dispatch(setCurrentChat(chat.chat));
        await dispatch(setRecipient(chat.user));
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Typing something...");
        await dispatch(setMessage({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
        }));
        await dispatch(setMessage(null));
        setTextMessage("");
    }, []);

    useEffect(() => {
        if (user == null) return;
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
        await dispatch(setChat({
            firstId: firstId,
            secondId: secondId
        }));
    }, []);

    const markAllNotificationAsRead = useCallback(async (notification) => {
        const mNotification = notification.map(n => {
            return [{...n, isRead: true}]
        });
        await dispatch(getNotification(mNotification));
    }, []);

    const markNotificationAsRead = useCallback(async (n, userChats, user, notification) => {
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];
            return chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
        });
        const mNotifications = notification.map(el => {
            return n.senderId === el.senderId ? {...n, isRead: true} : el;
        });
        await updateCurrentChat(desiredChat);
        await dispatch(getNotification(mNotifications));
    }, []);

    const markThisNotificationAsRead = useCallback(async (thisUserNotification, notifications) => {
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
        await dispatch(getNotification(mNotification));
    }, []);

    return {
        chatInfo,
        chatsInfo,
        potentialChat,
        creatChat,
        user,
        updateCurrentChat,
        currentChat,
        sendTextMessage,
        onlineUsers,
        users,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisNotificationAsRead,
    };
}

export default useChat;

