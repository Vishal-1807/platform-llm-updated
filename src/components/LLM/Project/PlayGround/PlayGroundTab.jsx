import React, { useState, useEffect, useRef } from "react";

import styles from "./PlayGroundTab.module.css";
import { Box, Grid, Stack, TextField, InputLabel } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import plus from "../../../../assets/fi_plus.png";
import Gtp from "../../../../assets/gpt.svg?react";
import LLamaa from "../../../../assets/LLamaa.svg";
import fi_check from "../../../../assets/fi_check-circle.svg";
import cibi from "../../../../assets/cibiblue.png";
import {
  Ingress,
  Deployments,
  ingress,
} from "../../../../services/Portals/LLMPortals";
import { Sync } from "@mui/icons-material";
import axios from "axios";
import { render } from "react-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CommonSlider } from "../../Common/CommonStyles";

export default function PlayGroundTab(props) {
  const handleClick = () => {};
  const [temperature, settemperature] = useState(10);
  const [MaxNewTokens, setMaxNewTokens] = useState(1000);
  const [ExperimentId, setExperimentId] = useState("PRJ-100019-39dceea8");
  const [question, setQuestion] = useState("");
  const [top_p, setTop_p] = useState(0.5);
  const [top_k, setTop_k] = useState(500);

  const msg = "what is a medication?";

  const onTempSliderChange = (event, newValue) => {
    settemperature(newValue);
  };
  const onMaxTokenSliderChange = (event, newValue) => {
    setMaxNewTokens(newValue);
  };

  const onTopPChange = (e) => {
    setTop_p(e.target.value);
  };

  const onTopKChange = (e) => {
    setTop_k(e.target.value);
  };

  const [streamData, setStreamData] = useState([]);
  const [filteredDeployments, setFilteredDeployments] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState("");

  useEffect(() => {
    if (!filteredDeployments.length > 0) {
      Deployments()
        .then((res) => {
          if (res.status === 200) {
            GetDeploymentStatus(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const GetDeploymentStatus = (data) => {
    // use url - ${dp.ingress}/docs for testing in local
    Promise.all(
      data.map((dp) =>
        fetch(`https://llm-infer.cibi.ai/docs`)
          .then((res) => {
            if (res.status === 200) {
              return { ...dp, status: "active" };
            } else {
              return { ...dp, status: "inactive" };
            }
          })
          .catch((err) => {
            // console.log(err);
            return { ...dp, status: "inactive" }; // Assuming error means inactive status
          })
      )
    ).then((statusArray) => {
      setFilteredDeployments(statusArray);
    });
  };

  const prompt_question = async () => {
    if (!selectedDeployment && !qusetion) {
      return;
    }
    const ActiveDeployment = filteredDeployments.find(
      (deployment) => deployment.exp_id === selectedDeployment
    );

    const data = JSON.stringify({
      prompt: question,
      stream: true,
      temperature: temperature,
      max_tokens: MaxNewTokens,
      top_p: top_p,
      top_k: top_k,
    });
    const url = `${ActiveDeployment.ingress}/infer`; //use this for testing in local
    fetch('https://llm-infer.cibi.ai/infer', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
      body: data,
    }).then(async (response) => {
      // Creating a reader for the stream
      const reader = response.body.getReader();
      let result = "";
      let decoder = new TextDecoder("utf-8");
      // Reading and decoding the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Decode the value and split into lines
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        // Parse each line as JSON and append its text property
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() !== "") {
            const parsedChunk = JSON.parse(lines[i]);
            result += parsedChunk.text;
            setStreamData(result);
          }
        }
      }
      // setStreamData(result);
    });
  };
  // console.log('streamData', streamData)

  const Typewriter = ({ text }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          clearInterval(interval);
        }
      }, 50); // Adjust the interval as needed for typing speed

      return () => clearInterval(interval);
    }, [currentIndex, text]);
    console.log("displayText", displayText);

    return <div>{displayText}</div>;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container className={styles["playground-ctn"]} columns={12}>
        <Grid item xs={9} className={styles["grid-left"]}>
          <Stack spacing={2} direction="column">
            <Box className={styles["promt-box"]}>
              <div className={styles["title-txt"]}>Enter the Model Input:</div>
              <TextField
                multiline
                fullWidth
                placeholder="Enter a promt click RUN to generate a response from the fine-tuned LLM and its base model"
                value={question}
                rows={8}
                sx={{ fontSize: "12px", background: "#fff" }}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              ></TextField>
              <Box sx={{ mt: 1, float: "right" }}>
                <div
                  className={styles["run-btn"]}
                  onClick={() => prompt_question()}
                >
                  Run
                </div>
              </Box>
            </Box>
            <Box className={styles["promt-res"]}>
              <div className={styles["title-txt"]}>Generated Response:</div>
              <Box
                sx={{
                  height: "200px",
                  borderRadius: "10px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  padding: "16.5px 14px",
                }}
              >
                <Typewriter text={streamData} />
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={3} className={styles["settings-ctn"]}>
          <h4 className={styles["set-title"]}>Settings</h4>
          <div className={styles["side-head"]}>Model</div>
          <FormControl sx={{ width: "100%" }}>
            <Select
              placeholder="Choose Model"
              variant="outlined"
              name="experiment"
              value={selectedDeployment}
              onChange={(e) => setSelectedDeployment(e.target.value)}
            >
              {filteredDeployments.map((data) => (
                <MenuItem key={data.exp_id} value={data.exp_id}>
                  {data.exp_name}
                  <div
                    style={{
                      marginLeft: "10px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "100px",
                      background: `${
                        data.status === "active" ? "green" : "red"
                      }`,
                    }}
                  ></div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Accordion
            sx={{
              mt: 2,
              "& .MuiAccordionSummary-content": {
                margin: "0 !important",
              },
            }}
            className={styles["accordian"]}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <h4>Advanced</h4>
            </AccordionSummary>
            <AccordionDetails>
              <h5
                className={styles["side-head"]}
              >{`Temperature (number, 0<n<=2)`}</h5>
              <div className={styles["slider"]}>
                <CommonSlider
                  defaultValue={temperature}
                  step={1}
                  valueLabelDisplay="auto"
                  marks
                  min={1}
                  max={100}
                  onChange={onTempSliderChange}
                ></CommonSlider>
              </div>
              <h5 className={styles["side-head"]}>Max New Tokens</h5>
              <input
                className={styles["input-tokens"]}
                onChange={onMaxTokenSliderChange}
                value={MaxNewTokens}
              />
              <h5 className={styles["side-head"]}>Top_P</h5>
              <CommonSlider
                defaultValue={top_p}
                valueLabelDisplay="auto"
                step={0.1}
                min={0}
                max={1}
                onChange={onTopPChange}
              ></CommonSlider>
              <h5 className={styles["side-head"]}>Top_K</h5>
              <input
                className={styles["input-tokens"]}
                onChange={onTopKChange}
                value={top_k}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
}
