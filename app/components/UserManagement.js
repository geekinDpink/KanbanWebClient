import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8080/users", {
        myusergroup: "admin",
      })
      .then((res) => {
        console.log(JSON.stringify(res));
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log("users", users);

  return (
    <>
      <Row>
        <Col>
          <h3>User Management</h3>
        </Col>
        <Col>
          <Button>Create New User</Button>
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
                  <td>@mdo</td>
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
