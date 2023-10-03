import React, { useContext, useState, useEffect } from "react";import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import {
  Col,
  Row,
  Container,
  Modal,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import CreateTaskDetailForm from "../components/CreateTaskDetailForm";
import EditTaskDetailForm from "../components/EditTaskDetailForm";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";

export default function KanbanBoardPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const appLocation = useLocation();
  const { App_Acronym: appAcronym } = appLocation.state;

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
        console.log("permit res", resPermit);
        resPermit.data.isCreate
          ? redDispatch({ type: "isCreate" })
          : redDispatch({ type: "notCreate" });

        resPermit.data.isOpen
          ? redDispatch({ type: "isOpen" })
          : redDispatch({ type: "notOpen" });

        resPermit.data.isTodo
          ? redDispatch({ type: "isTodo" })
          : redDispatch({ type: "notTodo" });

        resPermit.data.isDoing
          ? redDispatch({ type: "isDoing" })
          : redDispatch({ type: "notDoing" });

        resPermit.data.isDoing
          ? redDispatch({ type: "isDone" })
          : redDispatch({ type: "notDone" });
      } catch (error) {
        toast("No task record found");
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
        console.log("task res", response);
        setTasks(response.data);
      } catch (error) {
        toast("No task record found");
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
          <Col>
            {redState.isCreate && (
              <Button onClick={() => setShowCreateModal(true)} variant="info">
                Create Task
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
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setSelectedTaskId(task.Task_id);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
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
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setSelectedTaskId(task.Task_id);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
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
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setSelectedTaskId(task.Task_id);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
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
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setSelectedTaskId(task.Task_id);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
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
                  return <Card key={task.Task_id}>{task.Task_name}</Card>;
                })}
            </div>
          </Col>
        </Row>
        <Modal show={showCreateModal}>
          <Modal.Header>
            <p>Create Task</p>
            <Button
              onClick={() => {
                setShowCreateModal(false);
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
        <Modal show={showEditModal}>
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
              selectedTaskId={selectedTaskId}
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
