import { Box, Checkbox, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EyeIcon from "../../assets/icons/eye.svg?react";
import TickSquareIcon from "../../assets/icons/ticksquare.svg?react";
import TickSquareCheckedIcon from "../../assets/icons/ticksquarechecked.svg?react";
import aubrantLogo from "../../assets/aubrantLogo.png";
import Microsoft from "../../assets/LoginImages/Microsoft.png";
import "./Login.css";

export default function Login({ updateToken }) {
  const [passwordshow, setshowpassword] = useState(true);
  const eyeopen = () => {
    setshowpassword(false);
  };
  const eyeclose = () => {
    setshowpassword(true);
  };
  const [email, setemail] = useState();

  const [password, setpassword] = useState();
  const [validate, setvalidate] = useState(false);
  const [errormessage, seterrormessage] = useState();
  const [successmessage, setsuccessmessage] = useState();
  const navigate = useNavigate();
  const login = async () => {
    seterrormessage();
    setsuccessmessage();
    if (email === undefined || password === undefined) {
      setvalidate(true);
      seterrormessage("Email and password required");
      return;
    } else {
      setvalidate(false);
    }

    sessionStorage.setItem("email", email.replace("@cibi.com", ""));
    let formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const Loginurl = await axios.post(
        `https://awone-api.axiomio.com/login`,
        formData,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data;",
          },
        }
      );

      if (Loginurl.status === 200) {
        updateToken(Loginurl.data.access_token);
        navigate("/tabular");
      }
    } catch (err) {
      console.log("err", err);
      seterrormessage(err.message);
    }
  };

  const MicrosoftLogin = async () => {
    try {
      const response = await fetch(
        `https://awone-api.axiomio.com/tabular/auth/login?organisation=awone`
      );
      const result = await response.json();
      console.log("result", result);

      sessionStorage.setItem("session_token", result.session_token);
      window.location.href = result.url;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      margin: 0,
      padding: 0,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "50%",
        height: "100%",
        backgroundColor: "#000000",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "white",
            padding: "20px",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          <img
            src={aubrantLogo}
            alt="Aubrant Digital"
            style={{
              width: "400px",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto"
            }}
          />
          {/* <Typography
            variant="h6"
            sx={{
              color: "#1E90FF",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "18px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Creating Digital Businesses
          </Typography> */}
        </Box>
      </div>

      {/* Vertical separation line in the exact middle */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "20px",
        bottom: "20px",
        width: "2px",
        background: "linear-gradient(to bottom, #1E90FF, #FF6B35)",
        transform: "translateX(-50%)",
        zIndex: 10,
        boxShadow: "0 0 10px rgba(30, 144, 255, 0.3)"
      }}></div>

      <div style={{
        width: "50%",
        height: "100%",
        backgroundColor: "white",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>
        <Box className="Login-right">
          <Box className="welcome-box">
            <center>
              <p className="welcome">
                <b>Welcome back</b>
              </p>
              <span className="credentials">Please enter your credentials</span>
            </center>
          </Box>
          <Box className="loginform-box">
            <Typography>
              <small>Email ID*</small>
            </Typography>
            <input
              className="Login-input"
              placeholder="name@workmail.com"
              onChange={(e) => setemail(e.target.value)}
            />
          </Box>
          <Box className="loginform-box">
            <Typography>
              <small>Password*</small>
            </Typography>
            <input
              type={passwordshow ? "password" : "text"}
              className="Login-input"
              placeholder="Password"
              onChange={(e) => setpassword(e.target.value)}
            />
            <EyeIcon
              className="eyeicon"
              style={
                passwordshow
                  ? { color: "#B7B7D2", fill: "white" }
                  : { color: "white", fill: "#B7B7D2" }
              }
              onClick={() => setshowpassword(!passwordshow)}
            />
            {/* {passwordshow ? (
              <img className="eyeicon" src={eyeicon} onClick={eyeopen}></img>
            ) : (
              <RemoveRedEyeIcon className="eyeicon" onClick={eyeclose} />
            )} */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#1F1F29",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  sx={{ padding: "2px" }}
                  icon={
                    <TickSquareIcon style={{ height: "24px", width: "24px" }} />
                  }
                  checkedIcon={
                    <TickSquareCheckedIcon
                      style={{
                        height: "24px",
                        width: "24px",
                        color: "#5420E8",
                      }}
                    />
                  }
                  // value={obj}
                  // checked={predictOptions[obj] && predictOptions[obj]===true}
                  // onChange={handleChangePredict}
                />
                <span>Remember for 30 days</span>
              </div>
              <div
                style={{ color: "#5420E8", fontSize: "14px", textAlign: "end" }}
              >
                <span>Forgot Password?</span>
              </div>
            </div>
          </Box>
          <Box className="loginform-box">
            <button
              className="gradient-background"
              style={{ width: "100%" }}
              onClick={login}
            >
              Login
            </button>
            <Box sx={{ mt: 1, marginTop: "32px" }}>
              <center>
                <span className="donthaveaccount">
                  Don't have an account ?{" "}
                </span>
                <span className="signup">Sign up</span>
              </center>
            </Box>
          </Box>
          <Box className="loginform-box">
            <img
              style={{ width: "100%", margin: "22px 0", cursor: "pointer" }}
              onClick={MicrosoftLogin}
              src={Microsoft}
              alt="cibi"
            ></img>
          </Box>
          {errormessage && (
            <center>
              <span style={{ color: "red" }}>
                <Alert severity="error">{errormessage}</Alert>
              </span>
            </center>
          )}
        </Box>
      </div>
    </div>
  );
}
