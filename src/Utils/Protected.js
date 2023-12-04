import React from "react";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "./isAuthenticated";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    navigate("/login");
    return null;
  }

  return <>{children}</>;
};

export default Protected;