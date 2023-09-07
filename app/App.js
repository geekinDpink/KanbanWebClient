import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";

import Login from "./components/Login";
import Footer from "./components/Footer";
import UserManagement from "./components/UserManagement";
import UserDetailForm from "./components/UserDetailForm";
// import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<UserDetailForm />} />
          <Route path="/user_management" element={<UserManagement />} />
        </Routes>
      </Container>

      <Footer />
    </BrowserRouter>
  );
}
