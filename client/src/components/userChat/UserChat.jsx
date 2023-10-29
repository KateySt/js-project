import {Stack} from "react-bootstrap";
import avatar from "../../assets/undraw_profile_pic_re_iwgo.svg";
import {unreadNotificationsFun} from "../../utils/unreadNotifications.js";
import moment from "moment";
import {useSelector} from "react-redux";
import {selectNotifications} from "../../features/message/MessageSlice.js";

const UserChat = ({data, onlineUsers, markThisNotificationAsRead}) => {
    const notifications = useSelector(selectNotifications);
    const unreadNotifications = unreadNotificationsFun(notifications);
    const thisUserNotifications = unreadNotifications?.filter(n => {
        return n.senderId === data?._id
    });
    const isOnline = onlineUsers?.some((user) => user?.userId === data?._id);

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
                    <div className="name">{data?.name}</div>
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