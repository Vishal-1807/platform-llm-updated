import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  InputLabel,
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

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import {
  UpdateConfig,
  DeployModel,
  DeployloadTest,
  Loadtest_Status,
  replica_suggestion,
  GetListExperiments 
} from "../../../../../services/Portals/MLopsPortals";
import { useParams, useNavigate } from "react-router-dom";

import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";

import "./Batch.css";
import Buttons from "../../../../Elements/Buttons";
import CircularProgress from "@mui/material/CircularProgress";

export default function Batch() {
  const [deployType, setDeployType] = useState("batch");
  const [Loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { projectId,experimentId } = useParams();
  const [BatchInputs, setBatchInputs] = useState({
    input: ``,
    memMin: "0.5",
    memMax: "1",
    cpuMin: "1000",
    cpuMax: "1100",
    lifestage: "Staging",
    StageWeight: "0",
  });
  useEffect(() => {
    GetListExperiments("", experimentId).then((res) => {
      if (res.status === 200) {
        let temp = BatchInputs;
        temp["input"] = res.data[0].train_config.data.input;
        setBatchInputs({ ...temp });
      }
    })
  }, [experimentId]);

  const [users, setusers] = useState("100");
  
  const [showAlerts, setShowAlerts] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [ScheduledValue, setScheduledValue] = useState("0 12 * * *");
  const [displayTokenMsg, setDisplayTokenMsg] = useState(false);
  const [NumberOfUsers, setNumberOfUsers] = useState("100");
  const [SuggestBntDisable, setSuggestBntDisable] = useState(true);
  const [ReplicaData, setReplicaData] = useState({});
  const [showReplicaData, setshowReplicaData] = useState(false);

  const handleBatchChange = (event) => {
    console.log(event.target.value);
    const name = event.target.name;
    const value = event.target.value;

    setBatchInputs((values) => ({ ...values, [name]: value }));
  };

  const onScheduledValueChange = (e) => {
    setScheduledValue(e.target.ScheduledValue);
  };
  const handleBatchSubmit = () => {
    setLoader(true);

    const formData = {
      type: deployType,
      lifestage: BatchInputs.lifestage,
      batch_input: BatchInputs.input,
      schedule: ScheduledValue,
      min_memory: eval(BatchInputs.memMin),
      max_memory: eval(BatchInputs.memMax),
      min_cpu: Number(BatchInputs.cpuMin),
      max_cpu: Number(BatchInputs.cpuMax),
      // stage_weight: Number(BatchInputs.StageWeight),
    };

  
    UpdateConfig(experimentId, "deploy", formData)
      .then((res) => {
        console.log("resBatch UpdateConfig", res);
        if (res.status === 200) {
          DeployModel(experimentId).then((trainres) => {
            console.log("resBatch Deploy", trainres);

            if (trainres.status === 200) {
              setLoader(false);
             
              navigate(
                `/tabular/${projectId}/Experiment/${experimentId}/reports`
              );
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
   
      <Stack spacing={2} width={633} sx={{ p: 2, mb: 5 }}>
        <Box>
          <label className="labelname">Path for input data</label>
          <TextField
            value={BatchInputs.input || ""}
            name="input"
            onChange={handleBatchChange}
            fullWidth
            size="small"
          />
        </Box>

        <Box>
          <label className="labelname">Schedule</label>
          <TextField
            fullWidth
            sx={{ mt: 1, mb: 3, textAlign: "left", background: "#fff" }}
            value={ScheduledValue}
            onChange={onScheduledValueChange}
          />
          <Cron value={ScheduledValue} setValue={setScheduledValue} />
        </Box>
        <Box>
          <label className="labelname">Memory</label>
          <Stack spacing={4} direction="row">
            <RedditTextField
              label="Minimum"
              name="memMin"
              value={BatchInputs.memMin}
              onChange={handleBatchChange}
              id="reddit-input"
              variant="filled"
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
            <RedditTextField
              label="Maximum"
              name="memMax"
              value={BatchInputs.memMax || ""}
              onChange={handleBatchChange}
              id="reddit-input"
              variant="filled"
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
          </Stack>
        </Box>

        <Box>
          <label className="labelname">CPU</label>
          <Stack spacing={4} direction="row">
            <RedditTextField
              label="Minimum"
              name="cpuMin"
              value={BatchInputs.cpuMin || ""}
              onChange={handleBatchChange}
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
            <RedditTextField
              label="Maximum"
              name="cpuMax"
              value={BatchInputs.cpuMax || ""}
              onChange={handleBatchChange}
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
          </Stack>
          <Box sx={{ mt: 2 }}>
            <label className="labelname" style={{ display: "block" }}>
              Lifestage
            </label>
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
                value={BatchInputs.lifestage || ""}
                onChange={handleBatchChange}
              >
                <MenuItem value="Staging">Staging</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ textAlign: "end", width: "100%", float: "right" }}>
          {Loader ? (
            <CircularProgress />
          ) : (
            <Box sx={{ width: "200px", float: "right" }}>
              <Buttons label={"Deploy"} onClick={handleBatchSubmit} />
            </Box>
          )}
        </Box>
      </Stack>
 
  );
}
