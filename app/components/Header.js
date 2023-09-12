import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // Login: Correct - get token and store to local storage and Wrong - snack bar
  const submitLoginHandler = async (event) => {
    event.preventDefault(); // prevent form from resetting on submit
    if (event.target[0].value && event.target[1].value) {
      try {
        const res = await axios.post("http://localhost:8080/login", {
          username: event.target[0].value,
          password: event.target[1].value,
        });
        if (res.data.token) {
          // console.log("token", res.data);
          localStorage.setItem("token", res.data.token);
          setIsLoggedIn(true);
        } else {
          setToastMsg(res.data.remarks);
          setShowToast(true);

          // console.log("no token", res.data);
        }
      } catch (err) {
        console.log(err);
        setToastMsg(err.response.data.remarks);
        setShowToast(true);
      }
    } else {
      setToastMsg("Incomplete/empty fields");
      setShowToast(true);
    }
  };

  // Logout: delete token from local storage
  const submitLogoutHandler = (event) => {
    event.preventDefault(); // prevent form from resetting on submit
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">TM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="./">Home</Nav.Link>
            <Nav.Link href="./user_management">Manage Users</Nav.Link>

            <Toast
              style={{
                zIndex: "999!important",
                width: "200px",
                height: "80px",
              }}
              delay={2000}
              autohide
              onClose={() => setShowToast(false)}
              show={showToast}
            >
              <Toast.Header
                style={{
                  backgroundColor: "pink",
                  color: "black",
                  fontSize: "11px",
                }}
              >
                Error: Unable to Login
              </Toast.Header>
              <Toast.Body
                style={{
                  backgroundColor: "pink",
                  color: "black",
                  fontSize: "11px",
                }}
              >
                Reason: {toastMsg}
              </Toast.Body>
            </Toast>
            {!isLoggedIn ? (
              <Form
                className="d-flex"
                onSubmit={(event) => submitLoginHandler(event)}
              >
                <Form.Control
                  type="search"
                  id="username"
                  placeholder="Username"
                  className="me-2"
                  aria-label="username"
                />
                <Form.Control
                  type="search"
                  id="password"
                  placeholder="Password"
                  className="me-2"
                  aria-label="password"
                />
                <Button variant="success" type="submit">
                  Login
                </Button>
              </Form>
            ) : (
              <Form
                className="d-flex"
                onSubmit={(event) => submitLogoutHandler(event)}
              >
                <Nav.Link href="./my_profile">My Profile</Nav.Link>
                <Button variant="secondary" type="submit">
                  Logout
                </Button>
              </Form>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
