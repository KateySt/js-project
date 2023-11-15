import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../features/user/UserSlice.js";
import {useCallback, useState} from "react";
import {createGroupAsync, getGroupAsync} from "../features/chat/ChatSlice.js";

export const useGroup = () => {
    const user = useSelector(selectUser);
    const [selectedUsers, setSelectedUsers] = useState([user?._id]);
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState('');

    const creatGroup = useCallback(async () => {
        if (!groupName) return;
        await dispatch(createGroupAsync({
            avatar: groupAvatar,
            groupName: groupName,
            members: selectedUsers,
        }));
        setGroupName('');
        setGroupAvatar('');
        setSelectedUsers([user?._id]);
        await dispatch(getGroupAsync());
    }, [selectedUsers]);

    return {
        creatGroup,
        selectedUsers,
        setSelectedUsers,
        setGroupName,
        setGroupAvatar,
        groupName,
        groupAvatar,
    };
}