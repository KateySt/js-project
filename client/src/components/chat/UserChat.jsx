import React from 'react';
import {Stack} from "react-bootstrap";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/user/UsersSlice.js";
import avatar from "../../assets/undraw_profile_pic_re_iwgo.svg";
const UserChat = ({data}) => {
    const user = useSelector(selectUser);
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} height="35px"/>
                </div>
                <div className="text-content">
                    <div className="name">{user?.name}</div>
                    <div className="text">Text message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    12/12/2023
                </div>
                <div className="this-user-notifications">2</div>
                <span className="user-online"></span>
            </div>
        </Stack>
    );
}

export default UserChat;