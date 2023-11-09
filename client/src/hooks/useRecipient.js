import {useDispatch, useSelector} from "react-redux";
import {getRecipientsAsync, selectRecipients, selectUser, setRecipientsAsync} from "../features/user/UserSlice.js";
import {useEffect} from "react";
import {selectChats} from "../features/chat/ChatSlice.js";
import {selectMessage, selectNotifications} from "../features/message/MessageSlice.js";

export const useRecipient = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const chatsInfo = useSelector(selectChats);
    const recipients = useSelector(selectRecipients);
    const message = useSelector(selectMessage);
    const notification = useSelector(selectNotifications);

    useEffect(() => {
        if (user == null) return;
        dispatch(setRecipientsAsync(user?._id));
        dispatch(getRecipientsAsync());
    }, [user, chatsInfo, message, notification]);

    return {
        recipients
    };
}