import React from 'react';
import {useRecipient} from "../../hooks/useRecipient.js";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/user/UsersSlice.js";
import {Stack} from "react-bootstrap";
import moment from "moment";

const ChatBox = ({data, isLoading, messages}) => {
    const user = useSelector(selectUser);
    const {recipient} = useRecipient();

    if (!recipient) {
        return (<p style={{textAlign: "center", width: "100%"}}>No composition selected yet...</p>)
    }
    if (isLoading) {
        return (<p style={{textAlign: "center", width: "100%"}}>Loading ...</p>)
    }
    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>
                    {recipient?.name}
                </strong>
            </div>
            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, index) => {
                        return (
                            <Stack key={index}
                                   lassName={`${message?.senderId === user?._id ?
                                       "message self align-self-end flex-grow-0":
                                       "message align-self-start flex-grow-0"
                                   }`}>
                                <span>{message.text}</span>
                                <span className="message-footer">
                                    {moment(message.createdAt).calendar()}
                                </span>
                            </Stack>
                        )
                    })}
            </Stack>
        </Stack>
    );
}

export default ChatBox;