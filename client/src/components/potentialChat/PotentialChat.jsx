import {useSelector} from "react-redux";
import {selectUser, selectUsersOnline} from "../../features/user/UserSlice.js";
import './potentialChat.css';
import {useEffect, useState} from "react";
import {Form, ListGroup} from 'react-bootstrap';
import Avatar from "react-avatar";

const PotentialChat = ({creatChat, potentialChat}) => {
    const user = useSelector(selectUser);
    const onlineUsers = useSelector(selectUsersOnline);
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!potentialChat) return;
        setFilteredSuggestions(
            potentialChat.filter((user) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, potentialChat]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (selectedUser) => {
        setQuery(selectedUser.name);
        setShowSuggestions(false);
        creatChat(selectedUser._id, user._id);
    };

    return (
        <>
            <Form.Group style={{position: 'relative'}}>
                <Form.Control
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search users..."
                    style={{ width: '380px'}}
                />
                {showSuggestions && (
                    <ListGroup
                        className="autocomplete-suggestions"
                        style={{position: 'absolute', top: '100%', left: 0, zIndex: 1000}}
                    >
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