import React, { useState, useEffect } from "react";import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Formik, Field, Form, option } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function PlanDetailForm({ appAcronym }) {
  const [user, setUser] = useState();

  // Password optional in edit user forms
  const PlanSchema = Yup.object().shape({
    planName: Yup.string().required("Required"),
    acronym: Yup.string().required("Required"),
  });

  const onSubmitHandler = async (values, resetForm) => {
    try {
      const token = localStorage.getItem("token");
      const { planName, startDate, endDate, acronym } = values;
      const params = {
        Plan_MVP_name: planName,
        Plan_startDate: startDate,
        Plan_endDate: endDate,
        Plan_app_Acronym: acronym,
      };
      const res = await axios.post("http://localhost:8080/plan", params, {
        headers: { Authorization: `Basic ${token}` },
      });
      toast.success("Form Submitted");
    } catch (error) {
      toast.error(`Unable to submit`);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          planName: "",
          startDate: "",
          endDate: "",
          acronym: appAcronym,
        }}
        validationSchema={PlanSchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          onSubmitHandler(values, resetForm);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="acronym">App Acronym</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field id="acronym" name="acronym" style={{ width: "100%" }} />
                {touched.acronym && errors.acronym && (
                  <div className="formErrors">{errors.acronym}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="planName">Plan</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="planName"
                  name="planName"
                  style={{ width: "100%" }}
                />
                {touched.username && errors.username && (
                  <div className="formErrors">{errors.username}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="startDate">Create Date</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="startDate"
                  name="startDate"
                  type="date"
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
                <Field
                  id="endDate"
                  name="endDate"
                  type="date"
                  style={{ width: "100%" }}
                />
                {touched.endDate && errors.endDate && (
                  <div className="formErrors">{errors.endDate}</div>
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
                  Create
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
