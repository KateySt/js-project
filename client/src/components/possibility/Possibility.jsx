import {useState} from "react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {Link} from "react-router-dom";
import {AiOutlinePlusCircle} from "react-icons/ai";
import {RxUpdate} from "react-icons/rx";
import UpdateUser from "../updateUser/UpdateUser.jsx";

const Possibility = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
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
                        <div className="link-light text-decoration-none d-flex align-items-center"
                             onClick={handleShowModal}>
                            <RxUpdate className="me-2"/>
                            Update profile
                        </div>
                    </div>
                </>
            }
            {
                showModal &&
                <UpdateUser show={showModal} handleClose={handleCloseModal}/>
            }
        </div>
    );
}

export default Possibility;