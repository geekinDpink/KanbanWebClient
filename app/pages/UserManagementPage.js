import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

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
          console.log("UserManagement res", res.data);
          if (res.data.isAdmin) {
            redDispatch({ type: "isAdmin" });
          } else {
            redDispatch({ type: "notAdmin" });
          }
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8080/users",
        {
          usergroup: "admin",
        },
        { headers: { Authorization: `Basic ${token}` } }
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Row>
        <Col xs sm md={6}>
          <h3>User Management</h3>
        </Col>
        <Col xs sm md={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
            }}
          >
            <Button onClick={() => navigate("/create_user")} variant="info">
              Create New User
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs sm md={8}>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Username</th>
                <th style={{ width: "10%" }}>Email</th>
                <th style={{ width: "5%" }}>User Group</th>
                <th style={{ width: "5%" }}>Active</th>
                <th style={{ width: "5%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.usergroup}</td>
                    <td>{user.active === 1 ? "Yes" : "No"}</td>
                    <td>
                      <Button
                        onClick={() => {
                          // Route to edit user page and pass username to edit user details form
                          navigate("/edit_user", {
                            state: {
                              mode: "editOthers",
                              username: user.username,
                            },
                          });
                        }}
                        variant="primary"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Useraccount Records are unavailable </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
