import React from "react";
import Form from "react-bootstrap/Form";
import UserDetailForm from "./UserDetailForm";
import axios from "axios";
import { Container } from "react-bootstrap";

export default function CreateUserPage() {
  const onSubmitHandler = (values) => {
    const { username, password, email, usergroup } = values;
    const params = {
      username: username,
      password: password,
      email: email,
      usergroup: usergroup,
    };
    console.log("values", values);

    axios
      .post("http://localhost:8080/register", params)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Container style={{ alignContent: "center", justifyContent: "center" }}>
        <h1>Create User Page</h1>
        <UserDetailForm onSubmitHandler={onSubmitHandler} />
      </Container>
    </>
  );
}
