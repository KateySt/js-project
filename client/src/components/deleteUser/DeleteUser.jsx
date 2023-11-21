import {Button, Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {deleteUserByIdAsync, selectUser} from "../../features/user/UserSlice.js";
import './deleteUser.css';

const DeleteUser = ({show, handleClose}) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const handleDeleteAccount = useCallback(async () => {
        await dispatch(deleteUserByIdAsync(user?._id));
        localStorage.clear();
        handleClose();
    }, [user]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="modal-delete">
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-delete">
                    <p>Are you sure you want to delete your account?</p>
                </Modal.Body>
                <Modal.Footer className="modal-delete">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default DeleteUser;