import React, { useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppDetailForm from "../components/AppDetailForm";
import moment from "moment";

export default function CreateAppPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user/admin", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("createApp res", res.data);
          if (res.data.isAdmin) {
            redDispatch({ type: "isAdmin" });
          } else {
            redDispatch({ type: "notAdmin" });
          }
        })
        .catch((err) => {
          // api call is validation process e.g. token, if fail refuse entry and logout
          console.log(err);
          redDispatch({ type: "logout" });
        });
    } else {
      redDispatch({ type: "logout" });
    }
  }, []);

  const onSubmitHandler = (values, resetForm) => {
    const {
      acronym,
      description,
      rnumber,
      startDate,
      endDate,
      permitCreate,
      permitOpen,
      permitTodo,
      permitDoing,
      permitDone,
    } = values;
    console.log("value after submit", values);

    const params = {
      App_Acronym: acronym,
      App_Description: description,
      App_Rnumber: rnumber,
      App_StartDate: moment(startDate).format("YYYY-MM-DD"),
      App_EndDate: moment(endDate).format("YYYY-MM-DD"),
      App_Permit_Create: permitCreate,
      App_Permit_Open: permitOpen,
      App_Permit_Todo: permitTodo,
      App_Permit_Doing: permitDoing,
      App_Permit_Done: permitDone,
    };
    console.log("params", params);
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:8080/app", params, {
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
          <Col xs sm md={4}>
            <h1>Create App Page</h1>
          </Col>
          <Col xs sm md={2}>
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
        <Row>
          <AppDetailForm mode="create" onSubmitHandler={onSubmitHandler} />
        </Row>
      </Container>
    </>
  );
}
