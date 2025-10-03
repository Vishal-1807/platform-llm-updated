import { Box, Checkbox, Grid, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CibiSmallIcon from "../../assets/icons/cibismall.svg?react";
import EyeIcon from "../../assets/icons/eye.svg?react";
import TickSquareIcon from "../../assets/icons/ticksquare.svg?react";
import TickSquareCheckedIcon from "../../assets/icons/ticksquarechecked.svg?react";
import Loginbg from "../../assets/LoginImages/loginBG.svg";
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
        `https://cibi.ai/cibi/tabular/login`,
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
        `https://cibi.ai/cibi/tabular-dev/auth/login?organisation=awone`
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
    <Grid container>
      <Grid item xs={6} className="Login-left">
        <Box
          sx={{
            width: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "-webkit-fill-available",
            margin: "0 auto",
          }}
        >
          <img src={Loginbg} style={{ width: "32vw" }}></img>
        </Box>
      </Grid>
      <Grid item xs={6} style={{ background: "white" }}>
        <Box className="Login-right">
          <Box className="welcome-box">
            <center>
              <div
                style={{
                  width: "62px",
                  height: "62px",
                  background: "#F6F6FF",
                  borderRadius: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CibiSmallIcon style={{ width: "32px", height: "32px" }} />
              </div>
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
      </Grid>
    </Grid>
  );
}
