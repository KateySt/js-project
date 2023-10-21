import React from 'react';
import useChat from "../../hooks/useChat.js";
import {Container, Stack} from "react-bootstrap";
import UserChat from "../../components/chat/UserChat.jsx";

const Chat = () => {
    const {chatsInfo, isLoading} = useChat();

    return (
        <Container>
            <Stack>List</Stack>
            {chatsInfo?.lenght ? null :
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isLoading && <p>Loading chat ...</p>}
                        {chatsInfo?.map((value, index) => {
                                return (
                                    <div key={`row--  ${index}`}>
                                        <UserChat data={value}/>
                                    </div>
                                )
                            }
                        )}
                    </Stack>
                </Stack>
            }
        </Container>
    );
}

export default Chat;
