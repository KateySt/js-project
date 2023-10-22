import useChat from "../../hooks/useChat.js";

const PotentialChat = () => {
    const {potentialChat, creatChat, user} = useChat();

    return (
        <>
            <div className="all-users">
                {potentialChat &&
                    potentialChat.map((u, index) => {
                        return (
                            <div className="single-user"
                                 key={index}
                                 onClick={() => creatChat(user._id, u._id)}>
                                {u.name}
                                <span className="user-online"></span>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}
export default PotentialChat;
