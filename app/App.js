import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagementPage from "./pages/UserManagementPage";
import HomePage from "./pages/HomePage";
import KanbanBoard from "./components/KanbanBoard";
import CreateUserPage from "./pages/CreateUserPage";
import MyProfilePage from "./pages/MyProfilePage";
import EditUserPage from "./pages/EditUserPage";
import DispatchContext from "../Context/DispatchContext";
import StateContext from "../Context/StateContext";
import { useImmerReducer } from "use-immer";

// import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   Boolean(localStorage.getItem("token"))
  // );
  // const [isAdmin, setIsAdmin] = useState(false);

  const initialState = {
    isLoggedIn: false,
    isAdmin: false,
    count: 1,
  };

  function myReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.isLoggedIn = true;
        break; // either return or break
      case "logout":
        draft.isLoggedIn = false;
        draft.isAdmin = false;
        break;
      case "isAdmin":
        draft.isAdmin = true;
        break;
      case "notAdmin":
        draft.isAdmin = false;
        break;
      case "up":
        draft.count++;
        break;
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
          <Container style={{ marginTop: "20px" }}>
            <Routes>
              <Route
                path="/"
                element={
                  state.isLoggedIn ? (
                    state.isAdmin ? (
                      <UserManagementPage />
                    ) : (
                      <KanbanBoard />
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
                path="/kanban_board"
                element={
                  state.isLoggedIn ? <KanbanBoard /> : <Navigate to="/" />
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
                path="/my_profile"
                element={
                  state.isLoggedIn ? <MyProfilePage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/edit_user"
                element={
                  state.isLoggedIn ? <EditUserPage /> : <Navigate to="/" />
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
