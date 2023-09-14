import React from "react";
import Form from "react-bootstrap/Form";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container } from "react-bootstrap";

export default function CreateUserPage() {
  const onSubmitHandler = (values) => {
    const { username, password, email, usergroup } = values;
    console.log("value after submit", values);

    // convert usergrp array to string to save to db
    const usergroupStr = usergroup.join(",");

    const params = {
      username: username,
      password: password,
      email: email,
      usergroup: usergroupStr,
    };
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/register", params, {
        headers: { Authorization: `Basic ${token}` },
      })
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
