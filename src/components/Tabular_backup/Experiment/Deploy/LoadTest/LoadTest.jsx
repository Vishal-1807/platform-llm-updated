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
import {
  UpdateConfig,
  DeployloadTest,
  replica_suggestion,
} from "../../../../../services/Portals/MLopsPortals";
import InputAdornment from "@mui/material/InputAdornment";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./LoadTest.css";
import { useNavigate } from "react-router-dom";
import Buttons from "../../../../Elements/Buttons";
export default function LoadTest() {
  const { projectId, experimentId } = useParams();
  const [ReplicaData, setReplicaData] = useState({});
  const [SuggestBntDisable, setSuggestBntDisable] = useState(true);
  const [showReplicaData, setshowReplicaData] = useState(false);
  const [NumberOfUsers, setNumberOfUsers] = useState("100");
  const [Loader, setLoader] = useState(false);
  const [ReplicaLoader, setReplicaLoader] = useState(false);
  const [ReplicaBox, setReplicaBox] = useState(true);
  const [errorMesg, seterrorMesg] = useState();
  const [LoadTestInputs, setLoadTestInputs] = useState({
    failRatio: "1",
    AvgResTime: "5000",
    WsAvgResTime: "10000",
  });

  const [displayTokenMsg, setDisplayTokenMsg] = useState(false);
  const handleLTChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoadTestInputs((values) => ({ ...values, [name]: value }));
  };
  const navigate = useNavigate();
  const handleLTSubmit = () => {
    setLoader(true);

    const formData = {
      fail_ratio: LoadTestInputs.failRatio,
      mean_response_time_ms: LoadTestInputs.AvgResTime,
      p90_response_time_ms: LoadTestInputs.WsAvgResTime,
    };

    UpdateConfig(experimentId, "loadtest", formData)
      .then((res) => {
        console.log("loadtest", res);
        if (res.status === 200) {
          DeployloadTest(experimentId)
            .then((trainres) => {
              if (trainres.status === 200) {
                console.log("trainres", trainres);
                setLoader(false);
                setReplicaBox(true);
              }
            })
            .catch((err) => {
              console.log(err);
              if (err.response.status === 403) {
                setDisplayTokenMsg(true);
              }
            });
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const ReplicaSubmit = () => {
    setReplicaLoader(true);
    seterrorMesg("");
    replica_suggestion(experimentId, NumberOfUsers)
      .then((res) => {
        console.log("error", res.status);
        if (res.status === 200) {
          setshowReplicaData(true);
          setReplicaLoader(false);
          setReplicaData(res.data);
        }
        if (res.status === 404) {
          setshowReplicaData(false);
          setReplicaLoader(false);
          seterrorMesg(res.detail);
        }
      })
      .catch((err) => {
        setReplicaLoader(false);
        console.log("errorrr", err.response.data.detail);
        seterrorMesg(err.response.data.detail);
       
      });
  };
  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Box>
        <div className="LoadTest">Load Test</div>
        <div className="Replica" >Define your SLA</div>
        <LableNames>Fail Ratio</LableNames>
        <InputField
          name="failRatio"
          value={LoadTestInputs.failRatio || ""}
          onChange={handleLTChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </Box>
      <Box>
        <LableNames>Average Response time</LableNames>
        <InputField
          name="AvgResTime"
          value={LoadTestInputs.AvgResTime || ""}
          onChange={handleLTChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">Milliseconds</InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ pb: 3 }}>
        <LableNames>Worst Case Average Response time</LableNames>
        <InputField
          name="WsAvgResTime"
          value={LoadTestInputs.WsAvgResTime || ""}
          onChange={handleLTChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">Milliseconds</InputAdornment>
            ),
          }}
        />
        {displayTokenMsg && (
          <div style={{ marginToP: "10px", color: "red" }}>
            Generate Deploy Token
          </div>
        )}

        {Loader ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <Box sx={{ textAlign: "center", width: "100px", mt: 1 }}>
            <Buttons label={"Run"} onClick={handleLTSubmit} />
          </Box>
        )}
      </Box>

      {ReplicaBox ? (
        <>
          <div className="Replica">Replica Suggestions</div>
          <Box sx={{mt:"5px !important"}}>
            <LableNames>Number of users</LableNames>
            <InputField
              sx={{ mb: 2 }}
              name="NoOfUsers"
              value={NumberOfUsers}
              onChange={(e) => setNumberOfUsers(e.target.value)}
            />

            <Box sx={{ width: "100%" }}>
              {ReplicaLoader ? (
                <CircularProgress />
              ) : (
                <Box sx={{ width: "100px", float: "right", mb: 5 }}>
                  <Buttons label={"Suggest"} onClick={ReplicaSubmit} />
                </Box>
              )}
            </Box>
            <Box sx={{ width: "100%", mt: 1 }}>
              <center>{errorMesg}</center>
            </Box>

            {showReplicaData ? (
              <>
                <Box sx={{ textAlign: "left" }}>
                  <b>Maximum Replicas </b>: {"  "}
                  <span>
                    <b>{ReplicaData.max_replicas}</b>
                  </span>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <b>Minimum Replicas </b>: {"  "}
                  <span>
                    <b>{ReplicaData.min_replicas}</b>
                  </span>
                </Box>
              </>
            ) : (
              ""
            )}
          </Box>
        </>
      ) : (
        ""
      )}
    </Stack>
  );
}
