import {Button, Form, Modal} from 'react-bootstrap';
import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser, updateUserAsync} from "../../features/user/UserSlice.js";
import validator from 'validator';
import './updateUser.css';
const UpdateUser = ({show, handleClose}) => {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const handleRegistration = useCallback(async () => {
        await dispatch(setUser({...user, name: username, avatar: avatar}));
        await dispatch(updateUserAsync({...user, name: username, avatar: avatar}));
        handleClose();
    }, [username, avatar]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="modal-update">
                    <Modal.Title>Update profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-update">
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                isInvalid={username.length < 3}
                            />
                            <Form.Control.Feedback type="invalid">
                                {username.length < 3 && 'Please enter a name longer than 3 characters.'}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formAvatar">
                            <Form.Label>Avatar</Form.Label>
                            <Form.Control
                                placeholder="avatar"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                isInvalid={!validator.isURL(avatar) && avatar.trim() !== ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                {!validator.isURL(avatar) && 'Please enter a valid URL.'}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            className="mt-3"
                            variant="primary"
                            onClick={handleRegistration}
                            disabled={(!validator.isURL(avatar)) || username.length < 3}
                        >
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="modal-update"/>
            </Modal>
        </>
    );
};
export default UpdateUser;