import {useDispatch, useSelector} from "react-redux";
import {findUsersFromChatAsync, getUsersFromChatAsync, selectMembers} from "../features/chat/ChatSlice.js";
import {useEffect} from "react";

export const useGroupInfoModal = (currentChat) => {
    const dispatch = useDispatch();
    const members = useSelector(selectMembers);

    useEffect(() => {
        dispatch(findUsersFromChatAsync(currentChat?._id));
    }, [currentChat]);

    useEffect(() => {
        dispatch(getUsersFromChatAsync());
    }, []);

    return {
        members,
    };
}
