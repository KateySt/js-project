import React from 'react';
import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import {LoginSchema, SignupSchema} from "../register/schema/SignupSchema.js";
import {Field, Formik} from "formik";
import useUser from "../../hooks/useUser.js";

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
/*
 <Alert variant="danger">
                                <p>
                                    An error occurred
                                </p>
                            </Alert>
 */