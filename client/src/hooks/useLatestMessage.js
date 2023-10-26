import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectMessages, selectNotifications} from "../features/message/MessageSlice.js";

export const useLatestMessage = (chat) => {
    const [latestMessage, setLatestMessage] = useState(null);
    const messages = useSelector(selectMessages);
    const notifications = useSelector(selectNotifications);

    useEffect(() => {
        axios({
            method: 'get',
            url: `messages/${chat?._id}`,
        })
            .then((el) => el.data)
            .then(el => setLatestMessage(el[el?.length - 1]))
            .catch((err) => console.log(err));

    }, [messages, notifications]);

    return {
        latestMessage
    };
}