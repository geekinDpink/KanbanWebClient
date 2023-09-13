import React from "react";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function EditUserPage() {
  const user = useLocation();
  const username = user.state.username;

  const onSubmitHandler = (values) => {
    const { username, password, email, usergroup } = values;
    const params = {
      username: username,
      password: password,
      email: email,
      usergroup: usergroup,
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
        <h1>Edit User Detail</h1>
        <UserDetailForm
          onSubmitHandler={onSubmitHandler}
          username={username}
          mode="editMyProfile"
        />
      </Container>
    </>
  );
}
