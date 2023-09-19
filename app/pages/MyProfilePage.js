import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("getUserProfile res", res.data);
          setUser(res.data[0]);

          if (res && token) {
            redDispatch({ type: "login" });
          }
          if (res.data[0].usergroup.includes("admin")) {
            //console.log("CreateUser Before Disp IsAdmin", redState);
            redDispatch({ type: "isAdmin" });
            //console.log("CreateUser After Disp IsAdmin", redState);
          } else {
            //console.log("CreateUser Before Disp notAdmin", redState);
            redDispatch({ type: "notAdmin" });
            //console.log("CreateUser After Disp notAdmin", redState);
          }
        })
        .catch((err) => {
          // api call is validation process e.g. token, if fail refuse entry and logout
          console.log(err);
          //console.log("CreateUser Before Disp logout", redState);
          redDispatch({ type: "logout" });
          //console.log("CreateUser After Disp logout", redState);
        });
    } else {
      redDispatch({ type: "logout" });
    }
  }, []);

  // Authentication Check and Get User Details
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     // Get my user detail based on username in token
  //     axios
  //       .get("http://localhost:8080/user", {
  //         headers: { Authorization: `Basic ${token}` },
  //       })
  //       .then((res) => {
  //         console.log("getUserProfile res", res.data);
  //         // setUser(res.data[0]);
  //         if (res) {
  //           //console.log("Kanban Before Disp logout", redState);
  //           setUser(res.data[0]);
  //           redDispatch({ type: "login" });
  //           //console.log("Kanban Before Disp logout", redState);
  //         }
  //       })
  //       .catch((err) => {
  //         // api call is validation process e.g. token, if fail refuse entry and logout
  //         console.log(err);
  //         //console.log("CreateUser Before Disp logout", redState);
  //         redDispatch({ type: "logout" });
  //         //console.log("CreateUser After Disp logout", redState);
  //       });
  //   } else {
  //     redDispatch({ type: "logout" });
  //   }
  // }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   // Get my user detail based on username in token
  //   axios
  //     .get("http://localhost:8080/user", {
  //       headers: { Authorization: `Basic ${token}` },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       setUser(res.data[0]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <>
      <Container>
        <Row>
          <Col xs s md={6}>
            <h1>My Profile</h1>
          </Col>
          <Col xs s md={2}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() =>
                  // Route to edit user page and pass username to edit user details form
                  navigate("/edit_user", {
                    state: {
                      mode: "editMyProfile",
                      username: user.username,
                    },
                  })
                }
                variant="primary"
              >
                Edit
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs s md={8}>
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>Fields</th>
                  <th>Description</th>
                </tr>
              </thead>
              {user ? (
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>{user.username}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>User Group</td>
                    <td>{user.usergroup}</td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={2}>Your user record is not available </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}
