import {useSelector} from "react-redux";
import {selectUser, selectUsersOnline} from "../features/user/UserSlice.js";
import {useEffect, useState} from "react";

export const usePotentialChat = (potentialChat, creatChat) => {
    const user = useSelector(selectUser);
    const onlineUsers = useSelector(selectUsersOnline);
    const [query, setQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!potentialChat) return;
        const timeoutId = setTimeout(() => {
            setFilteredSuggestions(
                potentialChat.filter((user) =>
                    user.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5)
            );
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query, potentialChat]);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = async (selectedUser) => {
        setQuery(selectedUser.name);
        setShowSuggestions(false);
        await creatChat(selectedUser._id, user._id);
    };

    const handleDocumentClick = (event) => {
        if (event.target.closest('.autocomplete-suggestions') === null) {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);
    return {
        filteredSuggestions,
        handleSuggestionClick,
        handleInputChange,
        showSuggestions,
        onlineUsers,
        query,
    };
};