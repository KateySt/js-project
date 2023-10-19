import {Navigate, Route, Routes} from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from "react-bootstrap";
import NavBar from "./components/NavBar.jsx";

function App() {
    return (
        <>
            <NavBar/>
            <Container>
                <Routes>
                    <Route path="/" element={<Chat/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Container>
        </>
    )
}

export default App
