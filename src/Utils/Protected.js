import React from "react";
import { Redirect } from "react-router-dom";
import isAuthenticated from "./isAuthenticated";

const Protected = ({ children }) => {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default Protected;
