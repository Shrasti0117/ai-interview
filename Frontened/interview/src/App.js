import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/footer/Footer";
import Login from "./component/signuppage/Login";
import Home from "./component/Pages/Home";
import SubjectsPage from "./component/Pages/SubjectsPage";
import Dashboard from "./component/routingpages/Dashboard";
import ProgressPage from "./component/Pages/ProgressPage";
import InterviewRounds from "./component/routingpages/InterviewRounds";
import HRround from "./component/roundpage/HRround";
import TechnicalRoundPage from "./component/Pages/TechnicalRoundPage";
import AptitudeRound from "./component/APtitude/AptitudeRound";
import HrAptitudeTest from "./component/HrRoundpage/HrAptitudeTest";
import Privateroute from "./component/signuppage/Privateroute";
import TestPage from "./component/Pages/Test";
import Scrolltotop from "./component/Scrolltotop";
import Hrroundpage1 from "./component/HrRoundpage/Hrroundpage1";
import Hrroundpage2Backend from "./component/HrRoundpage/Hrroundpage2Backend";
import VoiceInterview from "./component/HrRoundpage/VoiceInterview";
import InterviewFeedback from "./component/HrRoundpage/InterviewFeedback";
import ProctoringWrapper from "./component/ProctoringWrapper";
import SecurityWrapper from "./component/SecurityWrapper";
import CompanyTracks from "./component/Pages/CompanyTracks";
import InterviewReady from "./component/Pages/InterviewReady";

const AppContent = () => {
  const location = useLocation();
  const hideGlobalNavbar = location.pathname === "/login" || location.pathname === "/progress" || location.pathname === "/subjects" || location.pathname === "/dashboard" || location.pathname === "/technical-round" || location.pathname === "/test" || location.pathname === "/aptitude" || location.pathname === "/hr-aptitude" || location.pathname === "/proctoring";

  const content = (
    <>
      {!hideGlobalNavbar && <Navbar />}
      <Scrolltotop/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/subjects"
          element={
            <Privateroute>
              <SubjectsPage />
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
              <ProgressPage />
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
          path="/interview-feedback"
          element={
            <Privateroute>
              <InterviewFeedback />
            </Privateroute>
          }
        />
        <Route
          path="/hr-aptitude"
          element={
            <Privateroute>
              <HrAptitudeTest />
            </Privateroute>
          }
        />
        <Route
          path="/technical-round"
          element={
            <Privateroute>
              <TechnicalRoundPage />
            </Privateroute>
          }
        />
        <Route
          path="/aptitude"
          element={
            <Privateroute>
              <AptitudeRound />
            </Privateroute>
          }
        />
        <Route
          path="/test"
          element={
            <Privateroute>
              <TestPage />
            </Privateroute>
          }
        />
        <Route
          path="/company-tracks"
          element={
            <Privateroute>
              <CompanyTracks />
            </Privateroute>
          }
        />
        <Route
          path="/interview-ready"
          element={
            <Privateroute>
              <InterviewReady />
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
              <SecurityWrapper>
                <Hrroundpage2Backend />
              </SecurityWrapper>
            </Privateroute>
          }
        />
        <Route
          path="/voice-interview"
          element={
            <Privateroute>
              <VoiceInterview />
            </Privateroute>
          }
        />
        <Route
          path="/proctoring"
          element={
            <Privateroute>
              <ProctoringWrapper />
            </Privateroute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      {!hideGlobalNavbar && <Footer />}
    </>
  );

  return content;
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;

