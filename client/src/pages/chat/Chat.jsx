import useChat from "../../hooks/useChat.js";
import {Container, Stack} from "react-bootstrap";
import UserChat from "../../components/userChat/UserChat.jsx";
import PotentialChat from "../../components/potentialChat/PotentialChat.jsx";
import ChatBox from "../../components/chatbox/ChatBox.jsx";
import {useRecipient} from "../../hooks/useRecipient.js";

const Chat = () => {
    const {
        chatsInfo,
        isChatLoading,
        updateCurrentChat,
        currentChat,
        isMessageLoading,
        sendTextMessage,
        onlineUsers,
        creatChat,
        potentialChat,
        markThisNotificationAsRead,
    } = useChat();
    const {recipients} = useRecipient();
    return (
        <Container>
            <PotentialChat creatChat={creatChat} potentialChat={potentialChat}
                           onlineUsers={onlineUsers}/>
            {chatsInfo?.lenght ? null :
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isChatLoading && <p>Loading chat ...</p>}
                        {recipients?.map((value, index) => {
                                return (
                                    <div key={`row--  ${index}`}
                                         onClick={() => updateCurrentChat(value)}
                                    >
                                        <UserChat
                                            data={value}
                                            markThisNotificationAsRead={markThisNotificationAsRead}
                                            onlineUsers={onlineUsers}
                                        />
                                    </div>
                                )
                            }
                        )}
                    </Stack>
                    <ChatBox
                        data={currentChat}
                        isLoading={isMessageLoading}
                        send={sendTextMessage}
                    />
                </Stack>
            }
        </Container>
    );
}

export default Chat;
