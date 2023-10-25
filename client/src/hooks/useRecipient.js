import {useSelector} from "react-redux";
import {selectUser} from "../features/user/UsersSlice.js";
import {useEffect, useState} from "react";
import axios from "axios";

export const useRecipient = (chat) => {
    const user = useSelector(selectUser);
    const recipientId = chat?.members.find(id => id !== user._id);
    const [recipient, setRecipient] = useState(null);

    useEffect(() => {
        if (recipientId) {
            axios({
                method: 'get',
                url: `users/find/${recipientId}`,
            })
                .then((user) => (setRecipient(user.data)))
                .catch((err) => console.log(err));
        }
    }, [recipientId]);
    return {
        recipient,
        recipientId,
    };
}