import {useSelector} from "react-redux";
import {selectUser} from "../features/user/UserSlice.js";
import {useEffect, useState} from "react";
import {selectSocket} from "../features/socket/SocketSlice.js";

export const useRecipient = () => {
    const user = useSelector(selectUser);
    const [recipients, setRecipients] = useState(null);
    const socket = useSelector(selectSocket);

    useEffect(() => {
        if (socket == null) return;
        if (user == null) return;
        socket.emit("findRecipient", user?._id);
        socket.on("getRecipient", (user) => {
            setRecipients(user);
        });
        return () => {
            socket.off("getUser");
        };
    }, [user]);
    return {
        recipients
    };
}