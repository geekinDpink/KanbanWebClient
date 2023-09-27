import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagementPage from "./pages/UserManagementPage";
import HomePage from "./pages/HomePage";
import AppManagementPage from "./pages/AppManagementPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import MyProfilePage from "./pages/MyProfilePage";
import CreateUserPage from "./pages/CreateUserPage";
import EditUserPage from "./pages/EditUserPage";
import CreateAppPage from "./pages/CreateAppPage";
import DispatchContext from "../Context/DispatchContext";
import StateContext from "../Context/StateContext";
import { useImmerReducer } from "use-immer";
import { ToastContainer, Slide } from "react-toastify";
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
            autoClose={1500}
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
            <Routes>
              <Route
                path="/"
                element={
                  state.isLoggedIn ? (
                    state.isAdmin ? (
                      <UserManagementPage />
                    ) : (
                      <AppManagementPage />
                    )
                  ) : (
                    <HomePage />
                  )
                }
              />
              <Route
                path="/user_management"
                element={
                  state.isLoggedIn && state.isAdmin ? (
                    <UserManagementPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/app_management"
                element={
                  state.isLoggedIn ? <AppManagementPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/kanban_board"
                element={
                  state.isLoggedIn ? <KanbanBoardPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/my_profile"
                element={
                  state.isLoggedIn ? <MyProfilePage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/create_user"
                element={
                  state.isLoggedIn && state.isAdmin ? (
                    <CreateUserPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/edit_user"
                element={
                  state.isLoggedIn ? <EditUserPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/create_app"
                element={
                  state.isLoggedIn ? <CreateAppPage /> : <Navigate to="/" />
                }
              />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
