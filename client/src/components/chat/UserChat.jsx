import React from 'react';
import {Stack} from "react-bootstrap";
import avatar from "../../assets/undraw_profile_pic_re_iwgo.svg";
import {useRecipient} from "../../hooks/useRecipient.js";
import {unreadNotificationsFun} from "../../utils/unreadNotifications.js";
import {useLatestMessage} from "../../hooks/useLatestMessage.js";
import moment from "moment";
import {useSelector} from "react-redux";
import {selectNotifications} from "../../features/message/MessageSlice.js";

const UserChat = ({data, onlineUsers, markThisNotificationAsRead}) => {
    const {recipient} = useRecipient(data);
    const notifications = useSelector(selectNotifications);
    const unreadNotifications = unreadNotificationsFun(notifications);
    const {latestMessage} = useLatestMessage(data);
    const thisUserNotifications = unreadNotifications?.filter(n => {
        return n.senderId === recipient?._id
    });
    const isOnline = onlineUsers?.some((user) => user?.userId === recipient?._id);

    const truncateText = (text) => {
        let shortText = text.substring(0, 20);
        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            onClick={() => {
                if (thisUserNotifications?.length !== 0) {
                    markThisNotificationAsRead(thisUserNotifications, notifications);
                }
            }}
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} height="35px" alt="avatar"/>
                </div>
                <div className="text-content">
                    <div className="name">{recipient?.name}</div>
                    <div className="text">
                        {latestMessage?.text &&
                            (<span>{truncateText(latestMessage?.text)}</span>)
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {moment(latestMessage?.createdAt).calendar()}
                </div>
                <div
                    className={thisUserNotifications?.length > 0 ?
                        "this-user-notifications"
                        : ""
                    }
                >
                    {thisUserNotifications?.length > 0 ?
                        thisUserNotifications?.length
                        : ""
                    }
                </div>
                <span className={isOnline ? "user-online" : ""}></span>
            </div>
        </Stack>
    );
}

export default UserChat;