import {useDispatch, useSelector} from "react-redux";
import {selectRecipients, selectUser, setRecipientsAsync} from "../features/user/UserSlice.js";
import {useEffect} from "react";
import {selectChats} from "../features/chat/ChatSlice.js";
import {selectMessage} from "../features/message/MessageSlice.js";
import {selectWSS} from "../features/SocketSlice.js";

export const useRecipient = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const chatsInfo = useSelector(selectChats);
    const recipients = useSelector(selectRecipients);
    const message = useSelector(selectMessage);
    const socket = useSelector(selectWSS);
    useEffect(() => {
        if (user == null) return;
        dispatch(setRecipientsAsync(user,socket));
    }, [user, chatsInfo, message]);

    return {
        recipients
    };
}