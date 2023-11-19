import {Button, ListGroup, Modal} from 'react-bootstrap';
import GroupMembers from "./groupMembers/GroupMembers.jsx";
import {useGroupInfoModal} from "../../hooks/useGroupInfoModal.js";
import './groupInfoModal.css';

const GroupInfoModal = ({show, handleClose, groupInfo, currentChat}) => {
    const {
        membersAfterAction,
        potentialMembers,
        handleEditMembers,
        handleUpdateMembers,
        isEdit,
        setAddUsers,
        setRemoveUsers,
    } = useGroupInfoModal(currentChat);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton={handleClose} className="modal-group">
                <Modal.Title>Group Information</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-group">
                <div className="mb-3">
                    <h5>Group Name: {groupInfo.name || groupInfo?.groupName}</h5>
                </div>
                <h5>Members:</h5>
                <ListGroup className="list-group scroll-list-group mb-3">
                    {membersAfterAction.map((member, index) => (
                        <GroupMembers
                            key={index}
                            member={member}
                            action={"Remove"}
                            isEdit={isEdit}
                            onAction={setRemoveUsers}/>
                    ))}
                </ListGroup>
                {!isEdit &&
                    <>
                        <h5>Potential members:</h5>
                        <ListGroup className="list-group scroll-list-group mb-3">
                            {potentialMembers.map((member, index) => (
                                <GroupMembers
                                    key={index}
                                    member={member}
                                    action={"Add"}
                                    isEdit={isEdit}
                                    onAction={setAddUsers}/>
                            ))}
                        </ListGroup>
                    </>
                }
                {isEdit && groupInfo.groupName &&
                    <Button
                        variant="secondary"
                        className="mt-2 float-end"
                        onClick={handleEditMembers}>
                        Edit Members
                    </Button>
                }
                {!isEdit &&
                    <Button
                        variant="secondary"
                        className="mt-2 float-end"
                        onClick={handleUpdateMembers}>
                        Update
                    </Button>
                }
            </Modal.Body>
            <Modal.Footer className="modal-group"/>
        </Modal>
    );
};

export default GroupInfoModal;