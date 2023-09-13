import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Container>
        <Row>
          <h1>My Profile</h1>
        </Row>
        <Row>
          <Table bordered hover size="sm" style={{ marginLeft: "15px" }}>
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
                <tr>
                  <td colSpan={2}>
                    <Button onClick={() => navigate("/edit_user")}>Edit</Button>
                  </td>
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
        </Row>
      </Container>
    </>
  );
}
