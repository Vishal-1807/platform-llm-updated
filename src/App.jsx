import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("access_token"));
  const location = useLocation();

  // Function to log all session storage key-value pairs
  const logSessionStorage = () => {
    console.log("=== SESSION STORAGE CONTENTS ===");
    console.log("Number of items:", sessionStorage.length);
 
    if (sessionStorage.length === 0) {
      console.log("Session storage is empty");
      return;
    }
 
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      console.log(`${key}:`, value);
    }
 
    const allKeys = Object.keys(sessionStorage);
    console.log("All keys:", allKeys);
 
    const allData = {};
    allKeys.forEach(key => {
      allData[key] = sessionStorage.getItem(key);
    });
    console.log("All session storage data:", allData);
    console.log("=== END SESSION STORAGE ===");
  };
 
  useEffect(() => {
    logSessionStorage();
  }, [token]);

  const updateToken = (value) => {
    console.log("🔵 updateToken called with:", value);
    sessionStorage.setItem("access_token", value);
    sessionStorage.setItem("token", value);
    setToken(value);
    console.log("✅ Token state updated");
  };

  const logout = () => {
    console.log("🔴 Logout called");
    updateToken(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("access_token");
    const isAuth = accessToken && accessToken !== "null" && accessToken !== "";
    console.log("🔍 isAuthenticated check:", isAuth, "token:", accessToken);
    return isAuth;
  };

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/callback', '/logout'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  console.log("🔵 Current route:", location.pathname, "isPublic:", isPublicRoute, "isAuth:", isAuthenticated());

  return (
    <LLMTabProvider>
      <div className="ta-layout">
        {/* Only show sidebar/header if authenticated AND not on public routes */}
        {!isPublicRoute && isAuthenticated() && <SideBar />}
        <div className="ta-main-wrapper">
          {!isPublicRoute && isAuthenticated() && <Header />}
          <div className="ta-main-content">
            <Routes>
              {isAuthenticated() ? (
                <Route path="/" element={<Dashboard />} />
              ) : (
                <Route path="/" element={<Login updateToken={updateToken} />} />
              )}
              
              <Route
                path="/llm/:projectId/Experiment/:experimentId/*"
                element={<LLMExperiment />}
              />

              <Route path="/cv" element={<div>CV</div>} />
              <Route path="/nlp" element={<div>NLP</div>} />
              <Route path="/llm" element={<LLM />} />
              <Route path="/llm/:projectId" element={<LLMProject />} />
              <Route path="/logout" element={<Logout logout={logout} />} />
              <Route
                path="/login"
                element={<Login updateToken={updateToken} />}
              />
              {/* Callback route - no auth check */}
              <Route
                path="/callback"
                element={<LoginRes token={token} updateToken={updateToken} />}
              />
              <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </LLMTabProvider>
  );
}

export default App;
