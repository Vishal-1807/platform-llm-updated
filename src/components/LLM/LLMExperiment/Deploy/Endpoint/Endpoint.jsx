import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import { LableNames } from "../../../../Elements/Styles";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Deploy,
  GetDeploymentStatus,
  GetIngressURL,
  GetListExperiments,
} from "../../../../../services/Portals/LLMPortals";
import "react-js-cron/dist/styles.css";
import "./Endpoint.css";
import CircularProgress from "@mui/material/CircularProgress";
import Buttons from "../../../../Elements/Buttons";
import { useParams, useNavigate } from "react-router-dom";
import useInterval from "src/components/Elements/hooks/useInterval";
import "../../../../../styles/liquidGlass.css";

const Endpoint = ({ onChildClick }) => {
  const navigate = useNavigate();
  const projectId = useParams().projectId;
  const { experimentId } = useParams();
  const [deployType, setDeployType] = useState("realtime");
  const [isPollingStatus, setIsPollingStatus] = useState(true);
  const [DeployBnt, setDeployBnt] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(1000);
  const [message, setMessage] = useState("");
  const [ingcheck, setingcheck] = useState(false);
  const [docurl, setdocurl] = useState(false);
  const [ingressUrl, setingressUrl] = useState();
  const [rescolor, setrescolor] = useState(false);
  const [EPInputs, setEPInputs] = useState({
    podMin: "1",
    podMax: "1",
    memMin: "0.5",
    memMax: "1",
    cpuMin: "1000",
    cpuMax: "1100",
    lifestage: "Production",
    StageWeight: "0",
  });

  const [Loader, setLoader] = useState(false);
  const selectDeployment = (type) => {
    setDeployType(type);
  };
  const handleEPChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEPInputs((values) => ({ ...values, [name]: value }));
  };
  const MenuProps = {
    PaperProps: {
      style: {
        height: "200px",
        width: 100,
      },
    },
  };

  const handleEPSubmit = () => {
    setLoader(true);
    Deploy(experimentId)
      .then((res) => {
        console.log("deploy---", res);
        if (res.status === 200) {
          setIsPollingStatus(true);
          setMessage(
            "Deployment is ongoing, please wait till the service is healthy."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  function isUrlValid(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  function isUrlValid(string) {
    console.log(string);
    let isValid;
    try {
      new URL(string);
      isValid = true;
    } catch (err) {
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  }

  const getDeploymentStatus = async () => {
    GetDeploymentStatus(ingressUrl).then(async (res) => {
      console.log("Health check url", res);
      if (res.status == 200) {
        setLoader(false);
        setMessage("Service is now live and Healthy");
        setLoader(false);
        setDeployBnt(true);
        setrescolor(true);
        setdocurl(false);
      }
    });
  };

  const getValidIngressURL = () => {
    GetIngressURL(experimentId).then(async (res) => {
      console.log("ingress-url", res.data.ingress);
      if (res.status === 200) {
        if (isUrlValid("https://" + res.data.ingress + "/docs")) {
          setingcheck(false);
          console.log("valid url", res.data.ingress);
          setdocurl(true);
          setingressUrl(res.data.ingress + "/docs");
        } else {
          setMessage(
            "Deployment is complete, please wait till the service is healthy."
          );
        }
      }
    });
  };

  const fetchExperimentData = async () => {
    GetListExperiments("", experimentId).then((res) => {
      console.log("exp-status", res.data[0].status);
      if (res.data[0].status === "DEPLOYED") {
        setingcheck(true);
        setIsPollingStatus(false);
        setDeployBnt(true);
        setLoader(true);
        setMessage(
          "Deployment is complete, please wait till the service is healthy."
        );
      }
    });
  };

  useInterval(
    () => {
      //console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  useInterval(
    () => {
      //console.log("Polling");
      getValidIngressURL();
    },
    ingcheck ? pollingInterval : null
  );

  useInterval(
    () => {
      //console.log("Polling");
      getDeploymentStatus();
    },
    docurl ? pollingInterval : null
  );
  return (
    <>
      {/* <Grid container>

                <Box sx={{ margin: "20px" }}>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>Pods</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>Memory</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>CPU</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Grid> */}

      <Stack spacing={4} sx={{ p: 3 }}>
        <Box className="liquid-glass-card-neutral" sx={{ p: 3, borderRadius: "16px" }}>
          <Typography
            sx={{
              mb: 3,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1F1F29",
              fontFamily: "Plus Jakarta Sans"
            }}
          >
            Pod Configuration
          </Typography>
          <Stack spacing={3} direction="row">
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Minimum Pods
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="podMin"
                  value={EPInputs.podMin || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter minimum pods"
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Maximum Pods
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="podMax"
                  value={EPInputs.podMax || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter maximum pods"
                />
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box className="liquid-glass-card-neutral" sx={{ p: 3, borderRadius: "16px" }}>
          <Typography
            sx={{
              mb: 3,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1F1F29",
              fontFamily: "Plus Jakarta Sans"
            }}
          >
            Memory Configuration
          </Typography>
          <Stack spacing={3} direction="row">
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Minimum Memory (GB)
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="memMin"
                  value={EPInputs.memMin || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter minimum memory"
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Maximum Memory (GB)
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="memMax"
                  value={EPInputs.memMax || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter maximum memory"
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box className="liquid-glass-card-neutral" sx={{ p: 3, borderRadius: "16px" }}>
          <Typography
            sx={{
              mb: 3,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1F1F29",
              fontFamily: "Plus Jakarta Sans"
            }}
          >
            CPU Configuration
          </Typography>
          <Stack spacing={3} direction="row">
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Minimum CPU (ms)
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="cpuMin"
                  value={EPInputs.cpuMin || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter minimum CPU"
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#5420E8",
                  fontFamily: "Plus Jakarta Sans"
                }}
              >
                Maximum CPU (ms)
              </Typography>
              <Box className="liquid-glass-input" sx={{
                borderRadius: "12px",
                padding: "12px 16px"
              }}>
                <input
                  name="cpuMax"
                  value={EPInputs.cpuMax || ""}
                  onChange={handleEPChange}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    fontFamily: "Plus Jakarta Sans",
                    color: "#1F1F29",
                    outline: "none"
                  }}
                  placeholder="Enter maximum CPU"
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box className="liquid-glass-card-neutral" sx={{
          p: 3,
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {message && (
            <Typography
              sx={{
                color: rescolor ? "#059669" : "#d97706",
                fontFamily: "Plus Jakarta Sans",
                fontSize: "14px",
                fontWeight: 500,
                flex: 1
              }}
            >
              {message}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {Loader && (
              <CircularProgress
                size={24}
                sx={{ color: "#5420E8" }}
              />
            )}
            <Button
              onClick={handleEPSubmit}
              disabled={DeployBnt || Loader}
              className="liquid-glass-btn"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "Plus Jakarta Sans"
              }}
            >
              Deploy Model
            </Button>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Endpoint;
