import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import BrewerySearch from "./Pages/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrewerySearch/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
