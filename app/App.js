import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Footer from "./components/Footer";
import UserManagement from "./components/UserManagement";
import UserDetailForm from "./components/UserDetailForm";
import Home from "./components/Home";
import KanbanBoard from "./components/KanbanBoard";
import CreateUserPage from "./components/CreateUserPage";

// import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Container style={{ marginTop: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <UserManagement />
                ) : (
                  <KanbanBoard />
                )
              ) : (
                <Home />
              )
            }
          />
          <Route path="/user_management" element={<UserManagement />} />
          <Route path="/create_user" element={<CreateUserPage />} />
        </Routes>
      </Container>

      <Footer />
    </BrowserRouter>
  );
}
