import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Pages/Home";
import Dashboard from "./component/routingpages/Dashboard";
import Subjectmain from "./component/routingpages/Subjectmain";
import Progress from "./component/routingpages/Progress";
import InterviewRounds from "./component/routingpages/InterviewRounds";
import HRround from "./component/roundpage/HRround";
import TechnicalRound from "./component/roundpage/TechnicalRound";
import GroupDiscussion from "./component/roundpage/GroupDiscussion.JSX";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/footer/Footer";
import Login from "./component/Login";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjectmain />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/interview-rounds" element={<InterviewRounds />} />
       <Route path="/hr-round" element={<HRround />} />
        <Route path="/technical-round" element={<TechnicalRound />} />
        <Route path="/group-discussion" element={<GroupDiscussion />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;

