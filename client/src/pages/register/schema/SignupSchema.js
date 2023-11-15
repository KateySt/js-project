import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(4, 'Name must be at least 3 characters')
        .max(30, 'Name must not exceed 30 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email')
        .max(200, 'Email must not exceed 200 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(3, 'Password must be at least 3 characters')
        .max(100, 'Password must not exceed 100 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        ),
});