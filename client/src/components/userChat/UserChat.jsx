import {Stack} from "react-bootstrap";
import moment from "moment";
import useUserChat from "../../hooks/useUserChat.js";
import Avatar from 'react-avatar';
import './userChat.css';

const UserChat = ({data, showAvatarOnly, isLoading}) => {
    const {
        truncateText,
        isOnline,
        thisUserNotifications,
        markThisNotificationAsRead,
        notifications
    } = useUserChat(data);

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className={`user-card align-items-center p-2 justify-content-between ${
                showAvatarOnly ? 'avatar-only' : ''
            }`}
            role="button"
            onClick={() => {
                if (thisUserNotifications?.length !== 0) {
                    markThisNotificationAsRead(thisUserNotifications, notifications);
                }
            }}
        >
            {isLoading &&
                <div className="spinner-grow text-light" role="status"/>
            }
            {showAvatarOnly ? (
                <>
                    <div className="d-flex ms-auto relative-avatar">
                        <Avatar
                            name={data.chat?.groupName ? data.chat?.groupName : data.user?.name}
                            maxInitials={1}
                            size="50"
                            className="round-avatar"
                            src={data.chat?.avatar || data.user?.avatar}
                            alt="avatar"
                        />
                        {isOnline && <span className="user-online"></span>}
                        {thisUserNotifications?.length > 0 && (
                            <div className="this-user-notifications">
                                {thisUserNotifications?.length}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="d-flex">
                        <div className="ms-auto relative-avatar me-3">
                            <Avatar
                                name={data.chat?.groupName ? data.chat?.groupName : data.user?.name}
                                maxInitials={1}
                                size="50"
                                className="round-avatar"
                                src={data.chat?.avatar || data.user?.avatar}
                                alt="avatar"
                            />
                            {isOnline && <span className="user-online"></span>}
                            {thisUserNotifications?.length > 0 && (
                                <div className="this-user-notifications">
                                    {thisUserNotifications?.length}
                                </div>
                            )}
                        </div>
                        <div className=" text-content">
                            <div className="name">
                                {data.chat?.groupName ? data.chat?.groupName : data.user?.name}
                            </div>
                            <div className="text">
                                {data.message[0]?.text &&
                                    (data.message[0]?.text.startsWith('blob:') ?
                                        <span>{"voice message"}</span>
                                        :
                                        <span>{truncateText(data.message[0]?.text)}</span>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="d-flex flex-column align-items-end">
                        <div className="date">
                            {data.message.length !== 0
                                ? moment(data.message[0]?.createdAt).format('HH:mm')
                                : ''}
                        </div>
                    </div>
                </>
            )}
        </Stack>
    );
};

export default UserChat;