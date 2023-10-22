import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {findUserAsync, selectRecipient, selectUser} from "../features/user/UsersSlice.js";

export const useRecipient = (chat) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const recipientId = chat?.members.find(id => id !== user._id);
    const recipient = useSelector(selectRecipient);

    useEffect(() => {
        if (recipientId) {
            dispatch(findUserAsync(recipientId));
        }
    }, [recipientId]);

    return {
        recipient
    };
}