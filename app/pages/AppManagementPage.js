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
import { useNavigate } from "react-router-dom";

export default function AppManagementPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

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

        try {
          const params = { App_Acronym: null };
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
          toast("Unable to retrieve user permits");
          console.log(error);
        }

        try {
          const response = await axios.get("http://localhost:8080/apps", {
            headers: { Authorization: `Basic ${token}` },
          });
          if (response.data.length > 0) {
            setApplications(response.data);
          } else {
            toast("No app records found");
          }
        } catch (error) {
          console.log(error);
          toast("Unable to retrieve app records");
          setApplications([]);
        }
      } catch (err) {
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(err);
        redDispatch({ type: "logout" });
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
          <h1>Application Management</h1>
        </Col>
        <Col xs sm md={2}>
          {redState.isApp && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "5px",
              }}
            >
              <Button onClick={() => navigate("/create_app")} variant="info">
                Create App
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs sm md={8}>
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
                      {redState.isApp ? (
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
                      ) : (
                        <Button
                          onClick={() =>
                            navigate("/view_app", {
                              state: {
                                App_Acronym: app.App_Acronym,
                              },
                            })
                          }
                          style={{ marginTop: "3px", marginBottom: "5px" }}
                          variant="primary"
                        >
                          View
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          navigate("/kanban_board", {
                            state: {
                              App_Acronym: app.App_Acronym,
                            },
                          })
                        }
                        style={{ marginBottom: "5px" }}
                        variant="warning"
                      >
                        Kanban Board
                      </Button>
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

// Callback version
// useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     // Get my user detail based on username in token
//     axios
//       .get("http://localhost:8080/user/auth", {
//         headers: { Authorization: `Basic ${token}` },
//       })
//       .then((res) => {
//         console.log("Kanbanboard res", res.data);
//         if (res.data.isAdmin) {
//           redDispatch({ type: "isAdmin" });
//         } else {
//           redDispatch({ type: "notAdmin" });
//         }

//         axios
//           .get("http://localhost:8080/apps", {
//             headers: { Authorization: `Basic ${token}` },
//           })
//           .then((response) => {
//             setApplications(response.data);
//           });
//       })
//       .catch((err) => {
//         // api call is validation process e.g. token, if fail refuse entry and logout
//         console.log(err);
//         redDispatch({ type: "logout" });
//       });
//   } else {
//     redDispatch({ type: "logout" });
//   }
// }, []);
