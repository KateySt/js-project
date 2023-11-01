import {useSelector} from "react-redux";
import {selectUser} from "../features/user/UserSlice.js";
import {useEffect, useState} from "react";
import {selectWSS} from "../features/socket/SocketSlice.js";

export const useRecipient = () => {
    const user = useSelector(selectUser);
    const [recipients, setRecipients] = useState(null);
    const wss = useSelector(selectWSS);

    useEffect(() => {
        if (wss == null) return;
        if (user == null) return;
        wss.emit("findRecipient", user?._id);
        wss.on("getRecipient", (user) => {
            setRecipients(user);
        });
        return () => {
            wss.off("getUser");
        };
    }, [user]);

    return {
        recipients
    };
}