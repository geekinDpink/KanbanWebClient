import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";

// Create, Edit or View Plan
export default function PlanDetailForm({
  appAcronym,
  planMVPName,
  mode,
  setPlans,
}) {
  const [selPlan, setSelPlan] = useState();
  const PlanSchema = Yup.object().shape({
    planName: Yup.string().required("Required"),
    acronym: Yup.string().required("Required"),
  });

  const onSubmitHandler = async (values, resetForm) => {
    try {
      const token = localStorage.getItem("token");
      const { planName, startDate, endDate, acronym, labelColor } = values;
      const params = {
        Plan_MVP_name: planName,
        // if date is "", moment will return "invalid date" string
        Plan_startDate: startDate
          ? moment(startDate).format("YYYY-MM-DD")
          : null,
        Plan_endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
        Plan_app_Acronym: acronym,
        Plan_color: labelColor,
      };

      // Create Plan and refresh kanban board
      if (mode === "create") {
        await axios.post("http://localhost:8080/plan", params, {
          headers: { Authorization: `Basic ${token}` },
        });
        resetForm();
        try {
          const params2 = { Plan_app_Acronym: appAcronym };
          const resPlan = await axios.post(
            "http://localhost:8080/plans/acronym",
            params2,
            {
              headers: { Authorization: `Basic ${token}` },
            }
          );

          // resPlan.data is an array of plan object. To iterate through each object and store plan name: color
          let planColorObj = {};
          resPlan.data.forEach((plan) => {
            planColorObj[plan.Plan_MVP_name] = plan.Plan_color;
          });
          setPlans(planColorObj);
        } catch (err) {
          console.log("No plan record found", err);
        }
      } else {
        // Update Plan
        await axios.put("http://localhost:8080/plan/acronym/name", params, {
          headers: { Authorization: `Basic ${token}` },
        });
      }
      toast.success("Form Submitted");
    } catch (error) {
      toast.error(`Unable to submit`);
    }
  };

  useEffect(() => {
    // Get All Plans
    const token = localStorage.getItem("token");

    const getPlanByAcronymAndName = async () => {
      try {
        const params = {
          Plan_app_Acronym: appAcronym,
          Plan_MVP_name: planMVPName,
        };
        const res = await axios.post(
          "http://localhost:8080/plan/acronym/name",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        if (res.data.length > 0) {
          setSelPlan(res.data[0]);
          console.log("Plan data", res.data[0]);
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to Promote`);
      }
    };

    if (appAcronym && planMVPName) {
      getPlanByAcronymAndName();
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          planName: selPlan?.Plan_MVP_name ?? "",
          startDate: selPlan?.Plan_startDate
            ? moment(selPlan?.Plan_startDate).format("YYYY-MM-DD")
            : "",
          endDate: selPlan?.Plan_endDate
            ? moment(selPlan?.Plan_endDate).format("YYYY-MM-DD")
            : "",
          acronym: appAcronym,
          labelColor: selPlan?.Plan_color ?? "#000000",
        }}
        validationSchema={PlanSchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          onSubmitHandler(values, resetForm);
          console.log("submit values", values);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="acronym">App Acronym</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="acronym"
                  name="acronym"
                  style={{ width: "100%" }}
                  disabled
                />
                {touched.acronym && errors.acronym && (
                  <div className="formErrors">{errors.acronym}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="planName">Plan Name</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="planName"
                  name="planName"
                  disabled={mode === "edit"}
                  style={{ width: "100%" }}
                />
                {touched.planName && errors.planName && (
                  <div className="formErrors">{errors.planName}</div>
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
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="labelColor">Color</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="labelColor"
                  name="labelColor"
                  type="color"
                  style={{ width: "100%" }}
                />
                {touched.labelColor && errors.labelColor && (
                  <div className="formErrors">{errors.labelColor}</div>
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
                  Save
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
