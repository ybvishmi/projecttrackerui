import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MilestonesPage from "./pages/MilestonesPage";
import DocumentsPage from "./pages/DocumentsPage";
import { AuthProvider } from "./context/AuthContext";
import React from "react";

function App() {
  return (
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
