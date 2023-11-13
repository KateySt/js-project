import {Button, Form, Modal} from 'react-bootstrap';
import {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser, updateUserAsync} from "../../features/user/UserSlice.js";

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
                <Modal.Header closeButton style={{backgroundColor: '#181d31'}}>
                    <Modal.Title>Update pofile</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: '#181d31'}}>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Avater</Form.Label>
                            <Form.Control
                                placeholder="avater"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            className="mt-3"
                            variant="primary"
                            onClick={handleRegistration}
                        >
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default UpdateUser;