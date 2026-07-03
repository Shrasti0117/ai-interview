import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Component/Homepage/Home";
import Usermang from "./Component/UserManagement/Usermang";
import Content from "./Component/Content management/Content";
import Planner from "./Component/Planner management/Planner";
import Analytics from "./Component/Analytics/Analytics";


const App = () => {
  return (
    <Router>
      <div>
        <Home />

        <div>
          <Routes>
            <Route path="/users" element={<Usermang />} />
            <Route path="/content" element={<Content />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Usermang />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
