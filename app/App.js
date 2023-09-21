import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagementPage from "./pages/UserManagementPage";
import HomePage from "./pages/HomePage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import CreateUserPage from "./pages/CreateUserPage";
import MyProfilePage from "./pages/MyProfilePage";
import EditUserPage from "./pages/EditUserPage";
import DispatchContext from "../Context/DispatchContext";
import StateContext from "../Context/StateContext";
import { useImmerReducer } from "use-immer";
import { ToastContainer, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   Boolean(localStorage.getItem("token"))
  // );
  // const [isAdmin, setIsAdmin] = useState(false);

  const initialState = {
    isLoggedIn: false,
    isAdmin: false,
  };

  function myReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.isLoggedIn = true;
        return; // either return or break
      case "logout":
        // revert state to false and remove token
        draft.isLoggedIn = false;
        draft.isAdmin = false;
        localStorage.removeItem("token");
        return;
      case "isAdmin":
        draft.isAdmin = true;
        return;
      case "notAdmin":
        draft.isAdmin = false;
        return;
      default:
        return draft;
    }
  }

  // const [state, dispatch] = useReducer(myReducer, initialState);
  const [state, dispatch] = useImmerReducer(myReducer, initialState);
  console.log("state", state);

  ////////////////////////
  // Without login, route to HomePage
  // After login, if Admin go usermanagement page, else is to kanban board
  // Admin can access create user page
  ///////////////////////
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <ToastContainer
            transition={Slide}
            hideProgressBar
            position="top-center"
          />
          <Container
            style={{
              marginTop: "20px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {state.isLoggedIn ? (
              <Routes>
                <Route
                  path="/"
                  element={
                    state.isAdmin ? <UserManagementPage /> : <KanbanBoardPage />
                  }
                />
                <Route
                  path="/user_management"
                  element={<UserManagementPage />}
                />
                <Route path="/kanban_board" element={<KanbanBoardPage />} />
                <Route path="/create_user" element={<CreateUserPage />} />
                <Route path="/my_profile" element={<MyProfilePage />} />
                <Route path="/edit_user" element={<EditUserPage />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            )}
          </Container>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
