import React from 'react';
import useChat from "../../hooks/useChat.js";
import {Container, Stack} from "react-bootstrap";
import UserChat from "../../components/chat/UserChat.jsx";
import PotentialChat from "../../components/chat/PotentialChat.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";

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
        notifications,
    } = useChat();
    return (
        <Container>
            <PotentialChat creatChat={creatChat} potentialChat={potentialChat} onlineUsers={onlineUsers}/>
            {chatsInfo?.lenght ? null :
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isChatLoading && <p>Loading chat ...</p>}
                        {chatsInfo?.map((value, index) => {
                                return (
                                    <div key={`row--  ${index}`}
                                         onClick={() => updateCurrentChat(value)}
                                    >
                                        <UserChat
                                            data={value}
                                            notifications={notifications}
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
