import React, { useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AppDetailForm from "../components/AppDetailForm";
import moment from "moment";

export default function EditAppPage() {
  const appLocation = useLocation();
  const { App_Acronym: appAcronym } = appLocation.state;

  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

  // Authentication and Authorisation (Admin) Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    const authUser = async (token) => {
      try {
        const res = await axios.get("http://localhost:8080/user/auth", {
          headers: { Authorization: `Basic ${token}` },
        });

        if (res.data.isAdmin) {
          redDispatch({ type: "isAdmin" });
        } else {
          redDispatch({ type: "notAdmin" });
        }
      } catch (err) {
        // api call is validation process e.g. token, if fail refuse entry and logout
        console.log(err);
        redDispatch({ type: "logout" });
      }
    };

    if (token) {
      // Get my user detail based on username in token
      authUser(token);
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
      App_Rnumber: parseInt(rnumber),
      // if date is "", moment will return "invalid date" string
      App_StartDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      App_EndDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      App_Permit_Create: permitCreate,
      App_Permit_Open: permitOpen,
      App_Permit_ToDoList: permitTodo,
      App_Permit_Doing: permitDoing,
      App_Permit_Done: permitDone,
    };
    console.log("params", params);
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:8080/app", params, {
        headers: { Authorization: `Basic ${token}` },
      })
      .then((res) => {
        console.log("create submit res", res);
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
            <h1>Edit App Page</h1>
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
          <AppDetailForm
            mode="edit"
            onSubmitHandler={onSubmitHandler}
            appAcronym={appAcronym}
          />
        </Row>
      </Container>
    </>
  );
}
