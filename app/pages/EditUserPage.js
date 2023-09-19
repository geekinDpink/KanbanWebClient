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

  const onSubmitHandler = (values, resetForm) => {
    const { username, password, email, usergroup, active } = values;

    // 1 or more input = Array, 0 input = string
    const usergroupStr =
      usergroup instanceof Array ? usergroup.join(",") : usergroup;

    const params = {
      username: username.toLowerCase().trim(),
      password: password.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      usergroup: usergroupStr,
      active: active,
    };
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:8080/users", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        toast.success("Form Submitted");
        // resetForm(); // clear form but useEffect will repopulate form
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
          <Col xs s md={4}>
            <h1>Edit User Detail</h1>
          </Col>
          <Col xs s md={2}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                variant="secondary"
              >
                Back
              </Button>
            </div>
          </Col>
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
