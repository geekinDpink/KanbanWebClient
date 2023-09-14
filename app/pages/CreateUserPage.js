import React, { useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

export default function CreateUserPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Get my user detail based on username in token
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        // setUser(res.data[0]);
        if (res.data[0].usergroup.includes("admin")) {
          redDispatch({ type: "isAdmin" });
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
