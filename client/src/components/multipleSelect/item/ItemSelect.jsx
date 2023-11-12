import {useState} from "react";

const ItemSelect = ({data, handleUserClick}) => {
    const [isSelect, setIsSelect] = useState(false);
    return (
        <li
            className={isSelect ?
                "list-group-item active" :
                "list-group-item"}
            onClick={() => {
                handleUserClick(data?._id);
                setIsSelect(!isSelect);
            }}>
            {data?.name}
        </li>
    );
}
export default ItemSelect;