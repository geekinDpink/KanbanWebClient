import React, { useContext, useEffect } from "react";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
import axios from "axios";

export default function KanbanBoardPage() {
  const redDispatch = useContext(DispatchContext);
  const redState = useContext(StateContext);

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

  // Authentication Check
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     // Get my user detail based on username in token
  //     axios
  //       .get("http://localhost:8080/user", {
  //         headers: { Authorization: `Basic ${token}` },
  //       })
  //       .then((res) => {
  //         console.log("getUserProfile res", res.data);
  //         // setUser(res.data[0]);
  //         if (res) {
  //           console.log("Kanban Before Disp logout", redState);
  //           redDispatch({ type: "login" });
  //           console.log("Kanban Before Disp logout", redState);
  //         }
  //       })
  //       .catch((err) => {
  //         // api call is validation process e.g. token, if fail refuse entry and logout
  //         console.log(err);
  //         console.log("CreateUser Before Disp logout", redState);
  //         redDispatch({ type: "logout" });
  //         console.log("CreateUser After Disp logout", redState);
  //       });
  //   } else {
  //     redDispatch({ type: "logout" });
  //   }
  // }, []);

  return (
    <>
      <h1>KanbanBoard</h1>
      <p>WIP</p>
    </>
  );
}
