import {useState} from "react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {Link} from "react-router-dom";
import {AiOutlinePlusCircle} from "react-icons/ai";

const Possibility = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="possibility">
            <div onClick={() => setIsOpen(!isOpen)}>
                <BsThreeDotsVertical/>
            </div>
            {isOpen &&
                <div className="possibility-box">
                    <Link
                        to="/group"
                        className="link-light text-decoration-none d-flex align-items-center"
                    >
                        <AiOutlinePlusCircle className="me-2"/>
                        Creat new group
                    </Link>
                </div>
            }
        </div>
    );
}

export default Possibility;