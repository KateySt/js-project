import * as Yup from "yup";
export const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(4, 'Too Short!')
        .max(150, 'Too Long!')
        .required('Required'),
    email: Yup.string()
        .required("Required")
        .min(10, "Too short")
        .max(300, "Too long"),
    password: Yup.string()
        .required("Required")
        .min(3, "Too short")
        .max(100, "Too long"),
});