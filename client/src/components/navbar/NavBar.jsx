import {Button, Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";
import useUser from "../../hooks/useUser.js";
import Notification from "../notification/Notification.jsx";
import Possibility from "../possibility/Possibility.jsx";

const NavBar = () => {
    const {userInfo, logout} = useUser();
    return (
        <>
            <Navbar bg="dark" className="mb-4" style={{height: "3.75rem"}}>
                <Container>
                    <h2>
                        <Link to="/" className="link-light text-decoration-none">
                            Chat
                        </Link>
                    </h2>
                    {userInfo
                        && <span className="text-warning">{userInfo?.name}
                    </span>}
                    <Nav>
                        <Stack direction="horizontal" gap={3}>

                            {userInfo && <>
                                <Notification/>
                                <Possibility/>
                                <Link
                                    onClick={logout}
                                    to="/login"
                                    className="link-light text-decoration-none"
                                >
                                    Logout
                                </Link>
                            </>}
                            {!userInfo &&
                                <>
                                    <Link to="/login" className="link-light text-decoration-none">
                                        Login
                                    </Link>
                                    <Link to="/register" className="link-light text-decoration-none">
                                        Register
                                    </Link>
                                </>
                            }
                        </Stack>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;