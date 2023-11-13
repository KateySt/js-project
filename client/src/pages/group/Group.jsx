import MultipleSelect from "../../components/multipleSelect/MultipleSelect.jsx";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import CustomInput from "../../components/сustomInput/CustomInput.jsx";
import {useGroup} from "../../hooks/useGroup.js";

const Group = () => {
    const {
        selectedUsers,
        setSelectedUsers,
        creatGroup,
        setGroupName,
    } = useGroup();

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