import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import SingleSelect from "./SingleSelect";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import SingleSelectPlan from "./SingleSelectPlan";
import moment from "moment";

export default function CreateTaskDetailForm({ setTasks, appAcronym }) {
  const [username, setUsername] = useState();
  const [appRn, setAppRn] = useState();

  const TaskSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  // onload get username and running number for creater/owner fields and task id field
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/user", {
          headers: { Authorization: `Basic ${token}` },
        });
        if (res.data.length > 0) {
          setUsername(res.data[0].username);
        } else {
          toast("Unable to retrieve username");
        }
      } catch (error) {
        console.log(error);
        toast("Database transaction/connection error");
      }
      // to retrieve running number to generate task id
      try {
        const token = localStorage.getItem("token");
        const paramsAppAcron = { App_Acronym: appAcronym };
        const response = await axios.post(
          "http://localhost:8080/app/acronym",
          paramsAppAcron,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        setAppRn(response.data[0].App_Rnumber);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

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
      Add_task_notes: notes,
      Task_id: taskId,
      Task_plan: plan,
      Task_app_Acronym: appAcronym,
      Task_state: taskState,
      Task_creator: creator,
      Task_owner: owner,
      Task_createDate: createDate,
    };

    const token = localStorage.getItem("token");

    const submitTaskAndRefreshBoard = async () => {
      try {
        // save task to db
        const resTask = await axios.post("http://localhost:8080/task", params, {
          headers: { Authorization: `Basic ${token}` },
        });
        if (resTask) {
          toast.success("Form Submitted");

          // retrieve all task by app acronym and update tasks state/kanbard board
          const params2 = { Task_app_Acronym: appAcronym };
          const resAllTaskByAcroynm = await axios.post(
            "http://localhost:8080/tasks/acronym",
            params2,
            {
              headers: { Authorization: `Basic ${token}` },
            }
          );
          if (resAllTaskByAcroynm) {
            setTasks(resAllTaskByAcroynm.data);
            // to retrieve running number to generate task id
            try {
              const token = localStorage.getItem("token");
              const paramsAppAcron = { App_Acronym: appAcronym };
              const response = await axios.post(
                "http://localhost:8080/app/acronym",
                paramsAppAcron,
                {
                  headers: { Authorization: `Basic ${token}` },
                }
              );
              setAppRn(response.data[0].App_Rnumber);
            } catch (error) {
              console.log(error);
            }
          }
          resetForm();
        }
      } catch (error) {
        toast.error("Unable to submit");
      }
    };
    submitTaskAndRefreshBoard();
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          description: "",
          notes: "",
          taskId: `${appAcronym}_${appRn}` ?? "",
          plan: "",
          appAcronym: appAcronym ?? "",
          taskState: "open",
          creator: username ?? "",
          owner: username ?? "",
          createDate: moment(new Date()).format("YYYY-MM-DD"),
        }}
        validationSchema={TaskSchema}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          onSubmitHandler(values, resetForm);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="name">Name</label>
              </Col>
              <Col xs sm md={6}>
                <Field id="name" name="name" style={{ width: "100%" }} />
                {touched.name && errors.name && (
                  <div className="formErrors">{errors.name}</div>
                )}
              </Col>
            </Row>

            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="description">Description</label>
              </Col>
              <Col xs sm md={6}>
                <Field
                  id="description"
                  name="description"
                  component="textarea"
                  style={{ width: "100%", height: "50px" }}
                />
                {touched.description && errors.description && (
                  <div className="formErrors">{errors.description}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="notes">Add Task Notes</label>
              </Col>
              <Col xs sm md={6}>
                <Field
                  id="notes"
                  name="notes"
                  style={{ width: "100%" }}
                  component="textarea"
                />
                {touched.notes && errors.notes && (
                  <div className="formErrors">{errors.notes}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="taskId">Task ID</label>
              </Col>
              <Col xs sm md={6}>
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
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="plan">Plan</label>
              </Col>
              <Col xs sm md={6}>
                <Field
                  id="plan"
                  name="plan"
                  style={{ width: "100%" }}
                  component={() => {
                    return (
                      <SingleSelectPlan
                        disabled={false}
                        setFieldValue={setFieldValue}
                        values={values}
                        App_Acronym={appAcronym}
                        mode="createTask"
                        fieldName="plan"
                        defaultValue={{
                          value: "",
                        }}
                      />
                    );
                  }}
                />
                {touched.plan && errors.plan && (
                  <div className="formErrors">{errors.plan}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="appAcronym">App Acronym</label>
              </Col>
              <Col xs sm md={6}>
                <Field
                  id="appAcronym"
                  name="appAcronym"
                  disabled
                  style={{ width: "100%" }}
                />
                {touched.appAcronym && errors.appAcronym && (
                  <div className="formErrors">{errors.appAcronym}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="taskState">Task State</label>
              </Col>
              <Col xs sm md={6}>
                <Field
                  id="taskState"
                  name="taskState"
                  disabled
                  style={{ width: "100%" }}
                />
                {touched.taskState && errors.taskState && (
                  <div className="formErrors">{errors.taskState}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="creator">Creator</label>
              </Col>
              <Col xs sm md={6}>
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
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="owner">Owner</label>
              </Col>
              <Col xs sm md={6}>
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
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="createDate">Create Date</label>
              </Col>
              <Col xs sm md={6}>
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
              <Col xs sm={0} md={2}></Col>
              <Col xs sm={1} md={2}></Col>
              <Col xs sm md={6}>
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

// Callback method for task retreival and offline add task
// axios
//   .post("http://localhost:8080/task", params, {
//     headers: { Authorization: `Basic ${token}` },
//   })
//   .then((res) => {
//     // offline addition of task
//     setTasks((task) => {
//       const arr = task;
//       arr.push(params);
//       return arr;
//     });
//     toast.success("Form Submitted");
//     resetForm();
//   })
//   .catch((err) => {
//     console.log("err", err);
//     toast.error(`Unable to submit, ${err.response.data.toLowerCase()}`);
//   });
