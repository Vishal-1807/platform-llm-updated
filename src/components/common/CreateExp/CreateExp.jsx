import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Dialog, TextField } from "@mui/material";
import "./CreateExp.css";
import "../../../styles/liquidGlass.css";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
export default function CreateExp({ onChildClick, projectId, CreateExperiment}) {
  const [ExpName, setExpName] = useState("");
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [openModel, setOpenModel] = useState(true);
  const [ExperimentBox, seExperimentBox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onExpNameChange = (e) => {
    if (e.target.value) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setExpName(e.target.value);
  };

  const CreateProject = () => {
    console.log(ExpName);
    if (!ExpName) {
      return;
    }

    CreateExperiment(projectId, ExpName)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setOpenModel(false);
          onChildClick(false);
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
        sx={{
          '& .MuiDialog-paper': {
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <div className="liquid-glass-modal" style={{ padding: "32px", width: "460px", position: "relative" }}>

        <Box
            sx={{
              position:"absolute",
              top:"16px",
              right:"16px",
              cursor: "pointer",
              zIndex: 10,
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              '&:hover': {
                background: "rgba(255,255,255,0.3)",
                transform: "scale(1.1)"
              }
            }}
            onClick={() => {
              setOpenModel(false);
              onChildClick(false);
            }}
          >
            <CrossIcon style={{ width: "16px", height: "16px", opacity: 0.8 }}/>
          </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >
          <Box
            sx={{
              color: "rgba(0, 0, 0, 0.87)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <Box sx={{
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, rgba(84,32,232,0.15) 0%, rgba(224,78,248,0.10) 100%)",
                borderRadius: "50%",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(84,32,232,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
                position: "relative",
                overflow: "hidden",
                '&::before': {
                  content: '""',
                  position: "absolute",
                  inset: "1px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  pointerEvents: "none"
                }
              }}>
                <CibiSmallIcon style={{width:"48px", height:"48px", zIndex: 1}}/>
              </Box>
            <Typography className="CreateProject" sx={{
              background: "linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              fontSize: "28px"
            }}>
              Create Experiment
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap:"16px"
            }}
          >
            <label className="FormLabels" style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#3F3F50",
              marginBottom: "4px"
            }}>
              Experiment Name*
            </label>
            <TextField
              fullWidth
              sx={{
                fontSize:"14px",
                '& .MuiOutlinedInput-root': {
                  height:"52px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,255,0.9) 100%)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 4px 16px rgba(84,32,232,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  '& fieldset': {
                    border: "none"
                  },
                  '&:hover': {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(84,32,232,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(84,32,232,0.2)"
                  },
                  "&.Mui-focused": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 24px rgba(84,32,232,0.2), inset 0 1px 0 rgba(255,255,255,0.7)",
                    border: "1px solid rgba(84,32,232,0.4)"
                  }
                },
                '& .MuiInputBase-input': {
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#3F3F50",
                  padding: "14px 20px",
                  '&::placeholder': {
                    color: "rgba(63,63,80,0.6)",
                    opacity: 1
                  }
                }
              }}
              placeholder="Enter Experiment Name"
              value={ExpName}
              onChange={onExpNameChange}
              className="Text_creExp"
            />
          </Box>

          <Box sx={{ marginTop: "8px" }}>
            <button
              style={{
                width:"100%",
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 24px",
                borderRadius: "16px",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                cursor: disableCreateButton ? "not-allowed" : "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              disabled={disableCreateButton}
              className={`liquid-glass-btn ${disableCreateButton ? 'disabled' : ''}`}
              onClick={CreateProject}
            >
              <CibiSmallIcon style={{height:"20px", width:"20px", zIndex: 1}}/>
              <span style={{ zIndex: 1 }}>Create</span>
            </button>
          </Box>
        </Box>
        </div>
      </Dialog>
                
    
    </>
  );
}
