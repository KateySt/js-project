import {useDispatch, useSelector} from "react-redux";
import {
    findUsersFromChatAsync,
    getUsersFromChatAsync,
    selectMembers,
    updateMemberInGroupAsync
} from "../features/chat/ChatSlice.js";
import {useCallback, useEffect, useState} from "react";
import {selectUser, selectUsers, setRecipient} from "../features/user/UserSlice.js";

export const useGroupInfoModal = (currentChat, groupInfo) => {
    const dispatch = useDispatch();
    const members = useSelector(selectMembers);
    const [removeUsers, setRemoveUsers] = useState([]);
    const [addUsers, setAddUsers] = useState([]);
    const users = useSelector(selectUsers);
    const user = useSelector(selectUser);
    const potentialMembers = users.filter(user => !groupInfo?.members.some(member => member === user._id));
    const [isEdit, setIsEdit] = useState(true);
    const membersAfterAction = [...members.filter(member => !removeUsers.some(user => user?._id === member._id)), ...addUsers];
    const [isEditingGroupName, setIsEditingGroupName] = useState(false);
    const [editedGroupName, setEditedGroupName] = useState(currentChat?.name || groupInfo?.groupName);

    const handleSaveEditedGroupName = useCallback(async (newGroupName) => {
        await dispatch(updateMemberInGroupAsync({
            ...groupInfo,
            groupName: newGroupName,
        }, user));
        await dispatch(setRecipient({
            ...groupInfo,
            groupName: newGroupName,
        }));
    }, []);
    const handleEditMembers = () => {
        setIsEdit(false);
        setAddUsers([]);
        setRemoveUsers([]);
    };
    const handleUpdateMembers = useCallback(async () => {
        setIsEdit(true);
        const leftMembers = groupInfo?.members.filter(member => !removeUsers.some(user => user?._id === member));
        const addUsersId = addUsers.map(user => user?._id);
        const updateMembers = [...leftMembers, ...addUsersId];
        await dispatch(updateMemberInGroupAsync({
            ...groupInfo,
            members: updateMembers,
        }, user));
    }, []);

    useEffect(() => {
        dispatch(findUsersFromChatAsync(groupInfo?._id));
    }, [groupInfo]);

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
        setIsEditingGroupName,
        setEditedGroupName,
        handleSaveEditedGroupName,
        isEditingGroupName,
        editedGroupName,
    };
}
