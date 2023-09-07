import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import UserManagement from "./components/UserManagement";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user_management" element={<UserManagement />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
