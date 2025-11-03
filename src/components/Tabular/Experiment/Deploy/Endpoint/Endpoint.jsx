import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  SideTitles,
  LableNames,
  RedditTextField,
  ButtonDiv,
  InputField,
} from "../../../../Elements/Styles";
import InputAdornment from "@mui/material/InputAdornment";
import {
  UpdateConfig,
  DeployModel,
} from "../../../../../services/Portals/MLopsPortals";
import "react-js-cron/dist/styles.css";
import "./Endpoint.css";
import CircularProgress from "@mui/material/CircularProgress";
import Buttons from "../../../../Elements/Buttons";
import { useParams, useNavigate } from "react-router-dom";

const Endpoint = ({ onChildClick }) => {
  const navigate = useNavigate();
  const { experimentId } = useParams();
  const [deployType, setDeployType] = useState("realtime");
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
  const [message,setmessage] = useState()

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
    setmessage('');
    const formData = {
      type: deployType,
      lifestage: EPInputs.lifestage,
      min_replicas: Number(EPInputs.podMin),
      max_replicas: Number(EPInputs.podMax),
      min_memory: eval(EPInputs.memMin),
      max_memory: eval(EPInputs.memMax),
      min_cpu: Number(EPInputs.cpuMin),
      max_cpu: Number(EPInputs.cpuMax),
      stage_weight: Number(EPInputs.StageWeight),
    };

    UpdateConfig(experimentId, "deploy", formData)
      .then((res) => {
        console.log("trainres---", res);
        if (res.status === 200) {
          onChildClick(true);
          DeployModel(experimentId).then((trainres) => {
            console.log("deploy---", trainres);
            if (trainres.status === 200) {
              setLoader(false);
              setmessage('SUCCESS')
              // onChildClick(true);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);

        setLoader(false);
      });
  };

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

      <Stack spacing={4} width={633} sx={{ p: 2 }}>
        <Box>
          <LableNames>Pods</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                name="podMin"
                value={EPInputs.podMin || ""}
                id="reddit-input"
                variant="filled"
                onChange={handleEPChange}
                className="deployinput"
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="podMax"
                value={EPInputs.podMax || ""}
                id="reddit-input"
                variant="filled"
                onChange={handleEPChange}
                className="deployinput"
              />
            </Box>
          </Stack>
        </Box>
        <Box>
          <LableNames>Memory</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                label="Minimum"
                name="memMin"
                value={EPInputs.memMin || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Gigabytes</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="memMax"
                value={EPInputs.memMax || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Gigabytes</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "5px",
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mt: 0 }}>
          <LableNames>CPU</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                label="Minimum"
                name="cpuMin"
                value={EPInputs.cpuMin || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Milliseconds</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="cpuMax"
                className="deployinput"
                value={EPInputs.cpuMax || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Milliseconds</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Stack spacing={4} direction="row">
            <div>
              <LableNames>Lifestage</LableNames>
              <FormControl
                sx={{
                  width: "300px",
                  mt: 0,
                  background: "#fff",
                }}
              >
                <Select
                  placeholder="Lifestage"
                  variant="outlined"
                  name="lifestage"
                  value={EPInputs.lifestage || ""}
                  onChange={handleEPChange}
                >
                  <MenuItem value="Staging">Staging</MenuItem>
                  <MenuItem value="Production">Production</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <LableNames>StageWeight</LableNames>
              <FormControl
                sx={{
                  width: "300px",
                  mt: 0,
                  background: "#fff",
                }}
              >
                <Select
                  placeholder="StageWeight"
                  variant="outlined"
                  name="StageWeight"
                  value={EPInputs.StageWeight || ""}
                  onChange={handleEPChange}
                  MenuProps={MenuProps}
                >
                  {[...Array(101).keys()].map((value) => (
                    <MenuItem value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "end", width: "100%", float: "right" }}>
          {Loader ? (
            <CircularProgress />
          ) : (
            <Box sx={{ width: "200px", float: "right" }}>
              <Buttons label={"Deploy"} onClick={handleEPSubmit} />
              <center><p style={{color:"green"}}><b>{message}</b></p></center>
            </Box>
            
          )}
        </Box>
      </Stack>
    </>
  );
};

export default Endpoint;
