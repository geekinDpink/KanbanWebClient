import React, { useState } from "react";import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagementPage from "./pages/UserManagementPage";
import HomePage from "./pages/HomePage";
import AppManagementPage from "./pages/AppManagementPage";
import PlanManagementPage from "./pages/PlanManagementPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import MyProfilePage from "./pages/MyProfilePage";
import CreateUserPage from "./pages/CreateUserPage";
import EditUserPage from "./pages/EditUserPage";
import CreateAppPage from "./pages/CreateAppPage";
import EditAppPage from "./pages/EditAppPage";
import ViewAppPage from "./pages/ViewAppPage";
import EditPlanPage from "./pages/EditPlanPage";
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
    isCreate: false,
    isOpen: false,
    isTodolist: false,
    isDoing: false,
    isDone: false,
    isPlan: false,
    isApp: false,
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
      case "isCreate":
        draft.isCreate = true;
        return;
      case "notCreate":
        draft.isCreate = false;
        return;
      case "isOpen":
        draft.isOpen = true;
        return;
      case "notOpen":
        draft.isOpen = false;
        return;
      case "isTodo":
        draft.isTodolist = true;
        return;
      case "notTodo":
        draft.isTodolist = false;
        return;
      case "isDoing":
        draft.isDoing = true;
        return;
      case "notDoing":
        draft.isDoing = false;
        return;
      case "isDone":
        draft.isDone = true;
        return;
      case "notDone":
        draft.isDone = false;
        return;
      case "isPlan":
        draft.isPlan = true;
        return;
      case "notPlan":
        draft.isPlan = false;
        return;
      case "isApp":
        draft.isApp = true;
        return;
      case "notApp":
        draft.isApp = false;
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
              <Route
                path="/edit_app"
                element={
                  state.isLoggedIn ? <EditAppPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/view_app"
                element={
                  state.isLoggedIn ? <ViewAppPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/plan_management"
                element={
                  state.isLoggedIn && state.isPlan ? (
                    <PlanManagementPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/edit_plan"
                element={
                  state.isLoggedIn && state.isPlan ? (
                    <EditPlanPage />
                  ) : (
                    <Navigate to="/" />
                  )
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
