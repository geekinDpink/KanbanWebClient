import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagement from "./components/UserManagement";
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
  const [isAdmin, setIsAdmin] = useState(false);

  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("token")),
    // isAdmin: false,
  };

  console.log(initialState);
  function myReducer(state, action) {
    switch (action.type) {
      case "login":
        state.isLoggedIn = true;
        return; // either return or break
      case "logout":
        state.isLoggedIn = false;
        return;
      default:
        return state;
    }
  }

  // const [state, dispatch] = useReducer(myReducer, initialState);
  const [state, dispatch] = useImmerReducer(myReducer, initialState);

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
                    isAdmin ? (
                      <UserManagement />
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
                  state.isLoggedIn ? <UserManagement /> : <Navigate to="/" />
                }
              />
              <Route
                path="/create_user"
                element={
                  state.isLoggedIn ? <CreateUserPage /> : <Navigate to="/" />
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
