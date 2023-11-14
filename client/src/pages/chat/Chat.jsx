import useChat from "../../hooks/useChat.js";
import {Container, Stack} from "react-bootstrap";
import UserChat from "../../components/userChat/UserChat.jsx";
import PotentialChat from "../../components/potentialChat/PotentialChat.jsx";
import ChatBox from "../../components/chatbox/ChatBox.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getRecipientsAsync, selectRecipients} from "../../features/user/UserSlice.js";
import {useEffect} from "react";
import './chat.css';

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
    useEffect(() => {
        dispatch(getRecipientsAsync());
    }, []);

    return (
        <Container>
            <PotentialChat creatChat={creatChat} potentialChat={potentialChat}/>
            {chatsInfo?.lenght ? null :
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {recipients?.map((value, index) => {
                                return (
                                    <div key={`row--  ${index}`}
                                         onClick={() => updateCurrentChat(value)}
                                    >
                                        <UserChat data={value}/>
                                    </div>
                                )
                            }
                        )}
                    </Stack>
                    <ChatBox
                        data={currentChat}
                        send={sendTextMessage}
                    />
                </Stack>
            }
        </Container>
    );
}

export default Chat;
