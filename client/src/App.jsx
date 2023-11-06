import {Navigate, Route, Routes} from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/navbar/NavBar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectJwt, selectUser} from "./features/user/UserSlice.js";
import {useEffect} from "react";
import {URL_WS, URL_WSS} from "./storege/middleware/middleware.js";
import {io} from "socket.io-client";
import {setSocket, setSocketSecure} from "./features/socket/SocketSlice.js";

function App() {
    const userInfo = useSelector(selectUser);
    const dispatch = useDispatch();
    const token = useSelector(selectJwt);

    useEffect(() => {
        const newSocket = io(URL_WS);
        dispatch(setSocket(newSocket));
        return () => {
            newSocket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (!token) return;
        const newSocket = io(URL_WSS, {
            auth:
                {token: token}
        });
        dispatch(setSocketSecure(newSocket));
        return () => {
            newSocket.disconnect();
        }
    }, [token]);

    return (
        <>
            <NavBar/>
            <Container>
                <Routes>
                    <Route path="/" element={userInfo ? <Chat/> : <Login/>}/>
                    <Route path="/login" element={userInfo ? <Chat/> : <Login/>}/>
                    <Route path="/register" element={userInfo ? <Chat/> : <Register/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Container>
        </>
    )
}

export default App;
