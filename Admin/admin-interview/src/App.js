import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login/Login";
import Home from "./Component/Homepage/Home";
import Usermang from "./Component/UserManagement/Usermang";
import Content from "./Component/Content management/Content";
import Planner from "./Component/Planner management/Planner";
import Analytics from "./Component/Analytics/Analytics";

function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <Home /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/analytics" />} />
          <Route path="users" element={<Usermang />} />
          <Route path="content" element={<Content />} />
          <Route path="planner" element={<Planner />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
