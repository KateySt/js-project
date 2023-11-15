import MultipleSelect from "../../components/multipleSelect/MultipleSelect.jsx";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import CustomInput from "../../components/сustomInput/CustomInput.jsx";
import {useGroup} from "../../hooks/useGroup.js";
import validator from "validator";

const Group = () => {
    const {
        selectedUsers,
        setSelectedUsers,
        creatGroup,
        setGroupName,
        setGroupAvatar,
        groupAvatar,
        groupName,
    } = useGroup();

    return (
        <>
            <p>Group name:</p>
            <CustomInput
                onInputChange={setGroupName}
                validationFn={(value) => value.length > 3}
            />
            <p>Group avatar:</p>
            <CustomInput
                onInputChange={setGroupAvatar}
                validationFn={(value) => validator.isURL(value) || value === ''}
            />
            <MultipleSelect
                group={selectedUsers}
                setGroup={setSelectedUsers}
            />
            <Button
                className="mt-2"
                onClick={creatGroup}
                disabled={(!validator.isURL(groupAvatar)
                        || groupAvatar === '')
                    && groupName.length < 3}
            >
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