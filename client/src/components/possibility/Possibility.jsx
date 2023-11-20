import {useState} from "react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {Link} from "react-router-dom";
import {AiOutlinePlusCircle} from "react-icons/ai";
import {RxUpdate} from "react-icons/rx";
import UpdateUser from "../updateUser/UpdateUser.jsx";
import './possibility.css';
import DeleteUser from "../deleteUser/DeleteUser.jsx";

const Possibility = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    return (
        <div className="possibility">
            <div onClick={() => setIsOpen(!isOpen)}>
                <BsThreeDotsVertical/>
            </div>
            {isOpen &&
                <>
                    <div className="possibility-box">
                        <Link
                            to="/group"
                            className="link-light text-decoration-none d-flex align-items-center"
                        >
                            <AiOutlinePlusCircle className="me-2"/>
                            Creat new group
                        </Link>
                        <Link className="link-light text-decoration-none d-flex align-items-center"
                              onClick={handleShowModal}>
                            <RxUpdate className="me-2"/>
                            Update profile
                        </Link>
                        <Link
                            className="link-light text-decoration-none d-flex align-items-center"
                            onClick={handleShowDeleteModal}>
                            Delete account
                        </Link>
                    </div>
                </>
            }
            {
                showModal &&
                <UpdateUser show={showModal} handleClose={handleCloseModal}/>
            }
            {
                showDeleteModal &&
                <DeleteUser show={showDeleteModal} handleClose={handleCloseDeleteModal}/>
            }
        </div>
    );
}

export default Possibility;