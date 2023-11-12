import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {getNotification, selectNotifications} from "../features/message/MessageSlice.js";
import {selectUser, selectUsersOnline} from "../features/user/UserSlice.js";
import {unreadNotificationsFun} from "../utils/unreadNotifications.js";

function useUserChat(data) {
    const dispatch = useDispatch();
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
    const user = useSelector(selectUser);
    const onlineUsers = useSelector(selectUsersOnline);
    const notifications = useSelector(selectNotifications);
    const unreadNotifications = unreadNotificationsFun(notifications);
    const thisUserNotifications = unreadNotifications?.filter(n => (n.chatId === data.chat?._id &&
        n.senderId !== user?._id));
    const isOnline = onlineUsers?.some((user) => user?.userId === data.user?._id);
    const truncateText = (text) => {
        let shortText = text.substring(0, 20);
        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };
    return {
        truncateText,
        isOnline,
        thisUserNotifications,
        markThisNotificationAsRead,
        notifications,
    };
}

export default useUserChat;