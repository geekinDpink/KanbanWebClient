import React, { useContext, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import axios from "axios";
import { Container } from "react-bootstrap";

export default function HomePage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

  // Authentication and Authorisation (Admin) Check and Login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Get my user detail based on username in token
      axios
        .get("http://localhost:8080/user/auth", {
          headers: { Authorization: `Basic ${token}` },
        })
        .then((res) => {
          console.log("getUserProfile res", res.data);

          if (res && token) {
            redDispatch({ type: "login" });
          }
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

  return (
    <Container>
      <h1>Welcome to Task Management System</h1>
      <p>To start, please login via the top right hand corner.</p>
    </Container>
  );
}
