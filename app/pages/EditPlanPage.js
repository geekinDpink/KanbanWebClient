import React, { useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PlanDetailForm from "../components/PlanDetailForm";
import moment from "moment";

export default function EditPlanPage() {
  const appLocation = useLocation();
  const { App_Acronym: appAcronym, Plan_Name: planMVPName } = appLocation.state;

  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);
  const navigate = useNavigate();

  // Authentication, Authorisation (Admin) and Permit Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    const authUser = async (token) => {
      // Check valid user
      try {
        const res = await axios.get("http://localhost:8080/user/auth", {
          headers: { Authorization: `Basic ${token}` },
        });

        if (res.data.isAdmin) {
          redDispatch({ type: "isAdmin" });
        } else {
          redDispatch({ type: "notAdmin" });
        }

        // Check app permit
        try {
          const params = { App_Acronym: appAcronym };
          const resPermit = await axios.post(
            "http://localhost:8080/user/permits",
            params,
            {
              headers: { Authorization: `Basic ${token}` },
            }
          );
          resPermit.data.isCreate
            ? redDispatch({ type: "isCreate" })
            : redDispatch({ type: "notCreate" });

          resPermit.data.isOpen
            ? redDispatch({ type: "isOpen" })
            : redDispatch({ type: "notOpen" });

          resPermit.data.isTodolist
            ? redDispatch({ type: "isTodo" })
            : redDispatch({ type: "notTodo" });

          resPermit.data.isDoing
            ? redDispatch({ type: "isDoing" })
            : redDispatch({ type: "notDoing" });

          resPermit.data.isDone
            ? redDispatch({ type: "isDone" })
            : redDispatch({ type: "notDone" });

          resPermit.data.isPlan
            ? redDispatch({ type: "isPlan" })
            : redDispatch({ type: "notPlan" });

          resPermit.data.isApp
            ? redDispatch({ type: "isApp" })
            : redDispatch({ type: "notApp" });
        } catch (error) {
          toast("Unable to retrieve user permit");
          console.log(error);
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
            <h1>Edit Plan Page</h1>
          </Col>
          <Col xs sm md={2}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() =>
                  // Route to plan management page
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
          <PlanDetailForm
            appAcronym={appAcronym}
            planMVPName={planMVPName}
            mode="edit"
          />
        </Row>
      </Container>
    </>
  );
}
