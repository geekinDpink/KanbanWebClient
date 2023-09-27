import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Select from "react-select";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function AppDetailForm({ onSubmitHandler, appAcroynm, mode }) {
  const [useroptions, setUserOptions] = useState();

  const AppSchema = Yup.object().shape({
    acronym: Yup.string()
      .min(3, "Min 3 chars")
      .max(50, "Max 50 chars")
      .required("Required"),
    description: Yup.string(),
    rnumber: Yup.number().positive().integer().required("Required"),
    startDate: Yup.date(),
    endDate: Yup.date(),
  });

  // Fetch usergroups to populate as options
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/usergroups", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        let usergrpArr = [];

        res.data.forEach((user) => {
          let usergrpObj = {
            value: user.usergroup,
            label: user.usergroup,
          };
          usergrpArr.push(usergrpObj);
        });
        setUserOptions(usergrpArr);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unable to retrieve usergroups, " + err?.response?.data);
      });
  }, []);

  console.log(useroptions);

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");

  //     if (mode === "editMyProfile") {
  //       // Get my user detail based on username in token
  //       axios
  //         .get("http://localhost:8080/user", {
  //           headers: { Authorization: `Basic ${token}` },
  //         })
  //         .then((res) => {
  //           console.log("my user detail", res.data);
  //           // user may have multiple usergroups, joined by ",", hence split it up and put in array
  //           const usergroupArr = res.data[0].usergroup.split(",");
  //           const userData = {
  //             ...res.data[0],
  //             password: null,
  //             usergroup: usergroupArr,
  //           };
  //           setUser(userData);
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //     if (mode === "editOthers" && username) {
  //       // Get my user detail based on username in token
  //       axios
  //         .post(
  //           "http://localhost:8080/user",
  //           { username: username },
  //           {
  //             headers: { Authorization: `Basic ${token}` },
  //           }
  //         )
  //         .then((res) => {
  //           console.log("other user detail", res.data);
  //           const usergroupArr = res.data[0].usergroup.split(",");
  //           const userData = {
  //             ...res.data[0],
  //             password: null,
  //             usergroup: usergroupArr,
  //             active: res.data[0].active === 0 ? false : true,
  //           };
  //           setUser(userData);
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //   }, []);

  return (
    <>
      <Formik
        initialValues={{
          acronym: "",
          description: "",
          rnumber: "",
          startDate: "",
          endDate: "",
          permitOpen: "",
        }}
        validationSchema={AppSchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          onSubmitHandler(values, resetForm);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="acronym">Acronym</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="acronym"
                  name="acronym"
                  style={{ width: "100%" }}
                  disabled={mode !== "create" ? true : false}
                />
                {touched.acronym && errors.acronym && (
                  <div className="formErrors">{errors.acronym}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="description">Description</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="description"
                  name="description"
                  style={{ width: "100%" }}
                />
                {touched.description && errors.description && (
                  <div className="formErrors">{errors.description}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="rnumber">RNumber</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="rnumber" name="rnumber" style={{ width: "100%" }} />
                {touched.rnumber && errors.rnumber && (
                  <div className="formErrors">{errors.rnumber}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="startDate">Start Date</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="startDate"
                  name="startDate"
                  style={{ width: "100%" }}
                />
                {touched.startDate && errors.startDate && (
                  <div className="formErrors">{errors.startDate}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="endDate">End Date</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="endDate" name="endDate" style={{ width: "100%" }} />
                {touched.endDate && errors.endDate && (
                  <div className="formErrors">{errors.endDate}</div>
                )}
              </Col>
            </Row>
            <Row>
              <b>App Permit</b>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="permitCreate">Create</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="permitCreate"
                  name="permitCreate"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <Select
                        isMulti
                        options={useroptions}
                        defaultValue={{
                          value: "project lead",
                          label: "project lead",
                        }}
                      />
                    );
                  }}
                />
                {touched.permitCreate && errors.permitCreate && (
                  <div className="formErrors">{errors.permitCreate}</div>
                )}
              </Col>
            </Row>

            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="endDate">Open</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="permitOpen"
                  name="permitOpen"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <Select
                        isMulti
                        options={useroptions}
                        defaultValue={{
                          value: "project manager",
                          label: "project manager",
                        }}
                      />
                    );
                  }}
                />
                {touched.permitOpen && errors.permitOpen && (
                  <div className="formErrors">{errors.permitOpen}</div>
                )}
              </Col>
            </Row>

            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="permitTodo">Todo</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="permitTodo"
                  name="permitTodo"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <Select
                        isMulti
                        options={useroptions}
                        defaultValue={{
                          value: "developer",
                          label: "developer",
                        }}
                      />
                    );
                  }}
                />
                {touched.permitTodo && errors.permitTodo && (
                  <div className="formErrors">{errors.permitTodo}</div>
                )}
              </Col>
            </Row>

            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="permitDoing">Doing</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="permitDoing"
                  name="permitDoing"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <Select
                        isMulti
                        options={useroptions}
                        defaultValue={{
                          value: "developer",
                          label: "developer",
                        }}
                      />
                    );
                  }}
                />
                {touched.permitDoing && errors.permitDoing && (
                  <div className="formErrors">{errors.permitDoing}</div>
                )}
              </Col>
            </Row>

            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="permitDone">Done</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="permitDone"
                  name="permitDone"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <Select
                        isMulti
                        options={useroptions}
                        defaultValue={{
                          value: "project lead",
                          label: "project lead",
                        }}
                      />
                    );
                  }}
                />
                {touched.permitDone && errors.permitDone && (
                  <div className="formErrors">{errors.permitDone}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Col xs sm={1} md={2}></Col>
              <Col xs sm={5} md={4}>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  {mode === "create" ? "Create" : "Save"}
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
