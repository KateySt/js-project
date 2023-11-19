import {useDispatch, useSelector} from "react-redux";
import {
    findUsersFromChatAsync,
    getUsersFromChatAsync,
    selectMembers,
    updateMemberInGroupAsync
} from "../features/chat/ChatSlice.js";
import {useEffect, useState} from "react";
import {selectUsers} from "../features/user/UserSlice.js";

export const useGroupInfoModal = (currentChat) => {
    const dispatch = useDispatch();
    const members = useSelector(selectMembers);
    const [removeUsers, setRemoveUsers] = useState([]);
    const [addUsers, setAddUsers] = useState([]);
    const users = useSelector(selectUsers);
    const potentialMembers = users.filter(user => !currentChat?.members.some(member => member === user._id));
    const [isEdit, setIsEdit] = useState(true);
    const membersAfterAction = [...members.filter(member => !removeUsers.some(user => user?._id === member._id)), ...addUsers];
    const handleEditMembers = () => {
        setIsEdit(false);
        setAddUsers([]);
        setRemoveUsers([]);
    };
    const handleUpdateMembers = async () => {
        setIsEdit(true);
        const leftMembers = currentChat?.members.filter(member => !removeUsers.some(user => user?._id === member));
        const addUsersId = addUsers.map(user => user?._id);
        const updateMembers = [...leftMembers, ...addUsersId];

        await dispatch(updateMemberInGroupAsync({
            ...currentChat,
            members: updateMembers,
        }));
    }

    useEffect(() => {
        dispatch(findUsersFromChatAsync(currentChat?._id));
    }, [currentChat]);

    useEffect(() => {
        dispatch(getUsersFromChatAsync());
    }, []);

    return {
        membersAfterAction,
        potentialMembers,
        isEdit,
        handleUpdateMembers,
        handleEditMembers,
        setRemoveUsers,
        setAddUsers,
    };
}
