import React, { useState, useContext, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Container } from "react-bootstrap";

export default function AppManagementPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const [applications, setApplications] = useState([]);

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user/admin", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("Kanbanboard res", res.data);
          if (res.data.isAdmin) {
            redDispatch({ type: "isAdmin" });
          } else {
            redDispatch({ type: "notAdmin" });
          }

          axios
            .get("http://localhost:8080/apps", {
              headers: { Authorization: `Basic ${token}` },
            })
            .then((response) => {
              setApplications(response.data);
            });
        })
        .catch((err) => {
          // api call is validation process e.g. token, if fail refuse entry and logout
          console.log(err);
          redDispatch({ type: "logout" });
        });
    } else {
      redDispatch({ type: "logout" });
    }
  }, []);

  return (
    <Container>
      <Row>
        <Col xs s md={6}>
          <h1>Application Management</h1>
        </Col>
        <Col xs s md={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
            }}
          >
            <Button onClick={() => navigate("/create_user")} variant="info">
              Create App
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs s md={8}>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>Acronym</th>
                <th style={{ width: "20%" }}>Description</th>
                <th style={{ width: "5%" }}>Start Date</th>
                <th style={{ width: "5%" }}>End Date</th>
                <th style={{ width: "10%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.App_Acronym}>
                    <td>{app.App_Acronym}</td>
                    <td>{app.App_Description}</td>
                    <td>{app.App_startDate}</td>
                    <td>{app.App_endDate}</td>
                    <td>
                      <button>Edit App</button>
                      <button>View Kanban Board</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>App Records are unavailable </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
