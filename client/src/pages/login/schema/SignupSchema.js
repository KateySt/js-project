import * as Yup from "yup";
export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required("Required")
        .min(10, "Too short")
        .max(300, "Too long"),
    password: Yup.string()
        .required("Required")
        .min(3, "Too short")
        .max(100, "Too long"),
});