import React, { useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import UserDetailForm from "../components/UserDetailForm";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateUserPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

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
          if (res.data[0].active !== 1) {
            redDispatch({ type: "logout" });
          }
          if (
            res.data[0].usergroup.toLowerCase().split(",").includes("admin")
          ) {
            // if (res.data[0].usergroup.includes("admin")) {
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

  const onSubmitHandler = (values, resetForm) => {
    const { username, password, email, usergroup } = values;
    console.log("value after submit", values);

    // 1 or more input = Array, 0 input = string
    const usergroupStr =
      usergroup instanceof Array ? usergroup.join(",") : usergroup;

    const params = {
      username: username.toLowerCase().trim(),
      password: password.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      usergroup: usergroupStr,
    };
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/register", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log("create submit res", res);
        resetForm();
        toast.success("Form Submitted");
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(`Unable to submit, ${err.response.data.toLowerCase()}`);
      });
  };
  return (
    <>
      <Container>
        <Row>
          <Col xs s md={4}>
            <h1>Create User Page</h1>
          </Col>
          <Col xs s md={2}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() =>
                  // Route to edit user page and pass username to edit user details form
                  navigate(-1)
                }
                variant="secondary"
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>
        <UserDetailForm onSubmitHandler={onSubmitHandler} mode="create" />
      </Container>
    </>
  );
}