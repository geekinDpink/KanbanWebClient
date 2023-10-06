import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import { useLocation } from "react-router-dom";

import * as Yup from "yup";
import { toast } from "react-toastify";
import SingleSelectPlan from "./SingleSelectPlan";
import moment from "moment";

// isPermit Promote also used to render Edit/View Task Btn and disable add notes field
export default function EditTaskDetailForm({
  setTasks,
  setShowEditModal,
  selectedTaskId,
  isPermitPlan,
  isPermitPromote,
  isPermitDemote,
}) {
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

  // Promote State, Add Note and Refresh Board
  const onPromoteHandler = (values) => {
    const { taskId, addTaskNotes, plan } = values;

    // Promote State, Add Note and Refresh Board
    const token = localStorage.getItem("token");

    const promoteAndRefreshBoard = async () => {
      try {
        const params = {
          // Task_notes: notes,
          Task_id: taskId,
          Add_Task_Notes: addTaskNotes,
          Task_plan: plan,
        };
        const res = await axios.put(
          "http://localhost:8080/task/promote",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        if (res) {
          toast.success("Successfully Promoted");

          // Refresh Kanban Board
          try {
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
              setShowEditModal(false);
            }
          } catch (error) {
            toast.error(`Unable to refresh`);
          }

          // Refresh Edit Note Modal
          // try {
          //   const params3 = { Task_id: taskId };
          //   const resTask = await axios.post(
          //     "http://localhost:8080/task/id",
          //     params3,
          //     {
          //       headers: { Authorization: `Basic ${token}` },
          //     }
          //   );
          //   if (resTask.data.length > 0) {
          //     setSelTask(resTask.data[0]);
          //   }
          // } catch (error) {
          //   toast.error(`Unable to update edit task note`);
          // }
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to Promote`);
      }
    };

    promoteAndRefreshBoard();
  };

  // Demote State, Add Note and Refresh Board
  const onDemoteHandler = (values) => {
    const { taskId, addTaskNotes, plan } = values;

    const params = {
      // Task_notes: notes,
      Task_id: taskId,
      Add_Task_Notes: addTaskNotes,
      Task_plan: plan,
    };

    const token = localStorage.getItem("token");

    // After demoting state, refresh board and edit task modal concurrently
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
          // Refresh Kanban Board
          try {
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
              setShowEditModal(false);
            }
          } catch (error) {
            toast.error(`Unable to refresh`);
          }

          // Refresh Edit Note Modal
          // try {
          //   const params3 = { Task_id: taskId };
          //   const resTask = await axios.post(
          //     "http://localhost:8080/task/id",
          //     params3,
          //     {
          //       headers: { Authorization: `Basic ${token}` },
          //     }
          //   );
          //   if (resTask.data.length > 0) {
          //     setSelTask(resTask.data[0]);
          //     console.log("setSelTask");
          //   }
          // } catch (error) {
          //   toast.error(`Unable to update edit task note`);
          // }
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to Demote`);
      }
    };

    demoteAndRefreshBoard();
  };

  // Add Note
  const onAddNoteHandler = (values) => {
    const { taskId, addTaskNotes } = values;

    const params = {
      // Task_notes: notes,
      Task_id: taskId,
      Add_Task_Notes: addTaskNotes,
    };

    const token = localStorage.getItem("token");

    // After adding note, refresh board and edit task modal concurrently
    const addNoteAndRefreshBoard = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/task/note",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        if (res) {
          toast.success("Added new note");
          // Refresh Kanban Board Notes
          try {
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
            }
          } catch (error) {
            toast.error(`Unable to refresh board`);
          }

          // Refresh Edit Note Modal
          try {
            const params3 = { Task_id: taskId };
            const resTask = await axios.post(
              "http://localhost:8080/task/id",
              params3,
              {
                headers: { Authorization: `Basic ${token}` },
              }
            );
            if (resTask.data.length > 0) {
              setSelTask(resTask.data[0]);
            }
          } catch (error) {
            toast.error(`Unable to update edit task note`);
          }
        }
      } catch (err) {
        console.log("err", err);
        toast.error(`Unable to add note`);
      }
    };

    addNoteAndRefreshBoard();
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
          plan: "",
          appAcronym: selTask.Task_app_Acronym ?? "",
          taskState: selTask.Task_state ?? "",
          creator: selTask.Task_creator ?? "",
          owner: selTask.Task_owner ?? "",
          createDate: selTask.Task_createDate ?? "",
          changePlan: false,
        }}
        // validationSchema={AppSchema}
        enableReinitialize
        // onSubmit={(values, { resetForm }) => {
        //   onSubmitHandler(values, resetForm);
        // }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
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
                <label htmlFor="name">Task Name</label>
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
                <label htmlFor="description">Description</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="description"
                  name="description"
                  component="textarea"
                  disabled
                  style={{ width: "100%", height: "80px" }}
                />
                {touched.description && errors.description && (
                  <div className="formErrors">{errors.description}</div>
                )}
              </Col>
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
            <Row style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Col xs sm={1} md={2}>
                <label htmlFor="plan">Plan</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="plan"
                  name="plan"
                  style={{ width: "100%" }}
                  component={() => {
                    let selectPlanMode = "editTask";
                    if (selTask.Task_state === "done") {
                      selectPlanMode = "editDoneTask";
                    }
                    return (
                      <SingleSelectPlan
                        disabled={!isPermitPlan}
                        setFieldValue={setFieldValue}
                        values={values}
                        App_Acronym={appAcronym}
                        mode={selectPlanMode}
                        fieldName="plan"
                        defaultValue={{
                          value: selTask.Task_plan,
                        }}
                      />
                    );
                  }}
                />
                {touched.plan && errors.plan && (
                  <div className="formErrors">{errors.plan}</div>
                )}
              </Col>
              <Col xs sm={1} md={2}>
                {isPermitPlan && selTask.Task_state === "done" && (
                  <label>Change Plan</label>
                )}
              </Col>
              <Col xs sm={5} md={4}>
                {isPermitPlan && selTask.Task_state === "done" && (
                  <Field type="checkbox" name="changePlan" />
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
                  style={{ width: "100%", height: "300px" }}
                  component="textarea"
                  disabled={!isPermitPromote}
                />
                {touched.addTaskNotes && errors.addTaskNotes && (
                  <div className="formErrors">{errors.addTaskNotes}</div>
                )}
              </Col>
              <Col xs sm={1} md={2}>
                <label htmlFor="notes">Task Notes</label>
              </Col>
              <Col xs sm={5} md={4}>
                <Field
                  id="notes"
                  name="notes"
                  disabled
                  style={{ width: "100%", height: "300px" }}
                  component="textarea"
                />
                {touched.notes && errors.notes && (
                  <div className="formErrors">{errors.notes}</div>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Col xs sm md={2} lg={3}></Col>
              <Col xs sm md={1} lg={2}>
                {isPermitDemote && (
                  <Button
                    style={{
                      width: "100%",
                    }}
                    onClick={() => {
                      onDemoteHandler(values);
                    }}
                    variant="danger"
                  >
                    Demote
                  </Button>
                )}
              </Col>
              <Col xs sm md={1} lg={2}>
                {isPermitPromote && (
                  <Button
                    // type="submit"
                    style={{
                      width: "100%",
                      borderColor: "black",
                      borderWidth: "2px",
                    }}
                    onClick={() => {
                      onAddNoteHandler(values);
                    }}
                    variant="light"
                  >
                    Save
                  </Button>
                )}
              </Col>
              <Col xs sm md={1} lg={2}>
                {isPermitPromote && (
                  <Button
                    style={{
                      width: "100%",
                    }}
                    onClick={() => {
                      onPromoteHandler(values);
                    }}
                    variant="success"
                  >
                    Promote
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}
// const onSubmitHandler = (values) => {
//   const {
//     name,
//     description,
//     notes,
//     taskId,
//     plan,
//     appAcronym,
//     taskState,
//     creator,
//     owner,
//     createDate,
//   } = values;

//   const params = {
//     Task_name: name,
//     Task_description: description,
//     Task_notes: notes,
//     Task_id: taskId,
//     Task_plan: plan,
//     Task_app_Acronym: appAcronym,
//     Task_state: taskState,
//     Task_creator: creator,
//     Task_owner: owner,
//     Task_createDate: createDate,
//   };

//   const token = localStorage.getItem("token");

//   axios
//     .put("http://localhost:8080/task", params, {
//       headers: { Authorization: `Basic ${token}` },
//     })
//     .then((res) => {
//       toast.success("Form Submitted");
//     })
//     .catch((err) => {
//       console.log("err", err);
//       toast.error(`Unable to submit`);
//     });
// };
