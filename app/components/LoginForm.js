// not use
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function LoginForm(submitHandler) {
  return (
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
  );
}
