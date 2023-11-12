const CustomInput = ({onInputChange}) => {
    return (
        <>
            <input onChange={(e) => onInputChange(e.target.value)}/>
        </>
    );
};
export default CustomInput;