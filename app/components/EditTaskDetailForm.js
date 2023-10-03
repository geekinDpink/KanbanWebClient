import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import { useLocation } from "react-router-dom";

import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";

export default function EditTaskDetailForm({ setTasks, selectedTaskId }) {
  const [selTask, setSelTask] = useState({});
  const appLocation = useLocation();
  const { App_Acronym: appAcronym } = appLocation.state;

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

  // On load, populate selected Task details on modal by saving to selTask state for loading to initial form values
  useEffect(() => {
    const params = {
      Task_id: selectedTaskId,
    };

    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/task/id", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        setSelTask(res.data[0]);
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(`Unable to retrieve task details`);
      });
  }, []);

  // Submit edited value to database
  const onSubmitHandler = (values) => {
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
      .put("http://localhost:8080/task", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        toast.success("Form Submitted");
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(`Unable to submit`);
      });
  };

  // Submit edited value to database
  const onPromoteHandler = (values) => {
    const { taskId, addTaskNotes } = values;

    const params = {
      // Task_notes: notes,
      Task_id: taskId,
      Add_Task_Notes: addTaskNotes,
    };

    const token = localStorage.getItem("token");

    const promoteAndRefreshBoard = async () => {
      try {
        const res = await axios.put(
          "http://localhost:8080/task/promote",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        if (res) {
          toast.success("Successfully Promoted");
          const params2 = { Task_app_Acronym: appAcronym };
          try {
            const resAllTaskByAcroynm = await axios.post(
              "http://localhost:8080/tasks/acronym",
              params2,
              {
                headers: { Authorization: `Basic ${token}` },
              }
            );
            if (resAllTaskByAcroynm) {
              setTasks(resAllTaskByAcroynm.data);
            }
          } catch (error) {
            toast.error(`Unable to refresh`);
          }
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to Promote`);
      }
    };

    promoteAndRefreshBoard();
  };

  // Submit edited value to database
  const onDemoteHandler = (values) => {
    const { taskId, addTaskNotes } = values;

    const params = {
      // Task_notes: notes,
      Task_id: taskId,
      Add_Task_Notes: addTaskNotes,
    };

    const token = localStorage.getItem("token");

    const demoteAndRefreshBoard = async () => {
      try {
        const res = await axios.put(
          "http://localhost:8080/task/demote",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        if (res) {
          toast.success("Task Demoted");
          const params2 = { Task_app_Acronym: appAcronym };
          try {
            const resAllTaskByAcroynm = await axios.post(
              "http://localhost:8080/tasks/acronym",
              params2,
              {
                headers: { Authorization: `Basic ${token}` },
              }
            );
            if (resAllTaskByAcroynm) {
              setTasks(resAllTaskByAcroynm.data);
            }
          } catch (error) {
            toast.error(`Unable to refresh`);
          }
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to Demote`);
      }
    };

    demoteAndRefreshBoard();
  };

  return (
    <>
      <Formik
        initialValues={{
          name: selTask.Task_name ?? "",
          description: selTask.Task_description ?? "",
          notes: selTask.Task_notes ?? "",
          addTaskNotes: "",
          taskId: selTask.Task_id ?? "",
          plan: selTask.Task_plan ?? "",
          appAcronym: selTask.Task_app_Acronym ?? "",
          taskState: selTask.Task_state ?? "",
          creator: selTask.Task_creator ?? "",
          owner: selTask.Task_owner ?? "",
          createDate: selTask.Task_createDate ?? "",
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
                <Field
                  id="name"
                  name="name"
                  disabled
                  style={{ width: "100%" }}
                />
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
                  disabled
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
                <Field
                  id="notes"
                  name="notes"
                  disabled
                  style={{ width: "100%" }}
                  component="textarea"
                />
                {touched.notes && errors.notes && (
                  <div className="formErrors">{errors.notes}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="addTaskNotes">Add Task Notes</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="addTaskNotes"
                  name="addTaskNotes"
                  style={{ width: "100%" }}
                  component="textarea"
                />
                {touched.addTaskNotes && errors.addTaskNotes && (
                  <div className="formErrors">{errors.addTaskNotes}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="taskId">Task ID</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="taskId"
                  name="taskId"
                  style={{ width: "100%" }}
                  disabled
                />
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
                  disabled
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
                  disabled
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
                <Field
                  id="creator"
                  name="creator"
                  style={{ width: "100%" }}
                  disabled
                />
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
                <Field
                  id="owner"
                  name="owner"
                  style={{ width: "100%" }}
                  disabled
                />
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
                  disabled
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
                <Button
                  style={{
                    width: "100%",
                  }}
                  onClick={() => {
                    onDemoteHandler(values);
                  }}
                >
                  Demote
                </Button>
                <Button
                  type="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  Save
                </Button>
                <Button
                  style={{
                    width: "100%",
                  }}
                  onClick={() => {
                    onPromoteHandler(values);
                  }}
                >
                  Promote
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
