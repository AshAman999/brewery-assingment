import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BrewerySearch from "./Pages/Home/Home";
import BreweryDetails from "./Components/BreweryDetails/BreweryDetails";
import Protected from "./Utils/Protected";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <BrewerySearch />
            </Protected>
          }
        />
        <Route
          path="/brewerysearch"
          element={
            <Protected>
              <BreweryDetails />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
