import React, { useState, useEffect } from "react";import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import SingleSelect from "./SingleSelect";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
export default function TaskDetailForm({ appAcronym, mode }) {
  const [app, setApp] = useState();
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

  const onSubmitHandler = (values, resetForm) => {
    const {
      name,
      description,
      notes,
      taskId,
      plan,
      appAcronym,
      taskState,
      creator,
      owner,
      createDate,
    } = values;

    const params = {
      Task_name: name,
      Task_description: description,
      Task_notes: notes,
      Task_id: taskId,
      Task_plan: plan,
      Task_app_Acronym: appAcronym,
      Task_state: taskState,
      Task_creator: creator,
      Task_owner: owner,
      Task_createDate: createDate,
    };

    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/task", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log("create submit res", res);
        resetForm();
        toast.success("Form Submitted");
        resetForm();
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(`Unable to submit, ${err.response.data.toLowerCase()}`);
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          description: "",
          notes: "",
          taskId: "",
          plan: "",
          appAcronym: "",
          taskState: "",
          creator: "",
          owner: "",
          createDate: new Date(),
        }}
        // validationSchema={AppSchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          onSubmitHandler(values, resetForm);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="name">Name</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="name" name="name" style={{ width: "100%" }} />
                {touched.name && errors.name && (
                  <div className="formErrors">{errors.name}</div>
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
                <label htmlFor="notes">Task Notes</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="notes" name="notes" style={{ width: "100%" }} />
                {touched.notes && errors.notes && (
                  <div className="formErrors">{errors.notes}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="taskId">Task ID</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="taskId" name="taskId" style={{ width: "100%" }} />
                {touched.taskId && errors.taskId && (
                  <div className="formErrors">{errors.taskId}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="plan">Plan</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="plan" name="plan" style={{ width: "100%" }} />
                {touched.plan && errors.plan && (
                  <div className="formErrors">{errors.plan}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="appAcronym">App Acronym</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="appAcronym"
                  name="appAcronym"
                  style={{ width: "100%" }}
                />
                {touched.appAcronym && errors.appAcronym && (
                  <div className="formErrors">{errors.appAcronym}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="taskState">Task State</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="taskState"
                  name="taskState"
                  style={{ width: "100%" }}
                />
                {touched.taskState && errors.taskState && (
                  <div className="formErrors">{errors.taskState}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="creator">Creator</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="creator" name="creator" style={{ width: "100%" }} />
                {touched.creator && errors.creator && (
                  <div className="formErrors">{errors.creator}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="owner">Owner</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="owner" name="owner" style={{ width: "100%" }} />
                {touched.owner && errors.owner && (
                  <div className="formErrors">{errors.owner}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="createDate">Create Date</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="createDate"
                  name="createDate"
                  type="date"
                  style={{ width: "100%" }}
                />
                {touched.createDate && errors.createDate && (
                  <div className="formErrors">{errors.createDate}</div>
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
