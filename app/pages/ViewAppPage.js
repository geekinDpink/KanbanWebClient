import React, { useEffect, useContext } from "react";import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import AppDetailForm from "../components/AppDetailForm";

export default function ViewAppPage() {
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

  return (
    <>
      <Container>
        <Row>
          <Col xs sm md={4}>
            <h1>View App Page</h1>
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
          <AppDetailForm mode="view" appAcronym={appAcronym} />
        </Row>
      </Container>
    </>
  );
}
