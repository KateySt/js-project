import React from 'react';
import {Button, ListGroup, Modal} from 'react-bootstrap';
import GroupMembers from "./groupMembers/GroupMembers.jsx";
import {useGroupInfoModal} from "../../hooks/useGroupInfoModal.js";

const GroupInfoModal = ({show, handleClose, groupInfo, currentChat}) => {
    const {members} = useGroupInfoModal(currentChat);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton style={{backgroundColor: '#181d31'}}>
                <Modal.Title>Group Information</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#181d31'}}>
                <div className="mb-3">
                    <h5>Group Name: {groupInfo.name || groupInfo?.groupName}</h5>
                </div>
                <h5>Members:</h5>
                <ListGroup className='list-group scroll-list-group'>
                    {members.map((member, index) => (
                        <GroupMembers key={index} member={member}/>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#181d31'}}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GroupInfoModal;