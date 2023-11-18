import {useEffect, useRef, useState} from 'react';
import {useRecipient} from "../../hooks/useRecipient.js";
import {useSelector} from "react-redux";
import {selectRecipient, selectUser} from "../../features/user/UserSlice.js";
import {Stack} from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import {selectMessages} from "../../features/message/MessageSlice.js";
import './chatBox.css';
import GroupInfoModal from "../groupInfoModal/GroupInfoModal.jsx";
import {RxTextAlignJustify} from "react-icons/rx";
import SoundRecorder from "../soundRecorder/SoundRecorder.jsx";

const ChatBox = ({data, isLoading, send}) => {
    const user = useSelector(selectUser);
    const {recipients} = useRecipient();
    const recipient = useSelector(selectRecipient);
    const [textMessage, setTextMessage] = useState();
    const messages = useSelector(selectMessages);
    const scroll = useRef();
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        scroll.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    if (isLoading) {
        return (<div className="spinner-grow text-light" role="status"/>)
    }
    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header d-flex align-items-center justify-content-between px-3">
                <strong className="text-center flex-grow-1">
                    {recipient?.name ? recipient?.name : recipient?.groupName}
                </strong>
                <div onClick={handleShowModal}>
                    <RxTextAlignJustify/>
                </div>
                <>
                    {showModal &&
                        <GroupInfoModal
                            currentChat={data}
                            handleClose={handleCloseModal}
                            groupInfo={recipient}
                            show={showModal}
                        />
                    }
                </>
            </div>
            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, index) => {
                        return (
                            <Stack key={index}
                                   className={message?.senderId === user?._id ?
                                       "message self align-self-end flex-grow-0" :
                                       "message align-self-start flex-grow-0"
                                   }
                                   ref={scroll}
                            >
                                {message.text.startsWith('blob:') ? (
                                    <>
                                        <audio controls src={message.text}/>
                                    </>
                                ) : (
                                    <span>{message.text}</span>
                                )}
                                <span className="message-footer">
                                    {moment(message.createdAt).calendar()}
                                </span>
                            </Stack>
                        )
                    })}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                {(data && recipients) &&
                    <>
                        <InputEmoji
                            value={textMessage}
                            onChange={setTextMessage}
                            fontFamily="nunito"
                            className="emojis-input data-theme-dark"
                        />
                        <SoundRecorder
                            setText={setTextMessage}
                        />
                        <button
                            className="send-btn"
                            onClick={() => {
                                send(textMessage, user, data._id);
                                setTextMessage("");
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-send-fill" viewBox="0 0 16 16">
                                <path
                                    d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                            </svg>
                        </button>
                    </>
                }
            </Stack>
        </Stack>
    );
}

export default ChatBox;