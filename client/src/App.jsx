import {Navigate, Route, Routes} from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/navbar/NavBar.jsx";
import {useSelector} from "react-redux";
import {selectJwt, selectUser} from "./features/user/UserSlice.js";
import {useEffect} from "react";
import {webSocketMiddleware, webSocketSecureMiddleware} from "./socket/chatAPI.js";
import Group from "./pages/group/Group.jsx";

function App() {
    const userInfo = useSelector(selectUser);
    const token = useSelector(selectJwt);

    useEffect(() => {
        webSocketMiddleware.startSocket();
        return () => {
            webSocketMiddleware.disconnectSocket();
        }
    }, []);

    useEffect(() => {
        if (!token) return;
        webSocketSecureMiddleware.connectSocket(token);
        return () => {
            webSocketSecureMiddleware.disconnectSocket();
        }
    }, [token]);

    return (
        <>
            <NavBar/>
            <Container>
                <Routes>
                    <Route path="/" element={userInfo ? <Chat/> : <Login/>}/>
                    <Route path="/group" element={userInfo ? <Group/> : <Login/>}/>
                    <Route path="/login" element={userInfo ? <Chat/> : <Login/>}/>
                    <Route path="/register" element={userInfo ? <Chat/> : <Register/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Container>
        </>
    )
}

export default App;
