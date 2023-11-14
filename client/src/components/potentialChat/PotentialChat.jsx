import {useSelector} from "react-redux";
import {selectUser, selectUsersOnline} from "../../features/user/UserSlice.js";
import './potentialChat.css';
const PotentialChat = ({creatChat, potentialChat}) => {
    const user = useSelector(selectUser);
    const onlineUsers = useSelector(selectUsersOnline);
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
                                <span className={
                                    onlineUsers?.some((user) => user?.userId === u._id) ?
                                        "user-online" :
                                        ""
                                }></span>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}
export default PotentialChat;
