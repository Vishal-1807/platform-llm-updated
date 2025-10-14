import { LinearProgress } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginRes = ({ token, updateToken }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getAccessToken = async (code) => {
    console.log("🔵 Getting access token with code:", code);
    
    try {
      const res = await fetch(`https://awone-api.axiomio.com/tabular/auth/getToken`, {
        method: "POST",
        body: JSON.stringify({
          code: code,
          session_token: sessionStorage.getItem("session_token"),
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      
      const result = await res.json();
      console.log("🔵 Token response:", result);
      
      if (result.access_token && Object.keys(result).length !== 0) {
        setCount(count + 1);
        
        // Store tokens first
        console.log("✅ Storing tokens...");
        sessionStorage.setItem("refresh_token", result.refresh_token);
        sessionStorage.setItem("id_token", result.id_token);
        sessionStorage.setItem("access_token", result.access_token);
        sessionStorage.setItem("token", result.access_token); // For backward compatibility
        
        console.log("✅ Tokens stored, updating app state...");
        // Update app state
        updateToken(result.access_token);
        
        // Small delay to ensure state updates
        setTimeout(() => {
          console.log("✅ Navigating to Dashboard...");
          navigate("/Dashboard", { replace: true });
        }, 100);
      } else {
        console.error("❌ Invalid token response:", result);
        alert("Login failed. Please try again.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("❌ Error getting token:", error);
      alert("Login failed. Please try again.");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    
    if (code && count < 1) {
      console.log("🔵 Authorization code found:", code);
      getAccessToken(code);
    } else if (!code) {
      console.log("❌ No authorization code found");
      navigate("/login", { replace: true });
    }
  }, [location.search]);

  return (
    <>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <LinearProgress />
        <p style={{ marginTop: "20px" }}>Completing login...</p>
      </div>
    </>
  );
};

export default React.memo(LoginRes);
