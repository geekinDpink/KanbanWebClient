import React, { useContext, useState, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import { Col, Row, Container, Modal, Card, Button } from "react-bootstrap";
import CreateTaskDetailForm from "../components/CreateTaskDetailForm";
import EditTaskDetailForm from "../components/EditTaskDetailForm";
import PlanDetailForm from "../components/PlanDetailForm";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";

export default function KanbanBoardPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const [tasks, setTasks] = useState([]);
  // Cannot be empty useState() as div style will backgroundColor: plans[task.Task_plan]
  const [plans, setPlans] = useState({});
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isPermitPlan, setIsPermitPlan] = useState(false);
  const [isPermitPromote, setIsPermitPromote] = useState(false);
  const [isPermitDemote, setIsPermitDemote] = useState(false);

  const appLocation = useLocation();
  const { App_Acronym: appAcronym } = appLocation.state;
  const navigate = useNavigate();

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    const authUserFetchData = async (token) => {
      try {
        const res = await axios.get("http://localhost:8080/user/auth", {
          headers: { Authorization: `Basic ${token}` },
        });

        if (res.data.isAdmin) {
          redDispatch({ type: "isAdmin" });
        } else {
          redDispatch({ type: "notAdmin" });
        }
      } catch (err) {
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(err);
        redDispatch({ type: "logout" });
      }

      try {
        const params = { App_Acronym: appAcronym };
        const resPermit = await axios.post(
          "http://localhost:8080/user/permits",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        resPermit.data.isCreate
          ? redDispatch({ type: "isCreate" })
          : redDispatch({ type: "notCreate" });

        resPermit.data.isOpen
          ? redDispatch({ type: "isOpen" })
          : redDispatch({ type: "notOpen" });

        resPermit.data.isTodolist
          ? redDispatch({ type: "isTodo" })
          : redDispatch({ type: "notTodo" });

        resPermit.data.isDoing
          ? redDispatch({ type: "isDoing" })
          : redDispatch({ type: "notDoing" });

        resPermit.data.isDone
          ? redDispatch({ type: "isDone" })
          : redDispatch({ type: "notDone" });

        resPermit.data.isPlan
          ? redDispatch({ type: "isPlan" })
          : redDispatch({ type: "notPlan" });

        resPermit.data.isApp
          ? redDispatch({ type: "isApp" })
          : redDispatch({ type: "notApp" });
      } catch (error) {
        // toast("Unable to retrieve user permits");
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(error);
      }

      try {
        const params = { Task_app_Acronym: appAcronym };
        const response = await axios.post(
          "http://localhost:8080/tasks/acronym",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        // console.log("task res", response);
        setTasks(response.data);
      } catch (error) {
        // toast("No task record found");
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log("No task record found", error);
      }

      try {
        const params = { Plan_app_Acronym: appAcronym };
        const resPlan = await axios.post(
          "http://localhost:8080/plans/acronym",
          params,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );

        // resPlan.data, array of plan object, iterate through each object and
        let planColorObj = {};
        resPlan.data.forEach((plan) => {
          planColorObj[plan.Plan_MVP_name] = plan.Plan_color;
        });
        setPlans(planColorObj);
      } catch (error) {
        console.log("No plan record found");
        // toast("No plan record found");
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(error);
      }
    };

    if (token) {
      // Get my user detail based on username in token
      authUserFetchData(token);
    } else {
      redDispatch({ type: "logout" });
    }
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <h1>Kanban Board</h1>
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs sm md={2}>
            <h5>App Acronym: {appAcronym}</h5>
          </Col>
          <Col xs sm md={1}>
            {redState.isCreate && (
              <Button
                onClick={() => setShowCreateTaskModal(true)}
                variant="info"
                style={{ fontSize: "15px", padding: "10px" }}
              >
                Add Task
              </Button>
            )}
          </Col>
          <Col xs sm md={1}>
            {redState.isPlan && (
              <Button
                onClick={() => setShowCreatePlanModal(true)}
                variant="info"
                style={{ fontSize: "15px", padding: "10px" }}
              >
                Add Plan
              </Button>
            )}
          </Col>
          <Col xs sm md={1}>
            {redState.isPlan && (
              <Button
                onClick={() =>
                  navigate("/plan_management", {
                    state: {
                      App_Acronym: appAcronym,
                    },
                  })
                }
                variant="info"
                style={{ fontSize: "15px", padding: "10px 9px" }}
              >
                View Plan
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <h3>Open</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "open")
                .map((task) => {
                  return (
                    <Card
                      key={task.Task_id}
                      style={{
                        borderStyle: "solid",
                        borderColor: plans[task.Task_plan] ?? "black",
                        borderWidth: "2px",
                      }}
                    >
                      <Card.Body style={{ margin: "0px", padding: "0px" }}>
                        <Card.Title style={{ marginLeft: "5px" }}>
                          Task: {task.Task_name}
                        </Card.Title>
                        <Card.Text
                          style={{
                            height: "100px",
                            maxHeight: "100px",
                            overflowY: "auto",
                            margin: "5px",
                            padding: "0px",
                          }}
                        >
                          <div>Plan: {task.Task_plan}</div>
                          <div>Description: {task.Task_description}</div>
                        </Card.Text>
                        <Button
                          style={{ marginLeft: "35%", height: "35px" }}
                          onClick={() => {
                            console.log("redState", redState);
                            if (redState.isOpen) {
                              setIsPermitPlan(true);
                              setIsPermitPromote(true);
                              setIsPermitDemote(false);
                            } else {
                              setIsPermitPlan(false);
                              setIsPermitPromote(false);
                              setIsPermitDemote(false);
                            }
                            setSelectedTaskId(task.Task_id);
                            setShowEditModal(true);
                          }}
                        >
                          {redState.isOpen ? "Edit" : "View"}
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>To Do</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "todolist")
                .map((task) => {
                  return (
                    <Card
                      key={task.Task_id}
                      style={{
                        borderStyle: "solid",
                        borderColor: plans[task.Task_plan] ?? "black",
                        borderWidth: "2px",
                      }}
                    >
                      <Card.Body style={{ margin: "0px", padding: "0px" }}>
                        <Card.Title style={{ marginLeft: "5px" }}>
                          Task: {task.Task_name}
                        </Card.Title>
                        <Card.Text
                          style={{
                            height: "100px",
                            maxHeight: "100px",
                            overflowY: "auto",
                            margin: "5px",
                            padding: "0px",
                          }}
                        >
                          <div>Plan: {task.Task_plan}</div>
                          <div>Description: {task.Task_description}</div>
                        </Card.Text>
                        <Button
                          style={{ marginLeft: "35%", height: "35px" }}
                          onClick={() => {
                            console.log("redState isTodoList", redState);
                            if (redState.isTodolist) {
                              setIsPermitPlan(false);
                              setIsPermitPromote(true);
                              setIsPermitDemote(false);
                            } else {
                              setIsPermitPlan(false);
                              setIsPermitPromote(false);
                              setIsPermitDemote(false);
                            }
                            setSelectedTaskId(task.Task_id);
                            setShowEditModal(true);
                          }}
                        >
                          {redState.isTodolist ? "Edit" : "View"}
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>Doing</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "doing")
                .map((task) => {
                  return (
                    <Card
                      key={task.Task_id}
                      style={{
                        borderStyle: "solid",
                        borderColor: plans[task.Task_plan] ?? "black",
                        borderWidth: "2px",
                      }}
                    >
                      <Card.Body style={{ margin: "0px", padding: "0px" }}>
                        <Card.Title style={{ marginLeft: "5px" }}>
                          Task: {task.Task_name}
                        </Card.Title>
                        <Card.Text
                          style={{
                            height: "100px",
                            maxHeight: "100px",
                            overflowY: "auto",
                            margin: "5px",
                            padding: "0px",
                          }}
                        >
                          <div>Plan: {task.Task_plan}</div>
                          <div>Description: {task.Task_description}</div>
                        </Card.Text>
                        <Button
                          style={{ marginLeft: "35%", height: "35px" }}
                          onClick={() => {
                            if (redState.isDoing) {
                              setIsPermitPlan(false);
                              setIsPermitPromote(true);
                              setIsPermitDemote(true);
                            } else {
                              setIsPermitPlan(false);
                              setIsPermitPromote(false);
                              setIsPermitDemote(false);
                            }
                            setSelectedTaskId(task.Task_id);
                            setShowEditModal(true);
                          }}
                        >
                          {redState.isDoing ? "Edit" : "View"}
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>Done</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "done")
                .map((task) => {
                  return (
                    <Card
                      key={task.Task_id}
                      style={{
                        borderStyle: "solid",
                        borderColor: plans[task.Task_plan] ?? "black",
                        borderWidth: "2px",
                      }}
                    >
                      <Card.Body style={{ margin: "0px", padding: "0px" }}>
                        <Card.Title style={{ marginLeft: "5px" }}>
                          Task: {task.Task_name}
                        </Card.Title>
                        <Card.Text
                          style={{
                            height: "100px",
                            maxHeight: "100px",
                            overflowY: "auto",
                            margin: "5px",
                            padding: "0px",
                          }}
                        >
                          <div>Plan: {task.Task_plan}</div>
                          <div>Description: {task.Task_description}</div>
                        </Card.Text>
                        <Button
                          style={{ marginLeft: "35%", height: "35px" }}
                          onClick={() => {
                            if (redState.isDone) {
                              setIsPermitPlan(true);
                              setIsPermitPromote(true);
                              setIsPermitDemote(true);
                            } else {
                              setIsPermitPlan(false);
                              setIsPermitPromote(false);
                              setIsPermitDemote(false);
                            }
                            setSelectedTaskId(task.Task_id);
                            setShowEditModal(true);
                          }}
                        >
                          {redState.isDone ? "Edit" : "View"}
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>Closed</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "closed")
                .map((task) => {
                  return (
                    <Card
                      key={task.Task_id}
                      style={{
                        borderStyle: "solid",
                        borderColor: plans[task.Task_plan] ?? "white",
                        borderWidth: "2px",
                      }}
                    >
                      <Card.Body style={{ margin: "0px", padding: "0px" }}>
                        <Card.Title style={{ marginLeft: "5px" }}>
                          Task: {task.Task_name}
                        </Card.Title>
                        <Card.Text
                          style={{
                            height: "100px",
                            maxHeight: "100px",
                            overflowY: "auto",
                            margin: "5px",
                            padding: "0px",
                          }}
                        >
                          <div>Plan: {task.Task_plan}</div>
                          <div>Description: {task.Task_description}</div>
                        </Card.Text>
                        <Button
                          style={{ marginLeft: "35%", height: "35px" }}
                          onClick={() => {
                            setIsPermitPlan(false);
                            setIsPermitPromote(false);
                            setIsPermitDemote(false);
                            setSelectedTaskId(task.Task_id);
                            setShowEditModal(true);
                          }}
                        >
                          View
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>
          </Col>
        </Row>
        <Modal show={showCreatePlanModal} size="lg">
          <Modal.Header>
            <p>Create Plan</p>
            <Button
              onClick={() => {
                setShowCreatePlanModal(false);
              }}
              variant="secondary"
            >
              Back
            </Button>
          </Modal.Header>
          <Modal.Body>
            <PlanDetailForm appAcronym={appAcronym} mode="create" />
          </Modal.Body>
        </Modal>
        <Modal show={showCreateTaskModal} size="lg">
          <Modal.Header>
            <p>Create Task</p>
            <Button
              onClick={() => {
                setShowCreateTaskModal(false);
              }}
              variant="secondary"
            >
              Back
            </Button>
          </Modal.Header>
          <Modal.Body>
            <CreateTaskDetailForm setTasks={setTasks} appAcronym={appAcronym} />
          </Modal.Body>
        </Modal>
        <Modal show={showEditModal} dialogClassName="modal-90w">
          <Modal.Header>
            <p>Edit Task</p>
            <Button
              onClick={() => {
                setShowEditModal(false);
              }}
              variant="secondary"
            >
              Back
            </Button>
          </Modal.Header>
          <Modal.Body>
            <EditTaskDetailForm
              setTasks={setTasks}
              setShowEditModal={setShowEditModal}
              selectedTaskId={selectedTaskId}
              isPermitPlan={isPermitPlan}
              isPermitPromote={isPermitPromote}
              isPermitDemote={isPermitDemote}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

/*Each lane is a card 
<Col xs={2}>
  <Card>
    <Card.Header>Doing</Card.Header>
    <ListGroup>
      {tasks
        .filter((task) => task.Task_state === "doing")
        .map((task) => {
          return (
            <ListGroup.Item key={task.Task_id}>{task.Task_name}</ListGroup.Item>
          );
        })}
    </ListGroup>
  </Card>
</Col>
*/
