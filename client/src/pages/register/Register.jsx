import React from 'react';
import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import useUser from "../../hooks/useUser.js";
import {Field, Formik} from "formik";
import {SignupSchema} from "./schema/SignupSchema.js";

const Register = () => {

    const {
        updateRegisterInfo,
        isRegisterLoading
    } = useUser();

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={updateRegisterInfo}>
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
                                        <h2>Register</h2>

                                        <Field name="name"
                                               placeholder="name"
                                               required/>
                                        {errors.name && touched.name ? (
                                            <div>{errors.name}</div>
                                        ) : null}

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
                                            {isRegisterLoading ? "Creating" : "Register"}
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

export default Register;