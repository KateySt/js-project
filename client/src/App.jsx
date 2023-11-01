import {Navigate, Route, Routes} from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/navbar/NavBar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "./features/user/UserSlice.js";
import {useEffect} from "react";
import {io} from "socket.io-client";
import {setSocket, setWSS} from "./features/socket/SocketSlice.js";
import {URL_WS, URL_WSS} from "./main.jsx";

function App() {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUser);

    useEffect(() => {
        const newSocket = io(URL_WS);
        dispatch(setSocket(newSocket));
        return () => {
            newSocket.disconnect();
        }
    }, []);

    useEffect(() => {
        const newSocket = io(URL_WSS, {
            auth:
                {token: JSON.parse(localStorage.getItem("jwt"))}
        });
        dispatch(setWSS(newSocket));
        return () => {
            newSocket.disconnect();
        }
    }, []);

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
