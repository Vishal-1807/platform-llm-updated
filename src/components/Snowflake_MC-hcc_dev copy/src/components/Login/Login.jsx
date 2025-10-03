import { AccountCircle } from "@mui/icons-material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import penguinlogo from "../../assets/LoginImages/penguin.svg";
import Penguinai from "../../assets/Penguinai.png";
import apiService from "../../services/apiService";

function Login({ onLogin, showNotification }) {
  const [successSnackbar, setSuccessSnackbar] = useState({
    open: false,
    message: "",
  });
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: "",
  });

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Form validation functions
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    // if (password.length < 6) {
    //   return "Password must be at least 6 characters";
    // }
    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Automate Repetitive Administrative Tasks",
      description:
        "Free your team from hours of data entry, intake, prior auth, and documentation review. PenguinAI automates it all - so your clinicians and ops teams can focus on people, not paperwork.",
    },
    {
      title: "Boost Operational Efficiency",
      description:
        "Deploy AI to handle 24/7 workload spikes, reduce delays, and maintain SLAs—without needing to scale your headcount linearly.",
    },
    {
      title: "Reduce Human Error",
      description:
        "Minimize costly errors in billing, intake, and approvals through AI precision and validation logic tailored for healthcare compliance.",
    },
    {
      title: "Augment Your Team with Digital Workers",
      description:
        "Let AI handle the grunt work - Penguin's digital workers run background tasks, triage data, and follow up autonomously, while your humans focus on strategic care.",
    },
    {
      title: "Scale for Future Growth",
      description:
        "PenguinAI is built for scale - modular, API-first, and system-agnostic. Onboard new processes or clinics without friction",
    },
    {
      title: "Unlock New Insights from Data",
      description:
        "Tap into structured intelligence from your unstructured documents. PenguinAI converts charts, PDFs, and messages into actionable insights in seconds.",
    },
  ];

  const BasicAuthLogin = () => {
    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      setErrors({
        password: passwordError,
      });
      return;
    }

    // Call the actual login with form data
    GoogleLogin(formData.email, formData.password);
  };

  const GoogleLogin = async (email, password) => {
    if (!email || !password) {
      return;
    }

    try {
      // Use the new API service login method
      const response = await apiService.login(email, password);

      // Store the token
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("token_type", response.token_type);

      // Decode user data from JWT if needed
      const Userdata = response.access_token
        ? jwtDecode(response.access_token || "")
        : {};

      localStorage.setItem("Userdata", JSON.stringify(Userdata));
      localStorage.setItem("username", Userdata.username);

      if (showNotification) {
        showNotification("Login successful! Welcome back.", "success");
      }

      // Call the onLogin callback with the username
      onLogin(email);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.message || "Incorrect username or password";
      if (showNotification) {
        showNotification(errorMsg, "error");
      }
    } finally {
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          width: "100%",
          py: 4,
        }}
      >
        {/* Left Side - Image and Text */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            bgcolor: "#f7f4fd",
            borderRadius: "24px",
            pt: 2,
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "95vh",
            mt: 2,
            ml: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <img
              src={Penguinai}
              alt="Penguin Logo"
              style={{ width: "140px", height: "100%" }}
            />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0, fontSize: "12px", fontWeight: "bold" }}
            >
              Healthcare native intelligence
            </Typography>
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, mt: 15 }}>
            <center>
              <img style={{ height: "50vh" }} src={penguinlogo} alt="Penguin" />
            </center>
            <Box
              sx={{
                mt: "auto",
                position: "relative",
                zIndex: 1,
                transition: "opacity 0.5s ease-in-out",
                m: 4,
                borderRadius: "24px",
                p: 4,
                bottom: "240px",
                border: "1px solid #fff",
                background:
                  "linear-gradient(112.32deg, rgba(234, 68, 148, 0.6) 0%, rgb(104 38 208 / 31%) 101.12%)",
              }}
            >
              {/* Left Arrow */}
              <IconButton
                onClick={handlePreviousSlide}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "-20px",
                  transform: "translateY(-50%)",
                  bgcolor: "#fff",
                  boxShadow: 1,
                  zIndex: 2,
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              {/* Right Arrow */}
              <IconButton
                onClick={handleNextSlide}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "-20px",
                  transform: "translateY(-50%)",
                  bgcolor: "#ffff",
                  boxShadow: 1,
                  zIndex: 2,
                }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: "30px",
                  height: "80px",
                }}
              >
                {slides[currentSlide].title}
              </Typography>
              <Typography
                sx={{ color: "#2C2C2C", fontSize: "17px", fontWeight: 600 }}
              >
                {slides[currentSlide].description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 8,
                  position: "absolute",
                  zIndex: 1,
                  ml: "40%",
                }}
              >
                {slides.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: currentSlide === index ? "#ee016d" : "#e0e0e0",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Welcome and Login Form */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "80%",
            alignItems: "center",
          }}
        >
          <Snackbar
            open={successSnackbar.open}
            autoHideDuration={5000}
            onClose={() => setSuccessSnackbar({ open: false, message: "" })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => setSuccessSnackbar({ open: false, message: "" })}
              sx={{ width: "100%" }}
            >
              {successSnackbar.message}
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorSnackbar.open}
            autoHideDuration={5000}
            onClose={() => setErrorSnackbar({ open: false, message: "" })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="error"
              variant="filled"
              onClose={() => setErrorSnackbar({ open: false, message: "" })}
              sx={{ width: "100%" }}
            >
              {errorSnackbar.message}
            </Alert>
          </Snackbar>

          <Box sx={{ position: "absolute", top: "300px", width: "500px" }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "30px" }}>
                Welcome to PenguinAI
              </Typography>
              <Typography sx={{ fontSize: "17px" }} color="#BBBBBB">
                AI driven synergy for informed decisions.
              </Typography>
            </Box>

            {/* Login Form */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                p: 3,
                border: "1px solid #E0E0E009",
                borderRadius: "12px",
                bgcolor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 0, textAlign: "center" }}>
                Login with Credentials
              </Typography>

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Button
                disabled={!formData.email || !formData.password}
                className="glb-gradient-background"
                onClick={() => BasicAuthLogin()}
                sx={{
                  mt: 1,
                  color: "#fff",
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                startIcon={<AccountCircle />}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
