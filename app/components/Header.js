import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  // Login: Correct - get token and store to local storage and Wrong - snack bar
  const submitLoginHandler = async (event) => {
    event.preventDefault(); // prevent form from resetting on submit
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
        // console.log("no token", res.data);
      }
    } catch (err) {
      console.log(err);
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
            {!isLoggedIn ? (
              <Form
                className="d-flex"
                onSubmit={(event) => submitLoginHandler(event)}
              >
                <Form.Control
                  type="search"
                  ide="username"
                  placeholder="Username"
                  className="me-2"
                  aria-label="username"
                />
                <Form.Control
                  type="search"
                  ide="password"
                  placeholder="Password"
                  className="me-2"
                  aria-label="password"
                />
                <Button variant="outline-success" type="submit">
                  Login
                </Button>
              </Form>
            ) : (
              <Form
                className="d-flex"
                onSubmit={(event) => submitLogoutHandler(event)}
              >
                <Button variant="outline-success" type="submit">
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
