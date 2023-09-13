import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

import { Formik, Field, Form, option } from "formik";
import * as Yup from "yup";

export default function UserDetailForm({ onSubmitHandler, username, mode }) {
  const [usergroups, setUsergroups] = useState([]);
  const [user, setUser] = useState();

  const UserSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Min 3 chars")
      .max(50, "Max 50 chars")
      .required("Required"),
    password: Yup.string()
      .min(3, "Min 3 chars")
      .max(50, "Max 50 chars")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  // get usergroups for usergroup dropdown list
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/usergroups", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        setUsergroups(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("WOWOW");
    if (mode === "editMyProfile") {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("my user detail", res.data);
          setUser(res.data[0]);
        })
        .catch((err) => console.log(err));
    }
    if (mode === "editOthers" && username) {
      // Get my user detail based on username in token
      axios
        .post(
          "http://localhost:8080/user",
          { username: username },
          {
            headers: { Authorization: `Basic ${token}` },
          }
        )
        .then((res) => {
          console.log("other user detail", res.data);
          setUser(res.data[0]);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // undefined
  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <>
      <Formik
        initialValues={{
          username: user?.username ?? "",
          password: user?.password ?? "",
          email: user?.email ?? "",
          usergroup: user?.usergroup ?? "admin",
        }}
        validationSchema={UserSchema}
        // onSubmit={(values, { setSubmitting }) => {
        //   setTimeout(() => {
        //     alert(JSON.stringify(values, null, 2));
        //     setSubmitting(false);
        //   }, 500);
        // }}
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <p>{mode}</p>
            <Container>
              <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
                <Col xs md lg={1}>
                  <label htmlFor="username">Username</label>
                </Col>
                <Col xs md lg={4}>
                  <Field id="username" name="username" placeholder="Jane" />
                  {touched.username && errors.username && (
                    <div>{errors.username}</div>
                  )}
                </Col>
              </Row>
              <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
                <Col xs md={1}>
                  <label htmlFor="password">Password</label>
                </Col>
                <Col xs md={4}>
                  <Field id="password" name="password" placeholder="P@ssw0rd" />
                  {touched.password && errors.password && (
                    <div>{errors.password}</div>
                  )}
                </Col>
              </Row>
              <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
                <Col xs md={1}>
                  <label htmlFor="email">Email</label>
                </Col>
                <Col xs md={4}>
                  <Field
                    id="email"
                    name="email"
                    placeholder="jane@hotmail.com"
                  />
                  {touched.email && errors.email && <div>{errors.email}</div>}
                </Col>
              </Row>
              <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
                <Col xs md={1}>
                  <label htmlFor="usergroup">User Group</label>
                </Col>
                <Col xs md={4}>
                  <Field id="usergroup" name="usergroup" component="select">
                    {usergroups.length ? (
                      usergroups.map((usergroup) => {
                        return (
                          <option
                            value={usergroup.usergroup}
                            key={usergroup.usergroup}
                          >
                            {usergroup.usergroup.toUpperCase()}
                          </option>
                        );
                      })
                    ) : (
                      <option value="">No usergroup</option>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row style={{ marginTop: "5px", marginBottom: "5px" }}>
                <button type="submit">Create</button>
              </Row>
            </Container>
          </Form>
        )}
      </Formik>
    </>
  );
}
