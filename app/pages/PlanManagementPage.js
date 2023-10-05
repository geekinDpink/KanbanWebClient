import React, { useState, useContext, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function PlanManagementPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();
  const kanbanBoardLocation = useLocation();
  const { App_Acronym: appAcronym } = kanbanBoardLocation.state;

  const [plans, setPlans] = useState([]);

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
        const params2 = { Plan_app_Acronym: appAcronym };
        const resPlan = await axios.post(
          "http://localhost:8080/plans/acronym",
          params2,
          {
            headers: { Authorization: `Basic ${token}` },
          }
        );
        setPlans(resPlan.data);
      } catch (error) {
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(error);
        setPlans([]);
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
    <Container>
      <Row>
        <Col xs sm md={6}>
          <h1>Plan Management ({appAcronym})</h1>
        </Col>
        <Col xs sm md={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
            }}
          >
            <Button onClick={() => navigate(-1)} variant="info">
              Back
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs sm md={8}>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>Plan Name</th>
                <th style={{ width: "5%" }}>App Acronym</th>
                <th style={{ width: "5%" }}>Start Date</th>
                <th style={{ width: "5%" }}>End Date</th>
                <th style={{ width: "5%" }}>Color</th>
                <th style={{ width: "5%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan.Plan_MVP_name}>
                    <td>{plan.Plan_MVP_name}</td>
                    <td>{plan.Plan_app_Acronym}</td>
                    <td>{plan.Plan_startDate}</td>
                    <td>{plan.Plan_endDate}</td>
                    <td style={{ backgroundColor: plan.Plan_color }}></td>
                    <td>
                      <Button
                        onClick={() =>
                          navigate("/edit_app", {
                            state: {
                              App_Acronym: app.App_Acronym,
                            },
                          })
                        }
                        style={{ marginTop: "3px", marginBottom: "5px" }}
                        variant="primary"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>App Records are unavailable </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
