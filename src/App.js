import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUpPage/SignUpPage";
import BrewerySearch from "./Pages/Home/Home";
import BreweryDetails from "./Components/BreweryDetails/BreweryDetails";
import Protected from "./Utils/Protected";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/brewerysearch" element={<BreweryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
