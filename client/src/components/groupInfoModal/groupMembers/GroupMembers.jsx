import {Button, ListGroup} from 'react-bootstrap';
import Avatar from "react-avatar";
import './groupMembers.css';
import {selectUser} from "../../../features/user/UserSlice.js";
import {useSelector} from "react-redux";

const GroupMembers = ({member, onAction, action, isEdit}) => {
    const user = useSelector(selectUser);
    return (
        <>
            <ListGroup.Item
                key={member?._id}
                className="d-flex align-items-center"
            >
                <Avatar
                    name={member?.name}
                    maxInitials={1}
                    size="50"
                    className="round-avatar"
                    src={member?.avatar}
                    alt="avatar"
                />
                <span className="ms-3">{member.name}</span>
                {(member?._id != user?._id) && !isEdit &&
                    <Button
                        variant={action === "Remove" ? "btn btn-outline-danger" : "btn btn-outline-info"}
                        className="ms-auto"
                        onClick={() => onAction((pre) => [...pre, member])}>
                        {action}
                    </Button>
                }
            </ListGroup.Item>
        </>
    );
}
export default GroupMembers;