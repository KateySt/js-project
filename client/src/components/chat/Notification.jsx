import React, {useState} from 'react';
import useChat from "../../hooks/useChat.js";
import {unreadNotificationsFun} from "../../utils/unreadNotifications.js";
import moment from "moment";
import {useSelector} from "react-redux";
import {selectNotifications} from "../../features/message/MessageSlice.js";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {chatsInfo, users, user, markAllNotificationAsRead, markNotificationAsRead} = useChat();
    const notifications = useSelector(selectNotifications);
    const unreadNotifications = unreadNotificationsFun(notifications);
    const modifiedNotifications = notifications.map(n => {
        const sender = users.find(user => user._id === n.senderId);
        return {
            ...n,
            senderName: sender?.name
        }
    });

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                     className="bi bi-chat-left-dots" viewBox="0 0 16 16">
                    <path
                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path
                        d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                {unreadNotifications?.length === 0 ? null :
                    <span className="notification-count">
                        <span>{unreadNotifications?.length}</span>
                    </span>
                }
            </div>
            {isOpen &&
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className="mark-as-read"
                             onClick={() => markAllNotificationAsRead(notifications)}
                        >
                            Mark all as read
                        </div>
                    </div>
                    {modifiedNotifications?.length === 0 ? <span>No notification yet ...</span> : null}
                    {modifiedNotifications &&
                        modifiedNotifications.map((n, index) => {
                            return (
                                <div
                                    key={index}
                                    className={n.isRead ? "notification" : "notification not-read"}
                                    onClick={() => {
                                        markNotificationAsRead(n, chatsInfo, user, notifications);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span>{`${n.senderName} send you a new message`}</span>
                                    <span className="notification-time">
                                        {moment(n.date).calendar()}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}

export default Notification;