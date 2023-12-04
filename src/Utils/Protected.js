import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "./isAuthenticated";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Asynchronously check if the user is authenticated
    async function check() {
      if (!isAuthenticated()) {
        navigate("/login");
      }
    }
    check();
  }, [navigate]);

  return children;
};

export default Protected;
