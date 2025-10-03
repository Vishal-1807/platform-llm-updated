import React, { useState, useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
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
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Paper,
} from "@mui/material";

import {
  get_consumption_risk_type,
  get_consumption_targets,
  get_consumption_risks,
  get_consumption_contributions,
} from "../../../../../services/Portals/MLopsPortals";

export const PatientRiskProfile = ({ getProjectDescription }) => {
  const [type, setType] = useState("");
  const [targets, setTargets] = useState([]);
  const [selectedTarget, setselectedTarget] = useState("");
  const [risks, setRisks] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [chartData, setChartData] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [selectedRiskScores, setSelectedRiskScores] = useState("");
  const [riskScoresDict, setRiskScoresDict] = useState({});

  const [selectedValue, setSelectedValue] = useState(riskScores[0]);

  useEffect(() => {
    let desc =
      "Predict the first occurrence of Congestive Heart Failure, Chronic Kidney Disease and Chronic Obstructive Pulmonary Disease ahead in time";
    get_consumption_risk_type(desc)
      .then((res) => {
        setType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (type) {
      if (type == "mdp") {
        get_consumption_targets(type, "project_id")
          .then((res) => {
            setTargets(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setselectedTarget("nbs");
      }
    }
  }, [type]);

  const handleTargetChange = (e) => {
    setselectedTarget(e.target.value);
  };

  const handleSelectPatient = (e) => {
    console.log(e);
    setPatientId(e);
  };

  const renderTableRows = () => {
    return risks.map((row, index) => (
      <TableRow
        key={index}
        sx={{
          cursor: "pointer",
          "&:hover": {
            background: "#33333314",
          },
        }}
        onClick={(e) => handleSelectPatient(row.subject_id)}
      >
        <TableCell>{row.subject_id}</TableCell>
        <TableCell>{row.score}</TableCell>
      </TableRow>
    ));
  };

  useEffect(() => {
    if (selectedTarget) {
      get_consumption_risks(type, selectedTarget)
        .then((res) => {
          console.log(res.data);
          setRisks(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedTarget]);

  useEffect(() => {
    if (patientId) {
      get_consumption_contributions(type, patientId, selectedTarget)
        .then((res) => {
          let data = [];
          res.data.contribution.map((ele) => {
            data.push({
              x: ele.days_diff,
              y: ele.contribution,
              value: ele.icd,
            });
          });
          setChartData(data);
          if (type == "nbs") {
            setRiskScores(
              Object.keys(res.data.risk_scores).sort(
                (a, b) => res.data.risk_scores[a] - res.data.risk_scores[b]
              )
            );
            setRiskScoresDict(res.data.risk_scores);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [patientId]);

  const handleRiskScoreChange = (e) => {
    setSelectedRiskScores(e.target.value);
    setSelectedValue(e.target.value);
  };
  const chartConfig = {
    chart: {
      type: "scatter",
      zoomType: "xy",
    },
    title: {
      text: "Temporal Visualisation of Patient's historical diseases and their contribution to their current risk",
    },
    xAxis: {
      title: {
        text: "Days Since",
      },
    },
    yAxis: {
      title: {
        text: "Contribution",
      },
    },
    tooltip: {
      formatter: function () {
        return `Days Since: ${this.point.x}<br/>Contribution: ${this.point.y}<br/>ICD: ${this.point.options.value}`;
      },
    },
    series: [
      {
        name: "Data",
        data: chartData,
      },
    ],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Patient Risk Profile</h4>
      {chartData.length > 0 && (
        <>
          <Grid
            container
            sx={{
              m: 2,
              ml: 0,
              p: 2,
              pl: 0,
              width: "50%",
            }}
          >
            <Grid xs={4}>
              <h4>Member ID: {patientId}</h4>
            </Grid>
            <Grid xs={4}>
              <h4>Patient Name: John Doe</h4>
            </Grid>
            <Grid xs={4}>
              <h4>Patient Age: 33</h4>
            </Grid>
          </Grid>

          {type == "nbs" && (
            <>
              <Grid
                container
                sx={{
                  m: 2,
                  ml: 0,
                  p: 2,
                  pl: 0,
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Grid xs={2}>
                  <h4
                    style={{
                      fontSize: "14px",
                      margin: "13px",
                      marginLeft: "0",
                    }}
                  >
                    Discharge Location:
                  </h4>
                </Grid>
                <Grid xs={4}>
                  <Select
                    placeholder="Target Disease"
                    variant="outlined"
                    name="targetDisease"
                    value={selectedValue}
                    onChange={handleRiskScoreChange}
                    sx={{ width: "80%" }}
                    defaultValue={riskScores[0]}
                  >
                    {riskScores.map((ele, index) => (
                      <MenuItem key={index} value={ele}>
                        {ele}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid xs={6}>
                  <h4 style={{ margin: "12px" }}>
                    Risk score for the selected discharge location:{" "}
                    <b>{riskScoresDict[selectedRiskScores]}</b>
                  </h4>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}

      <Box sx={{ width: "50%" }}>
        <h4></h4>
        <h4></h4>
      </Box>
      <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
        <Box sx={{ width: "20%" }}>
          {risks.length > 0 && (
            <TableContainer sx={{ width: "100%" }} component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Risk Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </TableContainer>
          )}
        </Box>
        <Box sx={{ width: "80%" }}>
          <Stack spacing={2} direction="row" justifyContent="space-between">
            {targets && type != "nbs" && (
              <Box sx={{ width: "100%", textAlign: "right" }}>
                <p>Target Disease</p>
                <FormControl
                  sx={{
                    width: "200px",
                    mt: 0,
                    background: "#fff",
                    textAlign: "center",
                  }}
                >
                  <Select
                    placeholder="Target Disease"
                    variant="outlined"
                    name="targetDisease"
                    value={selectedTarget}
                    onChange={handleTargetChange}
                  >
                    {targets.map((tar) => (
                      <MenuItem value={tar}>{tar}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Stack>
          <br></br>
          <br></br>
          <br></br>
          <Box>
            {chartData.length > 0 && (
              <HighchartsReact highcharts={Highcharts} options={chartConfig} />
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
