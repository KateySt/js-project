import {useState} from "react";

const CustomInput = ({onInputChange, validationFn}) => {
    const [isValid, setIsValid] = useState(true);
    const handleChange = (e) => {
        const value = e.target.value;
        const isValidInput = validationFn(value);
        setIsValid(isValidInput);
        onInputChange(value);
    };

    return (
        <>
            <input
                onChange={handleChange}
                className={"col-12" + (isValid ? '' : 'invalid')}
            />
            {!isValid && <p className="error-message">Invalid input</p>}
        </>
    );
};
export default CustomInput;