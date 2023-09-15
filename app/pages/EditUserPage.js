import React, { useEffect, useContext } from "react";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

export default function EditUserPage() {
  const user = useLocation();
  const { username: selUsername, mode } = user.state;
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  const onSubmitHandler = (values) => {
    const { username, password, email, usergroup } = values;
    const usergroupStr = usergroup.join(",");
    const params = {
      username: username,
      password: password,
      email: email,
      usergroup: usergroupStr,
      active: true,
    };
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:8080/users", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("getUserProfile res", res.data);
          // setUser(res.data[0]);

          // if (res && token) {
          //   redDispatch({ type: "login" });
          // }
          if (res.data[0].usergroup.includes("admin")) {
            //console.log("CreateUser Before Disp IsAdmin", redState);
            redDispatch({ type: "isAdmin" });
            //console.log("CreateUser After Disp IsAdmin", redState);
          } else {
            //console.log("CreateUser Before Disp notAdmin", redState);
            redDispatch({ type: "notAdmin" });
            //console.log("CreateUser After Disp notAdmin", redState);
          }
        })
        .catch((err) => {
          // api call is validation process e.g. token, if fail refuse entry and logout
          console.log(err);
          //console.log("CreateUser Before Disp logout", redState);
          redDispatch({ type: "logout" });
          //console.log("CreateUser After Disp logout", redState);
        });
    } else {
      redDispatch({ type: "logout" });
    }
  }, []);
  return (
    <>
      <Container style={{ alignContent: "center", justifyContent: "center" }}>
        <h1>Edit User Detail</h1>
        <UserDetailForm
          onSubmitHandler={onSubmitHandler}
          username={selUsername}
          mode={mode}
        />
      </Container>
    </>
  );
}
