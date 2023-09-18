import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import StateContext from "../../Context/StateContext";
import DispatchContext from "../../Context/DispatchContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  // const [showToast, setShowToast] = useState(false);
  // const [toastMsg, setToastMsg] = useState("");

  const redState = useContext(StateContext);
  const redDispatch = useContext(DispatchContext);

  // Login: Correct - get token and store to local storage and Wrong - snack bar
  const submitLoginHandler = async (event) => {
    event.preventDefault(); // prevent form from resetting on submit
    console.log(redState);
    if (event.target[0].value && event.target[1].value) {
      try {
        const res = await axios.post("http://localhost:8080/login", {
          username: event.target[0].value,
          password: event.target[1].value,
        });
        if (res.data.token) {
          // console.log("token", res.data);
          await localStorage.setItem("token", res.data.token);
          // setIsLoggedIn(true);
          redDispatch({ type: "login" });
          if (res.data.isAdmin) {
            redDispatch({ type: "isAdmin" });
          }
        } else {
          toast("Unable to login" + res.data.remarks);
          // setToastMsg(res.data.remarks);
          //setShowToast(true);

          // console.log("no token", res.data);
        }
      } catch (err) {
        console.log(err);
        // setToastMsg(err.response?.data?.remarks ?? "");
        //setShowToast(true);
        toast("Unable to login" + err.response?.data?.remarks ?? "");
      }
    } else {
      toast("Incomplete/empty fields");
      // setToastMsg("Incomplete/empty fields");
      //setShowToast(true);
    }
  };

  // Logout: delete token from local storage
  const submitLogoutHandler = (event) => {
    event.preventDefault(); // prevent form from resetting on submit
    localStorage.removeItem("token");
    // setIsLoggedIn(false);
    redDispatch({ type: "logout" });
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to="./" className="nav-link">
            TMS
          </Link>
        </Navbar.Brand>

        {/* <Toast
            style={{
              position: "absolute",
              top: "5%",
              left: "30%",
              zIndex: "999!important",
              width: "200px",
              height: "80px",
            }}
            delay={2000}
            autohide
            onClose={() => setShowToast(false)}
            show={showToast}
          >
            <Toast.Header
              style={{
                backgroundColor: "pink",
                color: "black",
                fontSize: "11px",
              }}
            >
              Error: Unable to Login
            </Toast.Header>
            <Toast.Body
              style={{
                backgroundColor: "pink",
                color: "black",
                fontSize: "11px",
              }}
            >
              Reason: {toastMsg}
            </Toast.Body>
          </Toast> */}
        {
          //not logged in
          !redState.isLoggedIn ? (
            /* Container fluid for justify to work*/
            <Nav className="container-fluid justify-content-end">
              <Form
                className="d-flex" // fields to be on the same row
                onSubmit={(event) => submitLoginHandler(event)}
              >
                <Form.Control
                  type="search"
                  id="username"
                  placeholder="Username"
                  className="me-2"
                  aria-label="username"
                />
                <Form.Control
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="me-2"
                  aria-label="password"
                />
                <Button variant="success" type="submit">
                  Login
                </Button>
              </Form>
            </Nav>
          ) : (
            <Nav className="container-fluid me-auto">
              {redState.isAdmin && (
                <Link to="./user_management" className="nav-link">
                  Manage User
                </Link>
              )}
              <Link to="./kanban_board" className="nav-link">
                Kanban Board
              </Link>
              <div className="position-absolute top-0 end-0 offsetPos">
                <Form
                  className="d-flex"
                  onSubmit={(event) => submitLogoutHandler(event)}
                >
                  <Link to="./my_profile" className="nav-link">
                    My Profile
                  </Link>
                  <Button variant="secondary" type="submit">
                    Logout
                  </Button>
                </Form>
              </div>
            </Nav>
          )
        }
      </Container>
    </Navbar>
  );
}
