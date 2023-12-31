import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import {Field, Formik} from "formik";
import useUser from "../../hooks/useUser.js";
import {LoginSchema} from "./schema/SignupSchema.js";

const Login = () => {
    const {
        isLoading,
        login,
    } = useUser();

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={login}>
            {({errors, touched, handleSubmit}) => {
                return (
                    <>
                        <Form onSubmit={handleSubmit}>
                            <Row style={{
                                height: "100vh",
                                justifyContent: "center",
                                paddingTop: "10%"
                            }}>
                                <Col xs={6}>
                                    <Stack gap={3}>
                                        <h2>Login</h2>
                                        <Field name="email"
                                               type="email"
                                               placeholder="email"
                                               required/>
                                        {errors.email && touched.email ? (
                                            <div>{errors.email}</div>
                                        ) : null}
                                        <Field name="password"
                                               type="password"
                                               placeholder="password"
                                               required/>
                                        {errors.password && touched.password ? (
                                            <div>{errors.password}</div>
                                        ) : null}
                                        <Button variant="primary" type="submit">
                                            {isLoading ? "Creating" : "Login"}
                                        </Button>
                                    </Stack>
                                </Col>
                            </Row>
                        </Form>
                    </>
                );
            }}
        </Formik>
    );
}

export default Login;