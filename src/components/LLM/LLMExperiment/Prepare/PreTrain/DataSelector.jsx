import React, { useState, useEffect, useRef } from "react";

import styles from "./PreTrain.module.css";
import { Grid, Card, CircularProgress } from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

import Document from "../../../../../assets/images/Document.svg";
import useInterval from "src/components/Elements/hooks/useInterval";

import {
  Preprocess,
  GetDataPreview,
  GetListExperiments,
  UpdateConfig,
  UpdateExp,
} from "src/services/Portals/LLMPortals";

import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

export default function DataSelector() {
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const { taskType } = useParams();
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState();
  const [errorMesg, seterrorMesg] = useState();
  const [s3input, sets3input] = useState(true);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(2000);
  const [loader, setloader] = useState(false);
  const [selectDatashow, setselectDatashow] = useState(true);
  const [TargetColumn, setTargetColumn] = useState();
  const [previewData, setpreviewData] = useState([]);
  const [GetdataAPI, setGetdataAPI] = useState(true);
  const [Preprocessing, setPreprocessing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [NextBnt, setNextBnt] = useState(false);

  const [s3Location, setS3Location] = useState();

  const navigate = useNavigate();

  const Datapreview = () => {
    seterrorMesg();
    GetDataPreview(experimentId, "")
      .then((DataRes) => {
        if (DataRes.status === 200) {
          const keys = DataRes.data.flatMap((obj) => Object.keys(obj));
          const uniqueKeys = [...new Set(keys)];
          setpreviewData(uniqueKeys);
          setShowLoader(false);
          setselectDatashow(true);
          setloader(false);
        }
      })
      .catch((err) => {
        setloader(false);
        seterrorMesg("Data Preview failed please try again");
      });
  };

  const TargetColumnSubmit = async () => {
    setShowLoader(true);
    seterrorMesg();
    const data = {
      text: TargetColumn,
    };
    await UpdateExp(experimentId, "PREPARED")
      .then((res) => {
        if (res.status === 200) {
          UpdateConfig(experimentId, "data", data)
            .then((res) => {
              if (res.status === 200) {
                navigate(
                  `/llm/${projectId}/Experiment/${experimentId}/pretrain/train`
                );
              }
            })
            .catch((err) => {
              setShowLoader(false);
              seterrorMesg("Target Column failed please try again");
            });
        } 
      })
      .catch((err) => {
        setShowLoader(false);
        seterrorMesg("Experiment Update failed please try again");
        return;
      });
  };

  const fetchPreprocessing = () => {
    Preprocess(experimentId)
      .then((res) => {
        // console.log("preprocessing", res);
        if (res.status === 200) {
          setIsPollingStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
        seterrorMesg("Pre-processing failed please try again");
      });
  };

  useEffect(() => {
    if (Preprocessing) {
      fetchPreprocessing();
    }
  }, [Preprocessing]);

  useEffect(() => {
    Datapreview();
  }, [GetdataAPI]);

  useEffect(() => {
    if (fileData) {
      // UploadFileToBucket();
    }
  }, [fileData]);

  useInterval(
    () => {
      //console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );
  const fetchExperimentData = async () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          console.log("exp-status", res.data[0].status);
          if (res.data[0].status === "FAILED") {
            seterrorMesg("Experiment failed");
            setShowLoader(false);
            setIsPollingStatus(false);
          }
          if (res.data[0].status === "PREPROCESSED") {
            const data = {
              data_uri: res.data[0].preprocessed_input,
            };
            UpdateConfig(experimentId, "train", data)
              .then((res) => {
                console.log("UpdataTrain", res);
                if (res.status === 200) {
                  setPreprocessing(true);
                  setIsPollingStatus(false);
                  navigate(
                    `/llm/${projectId}/Experiment/${experimentId}/pretrain/train`
                  );
                }
              })
              .catch((err) => {
                setloader(false);
                setIsPollingStatus(false);
                seterrorMesg("Update train failed please try again");
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className={styles["UploadSection"]}>
        <Grid container>
          <div className={styles["page-caption"]}>
            <span className={styles["tagline"]}>
              Upload the supported files
            </span>
          </div>
        </Grid>

        <div className={styles["section"]}>
          <div
            className={styles["left-section"]}
            style={{ background: "#fff" }}
          >
            <div className={styles["uploadtitle"]}>
              <h4>Upload Data</h4>
            </div>

            <div className={styles["supportfile"]}>Text Column</div>
            <div className={styles["s3input"]}>
              <select
                onChange={(e) => {
                  setTargetColumn(e.target.value);
                  setNextBnt(true);
                }}
                style={{ textTransform: "capitalize" }}
              >
                {previewData.map((item) => (
                  <>
                    <option value={item}>{item}</option>
                  </>
                ))}
              </select>
            </div>
            {errorMesg && (
              <center>
                <span style={{ color: "red" }}>
                  <Alert severity="error">{errorMesg}</Alert>
                </span>
              </center>
            )}

            <div className={styles["target-bnt"]}>
              <div>
                {loader ? (
                  <CircularProgress
                    className={styles["progress"]}
                  ></CircularProgress>
                ) : null}
              </div>
              <button
                className={styles["cancelbnt"]}
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={TargetColumnSubmit}
                className="gradient-background"
                disabled={NextBnt ? false : true}
              >
                Next
                <CircularProgress
                  size={20}
                  style={{
                    display: showLoader ? "block" : "none",
                    color: "white",
                  }}
                />
              </button>
            </div>
          </div>
          {/* <div
            className={styles["left-section"]}
            style={{ background: "#EEEEF8" }}
          >
            <Grid
              xs={6}
              sx={{ display: "flex", p: 1, borderBottom: "1px solid #D3D3EA" }}
              className="Engineered-Features"
            >
              <img src={Document} className={styles["EF-Img"]}></img>
              <h4 className={styles["EngFeatures"]}>
                Guidelines on 'Creating the training data'
              </h4>
            </Grid>

            <div className={styles["uploaddetails"]}>
              <h2>Title 01</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <h2>Title 02</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <h2>Title 03</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
