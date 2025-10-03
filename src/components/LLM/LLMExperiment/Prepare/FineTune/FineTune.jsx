import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useInterval from "src/components/Elements/hooks/useInterval";

import styles from "./FineTune.module.css";
import {
  Box,
  Grid,
  Button,
  Typography,
  Dialog,
  TextField,
  Card,
  CircularProgress,
} from "@mui/material";
import Fileupload from "../../../../../assets/images/fi_upload.svg?react";

import CardContent from "@mui/material/CardContent";
import Document from "../../../../../assets/images/Document.svg";
import Alert from "@mui/material/Alert";
import "../../../../../styles/liquidGlass.css";

import {
  GetListExperiments,
  UpdateConfig,
  UpdateExp,
  UploadFileTos3,
  data_signed_url,
} from "src/services/Portals/LLMPortals";
export default function FineTune(props) {
  const { projectId, experimentId, taskType } = useParams();
  const [uploadFile, setuploadFile] = useState();
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState();
  const [s3Location, setS3Location] = useState();
  const [experimentData, setExperimentData] = useState({});
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const experimentStatus = useRef("");
  const [errorMesg, seterrorMesg] = useState();

  const navigate = useNavigate();

  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentData(res.data[0]);
          experimentStatus.current = res.data[0].status;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchExperimentData();
  }, []);

  const handleFileSelect = (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      setFileData(e.target.files[0]);
    }
  };

  const handleNext = async () => {
    setShowLoader(true);
    seterrorMesg("");
    let tempS3Location = s3Location;
    if (fileData) {
      let res = await UploadFileTos3(fileData, experimentId, "PreparePage");
      if (res?.s3Res?.status != 200) {
        console.log("Error in uploading file", res);
        setShowLoader(false);
        seterrorMesg("Upload failed please try again");
        return;
      }
      tempS3Location = decodeURIComponent(
        res.s3Res.url
          .split("?")[0]
          .replace(".s3.amazonaws.com", "")
          .replace("https://", "s3://")
      );
      setS3Location(tempS3Location);
    }
    if (
      tempS3Location.endsWith(".csv") ||
      tempS3Location.endsWith(".parquet")
    ) {
      console.log("Preprocessing");
      let res2 = await UpdateConfig(experimentId, "data", {
        input: tempS3Location,
        // text:"sentence",
        type: taskType == "pretrain" ? "pretrain" : "sft",
      }).catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
      if (res2.status != 200) {
        console.log("Error in updating config", res2);
        setShowLoader(false);
        return;
      }
      let res3 = await UpdateExp(experimentId, "PREPARED").catch((err) => {
        setShowLoader(false);
        console.log(err);
      });
      if (res3.status != 200) {
        console.log("Error in updating expeiment status", res2);
        setShowLoader(false);
        return;
      }

      setShowLoader(false);
      navigate("preview");
      // await Preprocess(experimentId)
      // await isReady()
      // console.log("Preprocessing Done", experimentData)
      // await UpdateConfig()
    } else {
      UpdateConfig(experimentId, "train", {
        data_uri: tempS3Location,
      })
        .then((res) => {
          if (res.status == 200) {
            UpdateExp(experimentId, "PREPROCESSED");
            navigate(`/llm/${projectId}/experiment/${experimentId}/sft/train`);
          }
        })
        .catch((err) => {
          setIsPollingStatus(false);
          setShowLoader(false);
          seterrorMesg("Update Config failed please try again");
        });
    }
  };

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
            Upload the supported files
          </Typography>
        </Box>

        <Box className={styles["section"]}>
          <Box
            className={`${styles["left-section"]} liquid-glass-card-neutral`}
            sx={{
              borderRadius: "20px",
              padding: "32px",
              margin: "0 auto",
              maxWidth: "600px"
            }}
          >
            <Box className={styles["uploadtitle"]} sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1F1F29",
                  fontFamily: "Plus Jakarta Sans",
                  mb: 1
                }}
              >
                Upload Data or Add S3 Location
              </Typography>
            </Box>
            <Typography
              className={styles["supportfile"]}
              sx={{
                mb: 3,
                fontSize: "14px",
                fontWeight: 500,
                color: "#5420E8",
                fontFamily: "Plus Jakarta Sans"
              }}
            >
              Supported files are ".csv" and ".parquet"
            </Typography>
            <Box
              className={s3Location ? styles["disabled"] : ""}
              sx={{ mb: 3 }}
            >
              <Card
                className="liquid-glass-card"
                sx={{
                  margin: 0,
                  cursor: s3Location ? "not-allowed" : "pointer",
                  border: "2px dashed rgba(84, 32, 232, 0.3)",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: s3Location ? "rgba(84, 32, 232, 0.3)" : "rgba(84, 32, 232, 0.6)",
                    transform: s3Location ? "none" : "translateY(-2px)",
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
                    <Box>
                      <Fileupload />
                    </Box>
                    <Box>
                      <input
                        hidden
                        accept=".csv,.parquet"
                        type="file"
                        ref={inputFile}
                        onChange={handleFileSelect}
                      />
                      <Typography
                        sx={{
                          color: "#1F1F29",
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 500,
                          fontSize: "16px",
                          textAlign: "center"
                        }}
                      >
                        <span
                          onClick={() => {
                            if (!s3Location) inputFile.current.click();
                          }}
                          style={{ cursor: s3Location ? "not-allowed" : "pointer" }}
                        >
                          <span className={styles["draganddrop"]}>
                            Drag and Drop or{" "}
                          </span>
                          <span
                            className={styles["draganddrop"]}
                            style={{ textDecoration: "underline" }}
                          >
                            Choose file
                          </span>
                          <span className={styles["draganddrop"]}>
                            {" "}to upload
                          </span>
                        </span>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            {fileData && (
              <Box
                className="liquid-glass-card-neutral"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  gap: "12px",
                  borderRadius: "12px",
                  mb: 3,
                  maxWidth: "fit-content"
                }}
              >
                <Typography className={styles["FileName"]} sx={{
                  fontWeight: 500,
                  color: "#3F3F50",
                  fontFamily: "Plus Jakarta Sans"
                }}>
                  {fileData.name}
                </Typography>
                <Box
                  className={styles["close"]}
                  onClick={() => {
                    inputFile.current.value = "";
                    setFileData(null);
                  }}
                  sx={{
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "8px",
                    border: "1px solid rgba(168, 32, 13, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(168, 32, 13, 0.1)",
                      transform: "scale(1.1)"
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12 4L4 12"
                      stroke="#A8200D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 4L12 12"
                      stroke="#A8200D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Box>
            )}

            <Box className={styles["sectiondivied"]} sx={{ position: "relative", my: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box className={`${styles["OR-Box"]} liquid-glass-card-neutral`} sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: "-24px"
                }}>
                  <Typography className={styles["text"]} sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1F1F29",
                    fontFamily: "Plus Jakarta Sans",
                    margin: 0
                  }}>
                    OR
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography
              className={`${styles["supportfile"]} ${fileData ? styles["disabled"] : ""}`}
              sx={{
                mb: 2,
                fontSize: "14px",
                fontWeight: 500,
                color: fileData ? "#8D8DAC" : "#5420E8",
                fontFamily: "Plus Jakarta Sans"
              }}
            >
              Add S3 Location
            </Typography>

            <Box
              className={`${styles["s3input"]} ${fileData ? styles["disabled"] : ""} liquid-glass-card-neutral`}
              sx={{
                mb: 3,
                borderRadius: "12px",
                padding: "16px",
                opacity: fileData ? 0.5 : 1
              }}
            >
              <input
                type="text"
                placeholder="S3 Location"
                value={s3Location || ""}
                disabled={fileData}
                onChange={(e) => setS3Location(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "14px",
                  fontFamily: "Plus Jakarta Sans",
                  color: "#1F1F29",
                  outline: "none"
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                onClick={handleNext}
                disabled={!(fileData || s3Location) || showLoader}
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
                {showLoader && (
                  <CircularProgress
                    size={20}
                    sx={{ color: "white" }}
                  />
                )}
              </Button>
            </Box>

            {errorMesg && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Alert severity="error" sx={{ borderRadius: "12px" }}>
                  {errorMesg}
                </Alert>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
