import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

import { Formik, Field, Form, option } from "formik";
import * as Yup from "yup";
import CreatableMultiSelect from "./CreatableMultiSelect";

export default function UserDetailForm({ onSubmitHandler, username, mode }) {
  const [user, setUser] = useState();

  // Password optional in edit user forms
  const UserSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Min 3 chars")
      .max(50, "Max 50 chars")
      .required("Required"),
    password:
      mode === "create"
        ? Yup.string().max(50, "Max 50 chars").required("Required")
        : Yup.string().max(50, "Max 50 chars"),
    email: Yup.string().email("Invalid email"),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (mode === "editMyProfile") {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("my user detail", res.data);
          // user may have multiple usergroups, joined by ",", hence split it up and put in array
          const usergroupArr = res.data[0].usergroup.split(",");
          const userData = {
            ...res.data[0],
            password: null,
            usergroup: usergroupArr,
          };
          setUser(userData);
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
          const usergroupArr = res.data[0].usergroup.split(",");
          const userData = {
            ...res.data[0],
            password: null,
            usergroup: usergroupArr,
          };
          setUser(userData);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: user?.username ?? "",
          password: user?.password ?? "",
          email: user?.email ?? "",
          usergroup: user?.usergroup ?? "",
        }}
        validationSchema={UserSchema}
        enableReinitialize
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <p>{username}</p>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs s md={1}>
                <label htmlFor="username">Username</label>
              </Col>
              <Col xs s md={5}>
                <Field
                  id="username"
                  name="username"
                  placeholder="eg.Jane"
                  style={{ width: "100%" }}
                  disabled={mode !== "create" ? true : false}
                />
                {touched.username && errors.username && (
                  <div>{errors.username}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs s md={1}>
                <label htmlFor="password">Password</label>
              </Col>
              <Col xs s md={5}>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  style={{ width: "100%" }}
                  placeholder="eg.P@ssw0rd"
                />
                {touched.password && errors.password && (
                  <div>{errors.password}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs s md={1}>
                <label htmlFor="email">Email</label>
              </Col>
              <Col xs s md={5}>
                <Field
                  id="email"
                  name="email"
                  style={{ width: "100%" }}
                  placeholder="eg.jane@hotmail.com"
                />
                {touched.email && errors.email && <div>{errors.email}</div>}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs md={1}>
                <label htmlFor="usergroup">User Group</label>
              </Col>
              <Col xs s md={5}>
                <Field
                  id="usergroup"
                  // className="custom-select"
                  name="usergroup"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <CreatableMultiSelect
                        setFieldValue={setFieldValue}
                        values={values}
                      />
                    );
                  }}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Col xs s md={1}></Col>
              <Col xs s md={5}>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  {mode !== "create" ? "Edit" : "Create"}
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}

{
  //         {({ errors, touched, setFieldValue, values, field }) => (
  /* <Field id="usergroup" name="usergroup" component="select">
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
</Field> */
}

{
  /*
  const colourOptions = [
    { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
    { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630", isFixed: true },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" },
  ];
  <Field
  id="usergroup"
  name="usergroup"
  component={() => {
    return (
      <CreatableSelect isMulti options={colourOptions} />
    );
  }}
/> */
}
