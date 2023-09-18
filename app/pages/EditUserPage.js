import React, { useEffect, useContext } from "react";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";

export default function EditUserPage() {
  const user = useLocation();
  const { username: selUsername, mode } = user.state;
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

  const onSubmitHandler = (values) => {
    const { username, password, email, usergroup } = values;

    // 1 or more input = Array, 0 input = string
    const usergroupStr =
      usergroup instanceof Array ? usergroup.join(",") : usergroup;

    const params = {
      username: username.toLowerCase().trim(),
      password: password.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      usergroup: usergroupStr,
      active: true,
    };
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:8080/users", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        toast.success("Form Submitted");
        console.log(res);
      })
      .catch((err) => {
        toast.error(`Unable to submit; ${err.response}`);
        console.log("err response", err);
      });
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
        <Row>
          <Col>
            <h1>Edit User Detail</h1>
          </Col>
          {/* <Col>
            <Button
              onClick={() => {
                navigate("/user_management");
              }}
            >
              Back
            </Button>
          </Col> */}
        </Row>
        <UserDetailForm
          onSubmitHandler={onSubmitHandler}
          username={selUsername}
          mode={mode}
        />
      </Container>
    </>
  );
}
