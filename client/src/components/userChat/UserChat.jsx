import {Stack} from "react-bootstrap";
import moment from "moment";
import useUserChat from "../../hooks/useUserChat.js";
import Avatar from 'react-avatar';
import './userChat.css';

const UserChat = ({data}) => {
    const {
        truncateText,
        isOnline,
        thisUserNotifications,
        markThisNotificationAsRead,
        notifications,
    } = useUserChat(data);
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
                    <Avatar
                        name={data.chat?.groupName ? data.chat?.groupName : data.user?.name}
                        maxInitials={1}
                        size="50"
                        className="round-avatar"
                        src={data.chat?.avatar || data.user?.avatar}
                        alt="avatar"/>
                </div>
                <div className="text-content">
                    <div className="name">
                        {data.chat?.groupName ? data.chat?.groupName : data.user?.name}
                    </div>
                    <div className="text">
                        {data.message[0]?.text &&
                            (<span>{truncateText(data.message[0]?.text)}</span>)
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    {data.message.length !== 0 ? moment(data.message[0]?.createdAt).calendar() : ''}
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