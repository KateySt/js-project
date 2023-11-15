import {useSelector} from "react-redux";
import {selectUsers} from "../../features/user/UserSlice.js";
import {useEffect, useState} from "react";
import ItemSelect from "./item/ItemSelect.jsx";
import './multipleSelect.css';

const MultipleSelect = ({setGroup, group}) => {
    const users = useSelector(selectUsers);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!selectedUser) return;
        if (!group.includes(selectedUser)) {
            setGroup([...group, selectedUser]);
        } else {
            setGroup(group.filter((user) => user !== selectedUser));
        }
    }, [selectedUser]);

    return (
        <>
            {users?.length !== 0 && (
                <ul className="list-group scroll-list-group mt-2">
                    {users?.map((value, index) => (
                        <ItemSelect
                            key={index}
                            data={value}
                            handleUserClick={setSelectedUser}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};

export default MultipleSelect;
