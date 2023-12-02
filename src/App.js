import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>Hi</>} />
        <Route path="/login" element={<>Please Log In</>} />
        <Route path="/" element={<>Please Sign Up</>} />
      </Routes>
    </Router>
  );
}

export default App;
