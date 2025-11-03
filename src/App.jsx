import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/liquidGlass.css";

import { Dashboard } from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import LLM, { LLMTabProvider } from "./components/LLM/LLM";
import LLMExperiment from "./components/LLM/LLMExperiment/LLMExperiment";
import { default as LLMProject } from "./components/LLM/Project/Project";
import Login from "./components/Login/Login";
import LoginRes from "./components/Login/LoginRes";
import { Logout } from "./components/Logout/Logout";
import SideBar from "./components/SideBar/SideBar";
import Experiment from "./components/Tabular/Experiment/Experiment";
import Project from "./components/Tabular/Project/Project";
import Tabular from "./components/Tabular/Tabular";

function App() {
  // CHANGED: Use "access_token" instead of "token"
  const [token, setToken] = useState(sessionStorage.getItem("access_token"));

  // Function to log all session storage key-value pairs
  const logSessionStorage = () => {
    console.log("=== SESSION STORAGE CONTENTS ===");
    console.log("Number of items:", sessionStorage.length);
 
    if (sessionStorage.length === 0) {
      console.log("Session storage is empty");
      return;
    }
 
    // Log all key-value pairs
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      console.log(`${key}:`, value);
    }
 
    // Alternative method - get all keys and values
    const allKeys = Object.keys(sessionStorage);
    console.log("All keys:", allKeys);
 
    const allData = {};
    allKeys.forEach(key => {
      allData[key] = sessionStorage.getItem(key);
    });
    console.log("All session storage data:", allData);
    console.log("=== END SESSION STORAGE ===");
  };
 
  // Log session storage on component mount and when token changes
  useEffect(() => {
    logSessionStorage();
  }, [token]);

  const updateToken = (value) => {
    // CHANGED: Store as "access_token" to match Microsoft auth
    sessionStorage.setItem("access_token", value);
    // Also keep "token" for backward compatibility if needed
    sessionStorage.setItem("token", value);
    setToken(value);
    console.log(value, "Token");
  };

  const logout = () => {
    updateToken(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("access_token");
    return accessToken && accessToken !== "null" && accessToken !== "";
  };

  return (
    <LLMTabProvider>
      <div className="ta-layout">
        {/* CHANGED: Use isAuthenticated() helper */}
        {isAuthenticated() && <SideBar />}
        <div className="ta-main-wrapper">
          {isAuthenticated() && <Header />}
          <div className="ta-main-content">
            <Routes>
              {/* Authentication-based routing */}
              {isAuthenticated() ? (
                <>
                  {/* Protected routes - only accessible when authenticated */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/tabular" element={<Tabular />} />
                  <Route path="/tabular/:projectId" element={<Project />} />
                  <Route
                    path="/tabular/:projectId/Experiment/:experimentId/*"
                    element={<Experiment />}
                  />
                  <Route path="/cv" element={<div>CV</div>} />
                  <Route path="/nlp" element={<div>NLP</div>} />
                  <Route path="/llm" element={<LLM />} />
                  <Route path="/llm/:projectId" element={<LLMProject />} />
                  <Route
                    path="/llm/:projectId/Experiment/:experimentId/*"
                    element={<LLMExperiment />}
                  />
                  <Route path="/logout" element={<Logout logout={logout} />} />
                </>
              ) : (
                <>
                  {/* Public routes - only accessible when not authenticated */}
                  <Route path="/" element={<Login updateToken={updateToken} />} />
                  <Route
                    path="/login"
                    element={<Login updateToken={updateToken} />}
                  />
                  <Route
                    path="/callback"
                    element={<LoginRes token={token} updateToken={updateToken} />}
                  />
                  {/* Redirect any other route to login when not authenticated */}
                  <Route path="*" element={<Login updateToken={updateToken} />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </LLMTabProvider>
  );
}

export default App;
