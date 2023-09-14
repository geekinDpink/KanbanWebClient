import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

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
        <Col>
          <h3>User Management</h3>
        </Col>
        <Col>
          <Button onClick={() => navigate("/create_user")}>
            Create New User
          </Button>
        </Col>
      </Row>
      <Row>
        <Table bordered hover size="sm" style={{ marginLeft: "15px" }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>User Group</th>
              <th>Active Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.usergroup}</td>
                  <td>{user.active}</td>
                  <td>
                    <Button
                      onClick={() => {
                        // Route to edit user page and pass username to edit user details form
                        navigate("/edit_user", {
                          state: { username: user.username },
                        });
                      }}
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
      </Row>
    </>
  );
}
