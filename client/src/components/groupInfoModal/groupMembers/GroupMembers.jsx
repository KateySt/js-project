import {ListGroup} from 'react-bootstrap';
import Avatar from "react-avatar";

const GroupMembers = ({member}) => {
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
            </ListGroup.Item>
        </>
    );
}
export default GroupMembers;