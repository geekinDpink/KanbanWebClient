import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Header() {
  // get usergroups for usergroup dropdown list
  const submitHandler = (event) => {
    event.preventDefault(); // prevent form from resetting on submit
    axios
      .post("http://localhost:8080/login", {
        username: event.target[0].value,
        password: event.target[1].value,
      })
      .then((res) => {
        // console.log(res);
        localStorage.setItem("token", res.data.token);
      })
      .catch((err) => console.log(err));
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
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            <Form className="d-flex" onSubmit={(event) => submitHandler(event)}>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
