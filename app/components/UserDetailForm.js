import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

import { Formik, Field, Form, option } from "formik";

export default function UserDetailForm() {
  const [usergroups, setUsergroups] = useState([]);

  // get usergroups for usergroup dropdown list
  useEffect(() => {
    axios
      .get("http://localhost:8080/usergroups")
      .then((res) => {
        setUsergroups(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <Container>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs md lg={1}>
                <label htmlFor="username">Username</label>
              </Col>
              <Col xs md lg={4}>
                <Field id="username" name="username" placeholder="Jane" />
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs md={1}>
                <label htmlFor="password">Password</label>
              </Col>
              <Col xs md={4}>
                <Field id="password" name="password" placeholder="P@ssw0rd" />
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs md={1}>
                <label htmlFor="email">Email</label>
              </Col>
              <Col xs md={4}>
                <Field id="email" name="email" placeholder="jane@hotmail.com" />
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
                        <option value={usergroup.usergroup}>
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
      </Formik>
    </>
  );
}
