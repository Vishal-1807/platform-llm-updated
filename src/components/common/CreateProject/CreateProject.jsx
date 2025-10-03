import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, Typography, Dialog, TextField, Checkbox, IconButton, Fade, Slide } from "@mui/material";
import cibilogo from "../../../assets/LoginImages/cibiLogo.png";
import "./CreateProject.css";
import Buttons from "../../Elements/Buttons";
import { useNavigate } from "react-router-dom";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
import TickSquare from "../../../assets/icons/ticksquare.svg?react";
import TickSquareChecked from "../../../assets/icons/ticksquarechecked.svg?react";
// import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
import Alert from "@mui/material/Alert";
export default function CreateProject({
  onChildClick,
  CreateNewProject,
  CreateExperiment,
  onSuccess = () => {},
}) {
  const [projectData, setProjectData] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [openModel, setOpenModel] = useState(true);
  const [ExperimentBox, seExperimentBox] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [ExperimentName, setExperimentName] = useState();
  const [errorMesg, seterrorMesg] = useState("");
  const navigate = useNavigate();
  const onProjectChange = (e) => {
    if (e.target.value && description) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setProjectName(e.target.value);
  };
  const onDescriptionChange = (e) => {
    if (e.target.value && projectName) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setDescription(e.target.value);
  };

  const onExpNameChange = (e) => {
    setExperimentName(e.target.value);
  };
  console.log(ExperimentName);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
    if (isChecked) {
      seExperimentBox(true);
    } else {
      seExperimentBox(false);
    }
  };

  const onCreateProject = () => {
    console.log(projectName, description);
    if (!projectName && !description) {
      seterrorMesg('Project & Experiment name is required')
      return;
    }
    if (isChecked) {
      if (!ExperimentName) {
        seterrorMesg('Experiment name is required')
        return;
      }
    }
    console.log(projectName, description);
    CreateNewProject(projectName, description)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (isChecked) {
            CreateExperiment(res.data.proj_id, ExperimentName)
              .then((creExpres) => {
                console.log(creExpres);
                if (creExpres.status === 200) {
                  setOpenModel(false);
                  onChildClick(false);
                  debugger;
                  onSuccess();
                  navigate(`${res.data.proj_id}`);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setOpenModel(false);
            onChildClick(false);
            navigate(`${res.data.proj_id}`);
            onSuccess();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Dialog
        open={openModel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            padding: 0,
            overflow: "hidden",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            boxShadow: "0 32px 64px rgba(84, 32, 232, 0.15), 0 16px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(84, 32, 232, 0.08)",
          }
        }}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: "up",
          timeout: 400
        }}
      >
        <Box sx={{ position: "relative", padding: "40px" }}>
          {/* Close Button */}
          <IconButton
            onClick={() => {
              setOpenModel(false);
              onChildClick(false);
            }}
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(84, 32, 232, 0.08)",
              color: "#5420E8",
              "&:hover": {
                backgroundColor: "rgba(84, 32, 232, 0.15)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <CrossIcon style={{ width: "20px", height: "20px" }} />
          </IconButton>

          {/* Header Section */}
          <Box sx={{ textAlign: "center", marginBottom: "32px" }}>
            <Box
              sx={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                borderRadius: "24px",
                boxShadow: "0 8px 32px rgba(84, 32, 232, 0.3)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  background: "linear-gradient(135deg, #5420E8, #E04EF8)",
                  borderRadius: "26px",
                  zIndex: -1,
                  opacity: 0.3,
                  filter: "blur(8px)",
                }
              }}
            >
              <CibiSmallIcon style={{ width: "48px", height: "48px", color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "28px",
                fontWeight: 700,
                color: "#1F1F29",
                marginBottom: "8px",
                background: "linear-gradient(135deg, #1F1F29 0%, #5420E8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create New Project
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "16px",
                color: "#6E6E88",
                fontWeight: 400,
              }}
            >
              Set up your project and start building amazing experiments
            </Typography>
          </Box>
          {/* Form Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Project Name Field */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1F1F29",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Project Name
                <span style={{ color: "#E04EF8" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your project name"
                value={projectName}
                onChange={onProjectChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "#FFFFFF",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    fontSize: "16px",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(84, 32, 232, 0.15)",
                    },
                    "&.Mui-focused": {
                      backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(84, 32, 232, 0.25)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "16px 20px",
                    color: "#1F1F29",
                    "&::placeholder": {
                      color: "#8D8DAC",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Problem Statement Field */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1F1F29",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Problem Statement
                <span style={{ color: "#E04EF8" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the problem you want to solve..."
                value={description}
                onChange={onDescriptionChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    backgroundColor: "#FFFFFF",
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    fontSize: "16px",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(84, 32, 232, 0.15)",
                    },
                    "&.Mui-focused": {
                      backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(84, 32, 232, 0.25)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "16px 20px",
                    color: "#1F1F29",
                    "&::placeholder": {
                      color: "#8D8DAC",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Experiment Section */}
          <Box sx={{ marginTop: "32px" }}>
            {/* Experiment Toggle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "20px",
                borderRadius: "16px",
                backgroundColor: "rgba(84, 32, 232, 0.04)",
                border: "1px solid rgba(84, 32, 232, 0.12)",
                marginBottom: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(84, 32, 232, 0.08)",
                  transform: "translateY(-1px)",
                },
              }}
              onClick={handleCheckboxChange}
            >
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                checkedIcon={
                  <TickSquareChecked
                    style={{
                      width: "28px",
                      height: "28px",
                      color: "#5420E8",
                    }}
                  />
                }
                icon={
                  <TickSquare
                    style={{
                      width: "28px",
                      height: "28px",
                      color: "#8D8DAC",
                    }}
                  />
                }
                sx={{ padding: 0 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#5420E8",
                    marginBottom: "4px",
                  }}
                >
                  Add Experiment Instantly
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "14px",
                    color: "#6E6E88",
                    fontWeight: 400,
                  }}
                >
                  Create your first experiment along with the project
                </Typography>
              </Box>
            </Box>

            {/* Experiment Name Field */}
            <Fade in={isChecked} timeout={300}>
              <Box sx={{ opacity: isChecked ? 1 : 0.3, pointerEvents: isChecked ? "auto" : "none" }}>
                <Typography
                  sx={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1F1F29",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Experiment Name
                  <span style={{ color: "#E04EF8" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your experiment name"
                  value={ExperimentName}
                  onChange={onExpNameChange}
                  disabled={!isChecked}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                      borderRadius: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "content-box, border-box",
                      fontSize: "16px",
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundImage: isChecked ? "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)" : "linear-gradient(white, white), linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)",
                        transform: isChecked ? "translateY(-2px)" : "none",
                        boxShadow: isChecked ? "0 8px 25px rgba(84, 32, 232, 0.15)" : "none",
                      },
                      "&.Mui-focused": {
                        backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(84, 32, 232, 0.25)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#F5F5F5",
                        backgroundImage: "none",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      color: "#1F1F29",
                      "&::placeholder": {
                        color: "#8D8DAC",
                        opacity: 1,
                      },
                      "&.Mui-disabled": {
                        color: "#8D8DAC",
                        WebkitTextFillColor: "#8D8DAC",
                      },
                    },
                  }}
                />
              </Box>
            </Fade>
          </Box>
          {/* Error Message */}
          {errorMesg && (
            <Fade in={!!errorMesg} timeout={300}>
              <Box sx={{ marginTop: "24px" }}>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                    "& .MuiAlert-icon": {
                      color: "#F44336",
                    },
                    "& .MuiAlert-message": {
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#D32F2F",
                    },
                  }}
                >
                  {errorMesg}
                </Alert>
              </Box>
            </Fade>
          )}

          {/* Action Button */}
          <Box sx={{ marginTop: "40px" }}>
            <Button
              fullWidth
              onClick={onCreateProject}
              disabled={disableCreateButton}
              sx={{
                height: "64px",
                borderRadius: "20px",
                background: disableCreateButton
                  ? "linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)"
                  : "linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                color: disableCreateButton ? "#8D8DAC" : "#FFFFFF",
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans",
                textTransform: "none",
                boxShadow: disableCreateButton
                  ? "none"
                  : "0 16px 40px rgba(84, 32, 232, 0.4)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  background: disableCreateButton
                    ? "linear-gradient(135deg, #E8E8F5 0%, #F0F0F8 100%)"
                    : "linear-gradient(135deg, #4A1CC7 0%, #C943D4 100%)",
                  transform: disableCreateButton ? "none" : "translateY(-3px)",
                  boxShadow: disableCreateButton
                    ? "none"
                    : "0 20px 50px rgba(84, 32, 232, 0.5)",
                },
                "&:active": {
                  transform: disableCreateButton ? "none" : "translateY(-1px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
              startIcon={
                <CibiSmallIcon
                  style={{
                    height: "28px",
                    width: "28px",
                    filter: disableCreateButton ? "grayscale(1)" : "none",
                  }}
                />
              }
            >
              Create Project
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
