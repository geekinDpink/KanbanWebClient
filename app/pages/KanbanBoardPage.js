import React, { useContext, useState, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
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
import axios from "axios";

export default function KanbanBoardPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    const authUserFetchData = async (token) => {
      try {
        const res = await axios.get("http://localhost:8080/user/admin", {
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
        const response = await axios.get("http://localhost:8080/tasks", {
          headers: { Authorization: `Basic ${token}` },
        });
        console.log("task res", response);
        setTasks(response.data);
      } catch (error) {
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(error);
        setApplications([]);
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
            <Button onClick={() => setShowModal(true)} variant="info">
              Create Task
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <h3>Create</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "create")
                .map((task) => {
                  return (
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setShowModal(true);
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
            <h3>To Do List</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "todolist")
                .map((task) => {
                  return <Card key={task.Task_id}>{task.Task_name}</Card>;
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>Doing</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "doing")
                .map((task) => {
                  return <Card key={task.Task_id}>{task.Task_name}</Card>;
                })}
            </div>
          </Col>
          <Col xs={2}>
            <h3>Done</h3>
            <div>
              {tasks
                .filter((task) => task.Task_state === "done")
                .map((task) => {
                  return <Card key={task.Task_id}>{task.Task_name}</Card>;
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
                    <Card key={task.Task_id}>
                      {task.Task_name}
                      <Button
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Card>
                  );
                })}
            </div>
          </Col>
        </Row>
        <Modal show={showModal}>
          <Modal.Header>
            <p>Create Task</p>
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close
            </Button>
          </Modal.Header>
          <Modal.Body>
            <CreateTaskDetailForm setTasks={setTasks} />
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
