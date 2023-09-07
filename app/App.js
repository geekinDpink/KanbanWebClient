import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import UserManagement from "./components/UserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user_management" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
