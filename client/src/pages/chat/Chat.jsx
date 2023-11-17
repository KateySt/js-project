import useChat from "../../hooks/useChat.js";
import {Container, Stack} from "react-bootstrap";
import UserChat from "../../components/userChat/UserChat.jsx";
import PotentialChat from "../../components/potentialChat/PotentialChat.jsx";
import ChatBox from "../../components/chatbox/ChatBox.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getRecipientsAsync, selectRecipients} from "../../features/user/UserSlice.js";
import {useEffect, useState} from "react";
import './chat.css';
import {FaLongArrowAltLeft, FaLongArrowAltRight} from "react-icons/fa";

const Chat = () => {
    const {
        chatsInfo,
        updateCurrentChat,
        currentChat,
        sendTextMessage,
        creatChat,
        potentialChat,
    } = useChat();

    const recipients = useSelector(selectRecipients);
    const dispatch = useDispatch();
    const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);

    useEffect(() => {
        setIsLoadingRecipients(true);
        dispatch(getRecipientsAsync());
        setIsLoadingRecipients(false);
    }, []);

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Container>
            <Container className="d-flex justify-content-start align-items-center">
                {!isCollapsed && <PotentialChat creatChat={creatChat} potentialChat={potentialChat}/>}
                <div onClick={toggleCollapse} className="m-2">
                    {isCollapsed ? <FaLongArrowAltRight/> : <FaLongArrowAltLeft/>}
                </div>
            </Container>
            {!chatsInfo?.length ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack
                        className={`messages-box flex-grow-0 pe-3`}
                        gap={3}
                    >
                        {recipients?.map((value, index) => (
                            <div
                                key={`row--  ${index}`}
                                onClick={() => updateCurrentChat(value)}
                            >
                                <UserChat
                                    data={value}
                                    showAvatarOnly={isCollapsed}
                                    isLoading={isLoadingRecipients}
                                />
                            </div>
                        ))}
                    </Stack>
                    <ChatBox data={currentChat} send={sendTextMessage}/>
                </Stack>
            )}
        </Container>
    );
}

export default Chat;
