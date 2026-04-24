import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/footer/Footer";
import Login from "./component/signuppage/Login";
import Home from "./component/Pages/Home";
import Subjectmain from "./component/routingpages/Subjectmain";
import Dashboard from "./component/routingpages/Dashboard";
import Progress from "./component/routingpages/Progress";
import InterviewRounds from "./component/routingpages/InterviewRounds";
import HRround from "./component/roundpage/HRround";
import TechnicalRound from "./component/roundpage/TechnicalRound";
import Aptitude1 from "./component/APtitude/Aptitude1";
import Aptitudeee from "./component/APtitude/Aptitudeee";
import Privateroute from "./component/signuppage/Privateroute";
import Report from "./component/APtitude/Report";
import Scrolltotop from "./component/Scrolltotop";
import Hrroundpage1 from "./component/HrRoundpage/Hrroundpage1";
import Hrroundpage2Backend from "./component/HrRoundpage/Hrroundpage2Backend";
import InterviewFeedback from "./component/HrRoundpage/InterviewFeedback";


const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
    <Scrolltotop/>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <Privateroute>
              <Home />
            </Privateroute>
          }
        />

        <Route
          path="/subjects"
          element={
            <Privateroute>
              <Subjectmain />
            </Privateroute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Privateroute>
              <Dashboard />
            </Privateroute>
          }
        />

        <Route
          path="/progress"
          element={
            <Privateroute>
              <Progress />
            </Privateroute>
          }
        />

        <Route
          path="/interview-rounds"
          element={
            <Privateroute>
              <InterviewRounds />
            </Privateroute>
          }
        />


        <Route
          path="/hr-round"
          element={
            <Privateroute>
              <HRround />
            </Privateroute>
          }
        />
        <Route
        path="/hr-round-1"
          element={
            <Privateroute>
              <Hrroundpage1 />
            </Privateroute>
          }
        />
        <Route
        path="/hr-round-2"
        element={
          <Privateroute>
            <Hrroundpage2Backend />
          </Privateroute>
        }
        />

        <Route
        path="/interview-feedback"
        element={
          <Privateroute>
            <InterviewFeedback />
          </Privateroute>
        }
        />


        <Route
          path="/technical-round"
          element={
            <Privateroute>
              <TechnicalRound />
            </Privateroute>
          }
        />

        <Route
          path="/aptitude"
          element={
            <Privateroute>
              <Aptitude1 />
            </Privateroute>
          }
        />

        <Route
          path="/aptitude2"
          element={
            <Privateroute>
              <Aptitudeee />
            </Privateroute>
          }
        />
        <Route path="/report" element={<Privateroute><Report /></Privateroute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {!isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
