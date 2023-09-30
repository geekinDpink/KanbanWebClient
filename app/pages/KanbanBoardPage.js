import React, { useContext, useState, useEffect } from "react";import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import { Col, Row, Container, ListGroup, Card } from "react-bootstrap";
import axios from "axios";
export default function KanbanBoardPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const [tasks, setTasks] = useState([]);

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

  console.log(tasks);

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Card>
              <Card.Header>To Do</Card.Header>
              <ListGroup>
                {tasks
                  .filter((task) => task.Task_state === "create")
                  .map((task) => {
                    console.log(task);
                    return (
                      <ListGroup.Item key={task.Task_id}>
                        {task.Task_name}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Card>
          </Col>
          <Col xs={2}>
            <Card>
              <Card.Header>To Do List</Card.Header>
              <ListGroup>
                {tasks
                  .filter((task) => task.Task_state === "todolist")
                  .map((task) => {
                    return (
                      <ListGroup.Item key={task.Task_id}>
                        {task.Task_name}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Card>
          </Col>
          <Col xs={2}>
            <Card>
              <Card.Header>Doing</Card.Header>
              <ListGroup>
                {tasks
                  .filter((task) => task.Task_state === "doing")
                  .map((task) => {
                    return (
                      <ListGroup.Item key={task.Task_id}>
                        {task.Task_name}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Card>
          </Col>
          <Col xs={2}>
            <Card>
              <Card.Header>Done</Card.Header>
              <ListGroup>
                {tasks
                  .filter((task) => task.Task_state === "done")
                  .map((task) => {
                    return (
                      <ListGroup.Item key={task.Task_id}>
                        {task.Task_name}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Card>
          </Col>
          <Col xs={2}>
            <Card>
              <Card.Header>Closed</Card.Header>
              <ListGroup>
                {tasks
                  .filter((task) => task.Task_state === "closed")
                  .map((task) => {
                    return (
                      <ListGroup.Item key={task.Task_id}>
                        {task.Task_name}
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
