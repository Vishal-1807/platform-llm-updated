import { LinearProgress } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginRes = ({ token, updateToken }) => {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const getAccessToken = async (code) => {
    const res = await fetch(`https://cibi.ai/cibi/tabular-dev/auth/getToken`, {
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

    console.log("accesstoken result", result);

    if (Object.keys(result).length !== 0) {
      setCount(count + 1);
      console.log(result);
      updateToken(result.id_token);
      //   const username = result.id_token_claims.name.trim();
      //   const email = result.id_token_claims.preferred_username.trim();
      //   sessionStorage.setItem("username", username.trim());
      //   sessionStorage.setItem("email", email.trim());
      sessionStorage.setItem("refresh_token", result.refresh_token);
      sessionStorage.setItem("id_token", result.id_token);
      sessionStorage.setItem("access_token", result.access_token);

      navigate("/Dashboard");
    }
  };
  useMemo(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code && count < 1) {
      // console.log("Code:", code);
      getAccessToken(code);
    }
  }, [location.search]);

  return (
    <>
      <LinearProgress />
    </>
  );
};
export default React.memo(LoginRes);
