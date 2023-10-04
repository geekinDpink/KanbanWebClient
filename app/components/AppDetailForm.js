import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import SingleSelect from "./SingleSelect";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";

export default function AppDetailForm({ onSubmitHandler, appAcronym, mode }) {
  const [app, setApp] = useState();

  const AppSchema = Yup.object().shape({
    acronym: Yup.string()
      .min(3, "Min 3 chars")
      .max(50, "Max 50 chars")
      .required("Required"),
    description: Yup.string(),
    rnumber: Yup.number().positive().integer().required("Required"),
    // startDate: Yup.date(),
    // endDate: Yup.date(),
  });

  // Fetch usergroups to populate as options
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAppDetails = async (param) => {
      try {
        const res = await axios.post(
          "http://localhost:8080/app/acronym",
          param,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );

        if (res.data[0]) {
          setApp(res.data[0]);
        } else {
          toast.show("App record not found");
        }
      } catch (error) {
        toast.error("Unable to retrieve app record, ");
        console.log(error);
      }
    };

    if (mode !== "create" && appAcronym) {
      const param = { App_Acronym: appAcronym };
      getAppDetails(param);
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          acronym: app?.App_Acronym ?? "",
          description: app?.App_Description ?? "",
          rnumber: app?.App_Rnumber ?? "",
          startDate: app?.App_startDate
            ? moment(app.App_startDate).format("YYYY-MM-DD")
            : "",
          endDate: app?.App_endDate
            ? moment(app.App_endDate).format("YYYY-MM-DD")
            : "",
          permitCreate: app?.App_permit_Create ?? "",
          permitOpen: app?.App_permit_Open ?? "",
          permitTodo: app?.App_permit_toDoList ?? "",
          permitDoing: app?.App_permit_Doing ?? "",
          permitDone: app?.App_permit_Done ?? "",
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
                  style={{ width: "100%" }}
                  type="date"
                />
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
                      <SingleSelect
                        setFieldValue={setFieldValue}
                        values={values}
                        fieldName="permitCreate"
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
                      <SingleSelect
                        setFieldValue={setFieldValue}
                        values={values}
                        fieldName="permitOpen"
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
                      <SingleSelect
                        setFieldValue={setFieldValue}
                        values={values}
                        fieldName="permitTodo"
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
                      <SingleSelect
                        setFieldValue={setFieldValue}
                        values={values}
                        fieldName="permitDoing"
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
                      <SingleSelect
                        setFieldValue={setFieldValue}
                        values={values}
                        fieldName="permitDone"
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
