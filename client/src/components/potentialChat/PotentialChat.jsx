import './potentialChat.css';
import {Form, ListGroup} from 'react-bootstrap';
import Avatar from "react-avatar";
import {usePotentialChat} from "../../hooks/usePotentialChat.js";

const PotentialChat = ({creatChat, potentialChat}) => {
    const {
        filteredSuggestions,
        handleSuggestionClick,
        handleInputChange,
        showSuggestions,
        onlineUsers,
        query,
    } = usePotentialChat(potentialChat, creatChat);

    return (
        <>
            <Form.Group className='group'>
                <Form.Control
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search users..."
                    className="input"
                />
                {showSuggestions && (
                    <ListGroup
                        className="autocomplete-suggestions list-group-users">
                        {filteredSuggestions.map((u, index) => (
                            <ListGroup.Item
                                key={index}
                                onClick={() => handleSuggestionClick(u)}
                                className="d-flex align-items-center"
                            >
                                <Avatar
                                    name={u?.name}
                                    maxInitials={1}
                                    size="50"
                                    className="round-avatar"
                                    src={u?.avatar}
                                    alt="avatar"
                                />
                                <span className="ms-3">{u.name}</span>
                                <span className={
                                    onlineUsers?.some((user) => user?.userId === u._id) ?
                                        "user-online" :
                                        ""}
                                ></span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Form.Group>
        </>
    );
}
export default PotentialChat;