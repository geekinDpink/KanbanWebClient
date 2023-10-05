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

  // Authentication and Authorisation (Admin) Check and Fetch Data on load
  useEffect(() => {
    const token = localStorage.getItem("token");

    const authUserFetchData = async (token) => {
      // Check if user is valid and is admin (for header link)
      try {
        const res = await axios.get("http://localhost:8080/user/auth", {
          headers: { Authorization: `Basic ${token}` },
        });

        if (res.data.isAdmin) {
          redDispatch({ type: "isAdmin" });
        } else {
          redDispatch({ type: "notAdmin" });
        }

        // Check app permit
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
          toast("No task record found");
          console.log(error);
        }

        // Fetch Plans data
        try {
          const params2 = { Plan_app_Acronym: appAcronym };
          const resPlan = await axios.post(
            "http://localhost:8080/plans/acronym",
            params2,
            {
              headers: { Authorization: `Basic ${token}` },
            }
          );
          if (resPlan.data.length > 0) {
            setPlans(resPlan.data);
          } else {
            toast.error("No Plan record found");
          }
        } catch (error) {
          console.log(error);
          toast.error("Unable to retrieve plan record");
          setPlans([]);
        }
      } catch (err) {
        console.log(err);
        redDispatch({ type: "logout" });
      }
    };

    if (token) {
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
                              App_Acronym: plan.Plan_app_Acronym,
                              Plan_Name: plan.Plan_MVP_name,
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
