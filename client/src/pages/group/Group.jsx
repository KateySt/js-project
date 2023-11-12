import MultipleSelect from "../../components/multipleSelect/MultipleSelect.jsx";
import {useCallback, useState} from "react";
import {Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {createGroupAsync, getGroupAsync, selectGroup} from "../../features/chat/ChatSlice.js";
import {selectUser} from "../../features/user/UserSlice.js";
import {Link} from "react-router-dom";
import CustomInput from "../../components/сustomInput/CustomInput.jsx";

const Group = () => {
    const user = useSelector(selectUser);
    const [selectedUsers, setSelectedUsers] = useState([user?._id]);
    const dispatch = useDispatch();
    const group = useSelector(selectGroup);
    const [groupName, setGroupName] = useState(null);

    const creatGroup = useCallback(async () => {
        if (!groupName) return;
        await dispatch(createGroupAsync({
            groupName: groupName,
            members: selectedUsers,
        }));
        setGroupName(null);
        setSelectedUsers([user?._id]);
        await dispatch(getGroupAsync());
    }, [selectedUsers]);

    return (
        <>
            <p>Group name:</p>
            <CustomInput onInputChange={setGroupName}/>
            <p><br/></p>
            <MultipleSelect
                group={selectedUsers}
                setGroup={setSelectedUsers}
            />
            <p><br/></p>
            <Button onClick={creatGroup}>
                <Link
                    to="/chat"
                    className="link-light text-decoration-none"
                >
                    Creat group
                </Link>
            </Button>
        </>
    );
}
export default Group;