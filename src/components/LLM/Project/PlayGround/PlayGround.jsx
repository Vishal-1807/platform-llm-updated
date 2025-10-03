import React, { useState, useEffect, useRef } from "react";

import styles from "./PlayGround.module.css";
import { Box, Grid, Slider } from "@mui/material";
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

export default function PlayGround(props) {
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
    //const url = `${ActiveDeployment.ingress}/infer`;
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
    <>
      <div className={styles["UploadSection"]}>
        <div className={styles["section"]}>
          <div
            className={styles["left-section"]}
            style={{ background: "#fff" }}
          >
            <div className={styles["uploadtitle"]}>
              <h4>Enter following information</h4>

              {/* <div style={{ float: "right" }}>
                <Box className={styles["add-record"]} onClick={handleClick}>
                  <img src={plus} className={styles["plus-img"]}></img>
                  <p className={styles["record"]}>Add Dataset</p>
                </Box>
              </div> */}
            </div>

            <div className={styles["uploadfile"]}>
              <div className={styles["supportfile"]}>Choose the Deployment</div>
            </div>
            {/* <div className={styles["models"]}>
              <Grid container sx={{ pl: 1, pt: 0 }}>
                <Grid xs={3} className={styles["modeltype"]}>
                  <Gtp /> <p>GPT2</p>
                </Grid>
                <Grid xs={3} className={styles["modeltype"]}>
                  <img src={LLamaa}></img> <p>Llama - 7b</p>
                </Grid>
                <Grid xs={3} className={styles["modeltype"]}>
                  <img
                    src={cibi}
                    style={{ width: "40px", height: "35px" }}
                  ></img>
                  <p>Solaris</p>
                </Grid>
              </Grid>
            </div> */}

            <FormControl sx={{ margin: "0 10px 10px 20px", width: "400px" }}>
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

            <div className={styles["range-section"]}>
              <Grid container>
                <Grid xs={6}>
                  {" "}
                  <div className={styles["supportfile"]}>Temperature</div>
                  <div className={styles["slider"]}>
                    <Slider
                      sx={{
                        "& .MuiSlider-thumb": {
                          color: "white",
                          border: "2px solid #5B32D0",
                          height: "12px",
                          width: "12px",
                        },
                        "& .MuiSlider-track": {
                          backgroundImage:
                            "linear-gradient(80deg, #5B32D0 0%, #E04EF8 96.35%)",
                          height: "8px",
                        },
                        "& .MuiSlider-rail": {
                          color: "#acc4e4",
                        },
                        "& .MuiSlider-active": {
                          color: "green",
                        },
                        "& .MuiSlider-mark": {
                          width: 0,
                        },
                        "& .css-jx1sa5-MuiSlider-thumb": {
                          height: "15px !important",
                          width: "15px !important",
                        },
                        "& .MuiSlider-valueLabel": {
                          backgroundImage:
                            "linear-gradient(80deg, #5B32D0 0%, #E04EF8 96.35%) !important",
                        },
                        "& .css-16fgs5d-MuiSlider-root .MuiSlider-rail": {
                          color: "#D3D3EA !important",
                        },
                        "& .css-1j69iww-MuiSlider-root": {
                          height: "8px !important",
                        },
                      }}
                      defaultValue={temperature}
                      step={1}
                      valueLabelDisplay="auto"
                      marks
                      min={1}
                      max={100}
                      onChange={onTempSliderChange}
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className={styles["supportfile"]}>Max New Tokens</div>
                  <div className={styles["slider"]}>
                    <input
                      className={styles["input-tokens"]}
                      onChange={onMaxTokenSliderChange}
                      value={MaxNewTokens}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid xs={6}>
                  {" "}
                  <div className={styles["supportfile"]}>Top_p</div>
                  <div className={styles["slider"]}>
                    <Slider
                      sx={{
                        "& .MuiSlider-thumb": {
                          color: "white",
                          border: "2px solid #5B32D0",
                          height: "12px",
                          width: "12px",
                        },
                        "& .MuiSlider-track": {
                          backgroundImage:
                            "linear-gradient(80deg, #5B32D0 0%, #E04EF8 96.35%)",
                          height: "8px",
                        },
                        "& .MuiSlider-rail": {
                          color: "#acc4e4",
                        },
                        "& .MuiSlider-active": {
                          color: "green",
                        },
                        "& .MuiSlider-mark": {
                          width: 0,
                        },
                        "& .css-jx1sa5-MuiSlider-thumb": {
                          height: "15px !important",
                          width: "15px !important",
                        },
                        "& .MuiSlider-valueLabel": {
                          backgroundImage:
                            "linear-gradient(80deg, #5B32D0 0%, #E04EF8 96.35%) !important",
                        },
                        "& .css-16fgs5d-MuiSlider-root .MuiSlider-rail": {
                          color: "#D3D3EA !important",
                        },
                        "& .css-1j69iww-MuiSlider-root": {
                          height: "8px !important",
                        },
                      }}
                      defaultValue={top_p}
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0}
                      max={1}
                      onChange={onTopPChange}
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className={styles["supportfile"]}>Top_k</div>
                  <div className={styles["slider"]}>
                    <input
                      className={styles["input-tokens"]}
                      onChange={onTopKChange}
                      value={top_k}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>

            <div style={{ margin: "0 auto", width: "96%" }}>
              <div className={styles["supportfile"]}>Prompt Answer</div>
              <div className={styles["s3input"]}>
                <input
                  style={{
                    width: "95%",
                    marginLeft: "0px",
                    paddingtop: "0",
                  }}
                  placeholder="Answer based on context: {review}. Question: {question}."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["buttons"]}>
              <div className={styles["rightbnts"]}>
                <button
                  className="gradient-background"
                  onClick={prompt_question}
                >
                  Run
                </button>
              </div>
            </div>
          </div>
          <div
            className={styles["left-section"]}
            style={{ background: "#fff", overflowY: "scroll" }}
          >
            <Grid
              xs={6}
              sx={{ display: "flex", p: 1, borderBottom: "1px solid #D3D3EA" }}
              className="Engineered-Features"
            >
              <img src={fi_check} className={styles["EF-Img"]}></img>
              <h4 className={styles["EngFeatures"]}>Generated Result</h4>
            </Grid>

            <div className={styles["uploaddetails"]}>
              <div className={styles["answer"]}>
                {/* <ul>
                  {streamData.map((item, index) => (
                    <span key={index}>{item.text}</span>
                  ))}
                </ul> */}
                <Typewriter text={streamData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
