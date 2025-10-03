import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";
import styles from "./FineTune.module.css";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import useInterval from "src/components/Elements/hooks/useInterval";
import ph_database from "../../../../../assets/images/ph_database-light.svg";
import {
  GetDataPreview,
  GetListExperiments,
  Preprocess,
  UpdateConfig,
} from "src/services/Portals/LLMPortals";
import Alert from "@mui/material/Alert";
import "../../../../../styles/liquidGlass.css";

export default function DataPreview() {
  const { projectId, experimentId, taskType } = useParams();
  const [uploadFile, setuploadFile] = useState();
  const [experimentData, setExperimentData] = useState({});
  const inputFile = useRef(null);
  const experimentStatus = useRef("");
  const processedInput = useRef("");
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [columnDef, setColumnDef] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [nextLoader, setNextLoader] = useState(false);
  const [target, setTarget] = useState("");
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(1000);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [errorMesg, seterrorMesg] = useState("");
  const navigate = useNavigate();
  useInterval(
    () => {
      console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  const isReady = async () => {
    while (true) {
      if (experimentStatus.current == "PREPROCESSED") {
        return true;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  };
  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentData(res.data[0]);
          experimentStatus.current = res.data[0].status;
          if (res.data[0]?.preprocessed_input) {
            processedInput.current = res.data[0].preprocessed_input;
          }
          return res.data[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDataPreview = () => {
    setShowLoader(true);
    
    GetDataPreview(experimentId, prompt)
      .then((res) => {
        if (res.status === 200) {
          console.log();
          setColumns(Object.keys(res.data[0]));
          setPreviewData(
            res.data.map((row, index) => {
              row["id"] = index;
              return row;
            })
          );
          setColumnDef(
            Object.keys(res.data[0]).map((column) => {
              return {
                field: column,
                headerName: column,
                flex: column == "prompt" ? 2 : 1,
              };
            })
          );
          setShowLoader(false);
          debugger;
          if ("prompt" in res.data[0]) {
            setHasPrompt(true);
          } else {
            setHasPrompt(false);
          }
        } else {
          setShowLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  const submitPreprocess = async () => {
    setNextLoader(true);
    seterrorMesg();
    if (!prompt) {
      setNextLoader(false);
      seterrorMesg("Prompt Missing");
      return;
    }
    UpdateConfig(experimentId, "data", {
      prompt: prompt,
      target: target,
      type: taskType == "pretrain" ? "pretrain" : "sft",
    })
      .then((res) => {
        if (res.status === 200) {
          navigate(
            `/llm/${projectId}/Experiment/${experimentId}/${taskType}/train`
          );
        } else {
          setNextLoader(false);
        }
      })
      .catch((err) => {
        setNextLoader(false);
        seterrorMesg("Text column failed please try again");
      });
  };

  useEffect(() => {
    fetchExperimentData();
    fetchDataPreview();
  }, [experimentId]);

  return (
    <Box sx={{
      padding: "24px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)"
    }}>
      <Box className={styles["UploadSection"]}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            className={styles["tagline"]}
            sx={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: 600,
              color: "#3F3F50",
              fontFamily: "Plus Jakarta Sans"
            }}
          >
            Preview your target data
          </Typography>
        </Box>

        <Box className="liquid-glass-card-neutral" sx={{
          borderRadius: "20px",
          padding: "32px",
          margin: "0 auto",
          maxWidth: "1200px"
        }}>
          <Box className={styles["uploadtitle"]} sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1F1F29",
                fontFamily: "Plus Jakarta Sans",
                mb: 1,
                background: "linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Data Preview and Prompt Templating
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              className={styles["supportfile"]}
              sx={{
                mb: 2,
                fontSize: "16px",
                fontWeight: 600,
                color: "#5420E8",
                fontFamily: "Plus Jakarta Sans",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              Text Column
              <Chip
                label="Required"
                size="small"
                sx={{
                  backgroundColor: "rgba(84, 32, 232, 0.1)",
                  color: "#5420E8",
                  fontSize: "10px",
                  height: "20px"
                }}
              />
            </Typography>
            <Box className="liquid-glass-card-neutral" sx={{
              borderRadius: "12px",
              padding: "16px",
              mb: 3
            }}>
              <Select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                displayEmpty
                sx={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "14px",
                  fontFamily: "Plus Jakarta Sans",
                  color: "#1F1F29",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 },
                  "& .MuiSelect-select": { padding: "8px 0" }
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: "#8D8DAC", fontStyle: "italic" }}>
                    Select a text column
                  </Typography>
                </MenuItem>
                {columns.map((column) => (
                  <MenuItem key={column} value={column} sx={{ textTransform: "capitalize" }}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Typography
              className={styles["supportfile"]}
              sx={{
                mb: 2,
                fontSize: "16px",
                fontWeight: 600,
                color: "#5420E8",
                fontFamily: "Plus Jakarta Sans",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              Prompt Template
              <Chip
                label="Required"
                size="small"
                sx={{
                  backgroundColor: "rgba(84, 32, 232, 0.1)",
                  color: "#5420E8",
                  fontSize: "10px",
                  height: "20px"
                }}
              />
            </Typography>
            <Box className="liquid-glass-card-neutral" sx={{
              borderRadius: "16px",
              padding: "20px",
              mb: 3,
              position: "relative",
              overflow: "hidden"
            }}>
              <textarea
                style={{
                  height: "120px",
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "14px",
                  fontFamily: "Plus Jakarta Sans",
                  color: "#1F1F29",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "1.6"
                }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Use information from {column 1} to do something specific, like {column 2}"
              />
            </Box>

            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              gap: 2
            }}>
              {nextLoader && (
                <Typography
                  className={styles["blinker"]}
                  sx={{
                    fontSize: "14px",
                    color: "#5420E8",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 500
                  }}
                >
                  Processing input...
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
                <Button
                  onClick={fetchDataPreview}
                  disabled={showLoader}
                  variant="outlined"
                  sx={{
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 600,
                    borderColor: "#5420E8",
                    color: "#5420E8",
                    "&:hover": {
                      borderColor: "#5420E8",
                      backgroundColor: "rgba(84, 32, 232, 0.05)"
                    },
                    "&:disabled": {
                      borderColor: "#D3D3EA",
                      color: "#8D8DAC"
                    }
                  }}
                >
                  Preview
                  {showLoader && (
                    <CircularProgress
                      size={16}
                      sx={{ ml: 1, color: "#5420E8" }}
                    />
                  )}
                </Button>

                <Button
                  onClick={submitPreprocess}
                  disabled={!target || nextLoader || showLoader}
                  className="liquid-glass-btn"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    px: 3,
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: 600
                  }}
                >
                  Next
                  {nextLoader && (
                    <CircularProgress
                      size={16}
                      sx={{ color: "white" }}
                    />
                  )}
                </Button>
              </Box>
            </Box>

            {errorMesg && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Alert severity="error" sx={{ borderRadius: "12px", width: "100%" }}>
                  {errorMesg}
                </Alert>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1F1F29",
                  fontFamily: "Plus Jakarta Sans",
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}
              >
                <Box
                  component="img"
                  src={ph_database}
                  sx={{ width: "24px", height: "24px" }}
                />
                Data Preview
              </Typography>
            </Box>

            <Box className="liquid-glass-card-neutral" sx={{
              borderRadius: "16px",
              padding: "24px",
              height: "500px"
            }}>
              <DataGrid
                rows={previewData}
                columns={columnDef}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
                getRowId={(row) => row.id}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    background: "linear-gradient(135deg, #5420E8 0%, #E04EF8 100%)",
                    color: "#fff",
                    borderRadius: "12px 12px 0 0",
                    minHeight: "48px !important",
                    maxHeight: "48px !important",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "Plus Jakarta Sans",
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: 600
                    }
                  },
                  "& .MuiDataGrid-row": {
                    minHeight: "48px !important",
                    maxHeight: "48px !important",
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(84, 32, 232, 0.02)"
                    },
                    "&:hover": {
                      backgroundColor: "rgba(84, 32, 232, 0.05)"
                    }
                  },
                  "& .MuiDataGrid-cell": {
                    minHeight: "48px !important",
                    maxHeight: "48px !important",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    borderBottom: "1px solid rgba(84, 32, 232, 0.1)"
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid rgba(84, 32, 232, 0.1)",
                    backgroundColor: "rgba(84, 32, 232, 0.02)"
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
