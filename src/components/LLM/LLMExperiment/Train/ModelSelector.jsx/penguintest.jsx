import { useState, useEffect, useRef } from "react";
import useInterval from "src/components/Elements/hooks/useInterval";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import styles from "./LLMModelSelector.module.css";
import {
  GetListExperiments,
  Preprocess,
  Train,
  TrainTokenizer,
  UpdateConfig as UpdateConfigService,
  UpdateExp,
  Models,
} from "../../../../../services/Portals/LLMPortals";
import ChevronDownIcon from "../../../../../assets/icons/chevrondown.svg?react";
import DangerCircleIcon from "../../../../../assets/icons/dangercircle.svg?react";
import GPT2Icon from "../../../../../assets/images/Models/gpt-2.png";
import TickSquareIcon from "../../../../../assets/icons/ticksquare.svg?react";
import TickSquareCheckedIcon from "../../../../../assets/icons/ticksquarechecked.svg?react";
import BoxIcon from "src/assets/icons/box.svg?react";
import Alert from "@mui/material/Alert";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function LLMModelSelector() {
  const { projectId, experimentId, taskType } = useParams();
  const navigate = useNavigate();
  const [modelsnew, setModelsnew] = useState([]);
  const [errorMesg, seterrorMesg] = useState();
  const [models, setModels] = useState([
    {
      name: "gpt2",
      display_text: "GPT-2",
    },
    {
      name: "phi-1_5",
      display_text: "Microsoft PHI-1.5",
    },
    {
      name: "phi-2",
      display_text: "Microsoft PHI-2",
    },
    {
      name: "Mistral",
      display_text: "Mistral",
    },
    {
      name: "t5",
      display_text: "T5",
    },
    {
      name: "bert",
      display_text: "Bert",
    },
  ]);

  const [experimentData, setExperimentData] = useState({});
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(2000);
  const [experimentList, setexperimentList] = useState([]);
  const [expandedName, setExpandedName] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showConfigLoader, setShowConfigLoader] = useState(false);
  const [loadStatusText, setLoadStatusText] = useState("");
  const experimentStatus = useRef("");
  const [BaseModel, setBaseModel] = useState();
  const [DataURI, setDataURI] = useState();
  const [getmodels, setgetmodels] = useState(false);

  const processedInput = useRef("");
  useInterval(
    () => {
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  useEffect(() => {
    experimentStatus.current = experimentData.status;
    if (experimentData.status == "PREPROCESSED") {
      processedInput.current = experimentData.preprocessed_input;
    }
  }, [experimentData]);

  useEffect(() => {
    fetchExperimentData();
  }, []);

  useEffect(() => {
    if (getmodels) {
      console.log("experimentData", experimentData);
      if (
        experimentData.status === "PREPROCESSED" ||
        experimentData.status === "CREATED"
      ) {
        if (experimentData.hasOwnProperty("data_config")) {
          if (
            experimentData.data_config.input.endsWith(".csv") ||
            experimentData.data_config.input.endsWith(".parquet")
          ) {
            Models("hugging-face").then((modelres) => {
              console.log("modelres", modelres);
              const filteredModels = modelres.data["hugging-face"].filter(
                (item) =>
                  item.model_name !== "t5-small" &&
                  item.model_name !== "bert-base-uncased"
              );

              setModelsnew(filteredModels);
            });
            return;
          }
        } else if (experimentData.hasOwnProperty("train_config")) {
          Models("hugging-face").then((modelres) => {
            if (taskType === "pretrain") {
              console.log("modelres", modelres);
              const filteredModels = modelres.data["hugging-face"].filter(
                (item) => item.model_name !== "Penguin"
              );
              console.log("pretrain", filteredModels);
              setModelsnew(filteredModels);
            }else{
              const filteredModels = modelres.data["hugging-face"].filter(
                (item) =>
                  item.model_name !== "t5-small" &&
                  item.model_name !== "bert-base-uncased" &&
                  item.model_name !== "Penguin" &&
                  item.model_name !== "Llama 2 - 7B"
              );
              setModelsnew(filteredModels);
            }
            //setModelsnew(modelres.data["hugging-face"]);
          });
        }
      }

      if (
        experimentData.status === "PREPARED" ||
        experimentData.status === "CREATED"
      ) {
        if (experimentData.hasOwnProperty("data_config")) {
          //console.log("ok");
          if (
            !experimentData.data_config.input.endsWith(".csv") ||
            !experimentData.data_config.input.endsWith(".parquet")
          ) {
            Models("hugging-face").then((modelres) => {
              console.log("modelres", modelres);
              const filteredModels = modelres.data["hugging-face"].filter(
                (item) =>
                  item.model_name !== "t5-small" &&
                  item.model_name !== "bert-base-uncased" &&
                  item.model_name !== "Penguin" &&
                  item.model_name !== "Llama 2 - 7B"
              );
              if (taskType === "pretrain") {
                console.log("modelres", modelres);
                const filteredModels = modelres.data["hugging-face"].filter(
                  (item) => item.model_name !== "Penguin"
                );
                console.log("pretrain", filteredModels);
                setModelsnew(filteredModels);
              }else{
                setModelsnew(filteredModels);
              }
              

            });
          }
        }
      }
    }
  }, [getmodels]);
  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setgetmodels(true);
          setExperimentData(res.data[0]);
          setBaseModel(res.data[0].train_config.base_model);

          setConfigs({
            ...configs,
            ...res.data[0].train_config,
            save_steps: 200,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log("Modelsnew", modelsnew);
  // console.log("experimentData", experimentData);
  const ModelImages = {
    gpt2: <img src={GPT2Icon} height="36px" width="36px" alt="GPT2" />,
  };
  const [expandedIdx, setExpandedIdx] = useState(-1);

  const [configs, setConfigs] = useState({
    base_model: "gpt2",
    data_uri: null,
    train_tokenizer: false,
    model_uri: null,
    type: taskType == "pretrain" ? "pretrain" : "sft",
    vocab_size: 5000,
    epochs: 1,
    batch_size: 96,
    context_length: 128,
    log_steps: 20,
    save_steps: 200,
    storage_location:
      "s3://mlflowcibi/admin@cibi.com/" + experimentId + "/models",
    gpu_type: "A10G",
    n_gpus: 1,
    // approx_cost:null,
  });
  const updateConfigs = (key, value) => {
    setConfigs({ ...configs, ...{ [key]: value } });
  };

  const selectModel = (model, idx) => {
    setExpandedIdx(idx);
    setExpandedName(model);
    if (models[idx]?.expid) {
      setShowConfigLoader(true);
      GetListExperiments("", models[idx].expid)
        .then((res) => {
          setConfigs({
            ...configs,
            ...res.data[0].train_config,
            model_uri: "s3://" + res.data[0].model_uri,
          });
          setShowConfigLoader(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      updateConfigs("base_model", "gpt2");
    }
  };

  const isReady = async (WAIT_STATUS) => {
    while (true) {
      if (experimentStatus.current == WAIT_STATUS) {
        return true;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  };

  const preprocessData = async () => {
    seterrorMesg();

    try {
      await UpdateExp(experimentId, "PREPARED");
    } catch (err) {
      setShowLoader(false);
      seterrorMesg("Update Experiment failed please try again");
      return false;
    }

    try {
      const updateConfigRes = await UpdateConfigService(experimentId, "data", {
        base_model: configs.base_model,
      });
    } catch (error) {
      setShowLoader(false);
      seterrorMesg("Update Config failed please try again");
      return false;
    }

    try {
      const preprocessRes = await Preprocess(experimentId);
    } catch (error) {
      setShowLoader(false);
      seterrorMesg("Preprocessing failed please try again");
      return;
    }

    setIsPollingStatus(true);
    setLoadStatusText("Preprocessing Data...");
    setShowLoader(true);
    await isReady("PREPROCESSED");
    setIsPollingStatus(false);
    // setLoadStatusText("");
    // setShowLoader(false);
    updateConfigs("data_uri", processedInput.current);
    return true;
  };
  const triggerTraining = async () => {
    // navigate("status", { configs: configs })
    setShowLoader(true);
    seterrorMesg();
    setLoadStatusText("Setting up...");
    // console.log("configsbase_mode", configs);

    if (configs.base_model != "bert") {
      if (configs.data_uri === null) {
        //console.log("configsbase_mode", configs);

        const preprocessSuccess = await preprocessData();
        console.log("preprocessSuccess", preprocessSuccess);
        if (!preprocessSuccess) {
          setShowLoader(false);
          return;
        }
      }
    }

    if (configs.data_uri === null) {
      await UpdateExp(experimentId, "PREPARED");
    }
    setIsPollingStatus(true);
    await isReady("PREPROCESSED");
    setIsPollingStatus(false);
    if (configs.train_tokenizer) {
      setLoadStatusText("Training Tokenizer...");
      setShowLoader(true);
      const tokenizer_payload = {
        data_uri: configs.data_uri || processedInput.current,
        vocab_size: configs.vocab_size,
        base_model: configs.base_model,
      };

      try {
        const update_tokenizer_res = await UpdateConfigService(
          experimentId,
          "tokenizer",
          tokenizer_payload
        );
      } catch (error) {
        setShowLoader(false);
        seterrorMesg("Update config service failed please try again");
        return;
      }

      setIsPollingStatus(true);

      try {
        const train_tokenizer_res = await TrainTokenizer(experimentId);
      } catch (error) {
        setShowLoader(false);
        seterrorMesg("Tokenizer failed please try again");
        return;
      }

      await isReady("PREPROCESSED");
      setIsPollingStatus(false);
      setLoadStatusText("Preparing for training...");
    }
    const payload = {
      base_model: "gpt2",
      data_uri: configs.data_uri || processedInput.current,
      model_uri: configs.model_uri,
      data_parellel: configs.data_parellel,
      type: configs.type,
      epochs: configs.epochs,
      batch_size: configs.batch_size,
      context_length: configs.context_length,
      log_steps: configs.log_steps,
      save_steps: configs.save_steps,
      storage_location: configs.storage_location,
      scaling_config: { n_gpus: configs.n_gpus },
      peft_config: {},
    };
    UpdateConfigService(experimentId, "train", payload)
      .then((res) => {
        if (res.status == 200) {
          console.log("UpdateConfigService", res.data);
          setLoadStatusText("Triggering Training...");
          Train(experimentId)
            .then((res) => {
              if (res.status == 200) {
                console.log(res.data);
                UpdateExp(experimentId, "PREPARED").then(async (res) => {
                  if (res.status == 200) {
                    setIsPollingStatus(true);
                    await isReady("PREPARED");
                    setShowLoader(false);
                    setIsPollingStatus(false);
                    navigate("status", { configs: configs });
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err);
              setIsPollingStatus(false);
              setShowLoader(false);
              seterrorMesg("Training is stoping please try after sometime");
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   GetListExperiments(projectId, "").then((expres) => {
  //     if (expres.status === 200) {
  //       setexperimentList(expres.data);
  //       setModelsnew(
  //         models.concat(
  //           expres.data
  //             .filter((item) => item.status == "TRAINED")
  //             .map((item) => ({
  //               name: item.exp_name,
  //               base_model: item.train_config.base_model,
  //               display_text: item.exp_name,
  //               expid: item.exp_id,
  //               config_req: 0,
  //             }))
  //         )
  //       );
  //     }
  //   });
  // }, []);

  return (
    <>
      <Box style={{ margin: "18px 0px" }}>
        <span className={styles["Selector-title"]}>
          <span className={styles["step"]}>Steps : 1/2</span>&nbsp;&nbsp;
          <span className={styles["tagline"]}>
            Choose the base model and fill it’s configuration
          </span>
        </span>
      </Box>
      <Grid container style={{ justifyContent: "flex-start" }} gap={"20px"}>
        {modelsnew.length > 0 &&
          modelsnew.map((item, idx) => (
            <>
              {experimentData.status === "PREPROCESSED" && BaseModel ? (
                <Grid
                  xs={2.85}
                  className={styles["Databaselist"]}
                  key={item.model_name}
                >
                  <div
                    className={styles["DB-Details"]}
                    onClick={
                      expandedName === item.model_name
                        ? () => {
                            selectModel("", -1);
                          }
                        : () => {
                            selectModel(item.model_name, idx);
                          }
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "58px",
                          height: "58px",
                          borderRadius: "6px",
                          background: "#EEEEF8",
                        }}
                      >
                        {item.model_name in ModelImages ? (
                          ModelImages[item.model_name]
                        ) : (
                          <BoxIcon
                            style={{
                              height: "36px",
                              width: "36px",
                              color: "#8D8DAC",
                            }}
                          />
                        )}
                      </div>
                      <p>{item.model_name}</p>
                    </div>

                    <span
                      className={
                        styles["chev-icon-ctn"] +
                        " " +
                        (expandedName == item.model_name
                          ? styles["expanded"]
                          : "")
                      }
                    >
                      <ChevronDownIcon className={styles["arrow"]} />
                    </span>
                  </div>
                </Grid>
              ) : (
                <Grid
                  xs={2.85}
                  className={styles["Databaselist"]}
                  key={item.model_name}
                >
                  <div
                    className={
                      styles["DB-Details"] +
                      " " +
                      (expandedName === item.model_name
                        ? styles["DB-Details-Selected"]
                        : "")
                    }
                    onClick={
                      expandedName === item.model_name
                        ? () => {
                            selectModel("", -1);
                          }
                        : () => {
                            selectModel(item.model_name, idx);
                          }
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "58px",
                          height: "58px",
                          borderRadius: "6px",
                          background: "#EEEEF8",
                        }}
                      >
                        {item.model_name in ModelImages ? (
                          ModelImages[item.model_name]
                        ) : (
                          <BoxIcon
                            style={{
                              height: "36px",
                              width: "36px",
                              color: "#8D8DAC",
                            }}
                          />
                        )}
                      </div>
                      <p>{item.model_name}</p>
                    </div>

                    <span
                      className={
                        styles["chev-icon-ctn"] +
                        " " +
                        (expandedName == item.model_name
                          ? styles["expanded"]
                          : "")
                      }
                    >
                      <ChevronDownIcon className={styles["arrow"]} />
                    </span>
                  </div>
                </Grid>
              )}
              {expandedIdx >= 0 &&
              Math.floor(expandedIdx / 4) >= Math.floor(idx / 4) &&
              expandedIdx <= idx &&
              ((idx + 1) % 4 == 0 || idx + 1 == modelsnew.length) ? (
                <Grid
                  container
                  xs={12}
                  columnGap={{ xs: "72px" }}
                  className={styles["expanded-ctn"]}
                >
                  {showConfigLoader ? (
                    <CircularProgress
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "black",
                        marginLeft: "5px",
                      }}
                      className={styles["progress"]}
                    ></CircularProgress>
                  ) : (
                    <>
                      <Grid container xs style={{ gap: "14px" }}>
                        {taskType == "pretrain" ? (
                          <>
                            <div className={styles["field-ctn"]}>
                              <div className={styles["label"]}>
                                <Checkbox
                                  checked={configs["train_tokenizer"]}
                                  style={{
                                    height: "20px",
                                    padding: "0 8px 0 0",
                                  }}
                                  onChange={(e) =>
                                    updateConfigs(
                                      "train_tokenizer",
                                      e.target.checked
                                    )
                                  }
                                  icon={
                                    <TickSquareIcon
                                      style={{ height: "18px", width: "18px" }}
                                    />
                                  }
                                  checkedIcon={
                                    <TickSquareCheckedIcon
                                      style={{ height: "18px", width: "18px" }}
                                    />
                                  }
                                />
                                <span>Train Tokenizer</span>
                                <DangerCircleIcon />
                              </div>
                            </div>
                            <div
                              className={
                                styles["field-ctn"] +
                                " " +
                                (!configs["train_tokenizer"]
                                  ? styles["disabled"]
                                  : "")
                              }
                            >
                              <div className={styles["label"]}>
                                <span>Vocab Size</span>
                                <DangerCircleIcon />
                              </div>
                              <div className={styles["input-field"]}>
                                <input
                                  disabled={!configs["train_tokenizer"]}
                                  value={configs["vocab_size"]}
                                  onChange={(e) =>
                                    updateConfigs(
                                      "vocab_size",
                                      e.target.valueAsNumber
                                    )
                                  }
                                  type="number"
                                  min={0}
                                  placeholder="5000"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            className={
                              styles["field-ctn"] + " " + styles["disabled"]
                            }
                          >
                            {/* <div className={styles["label"]}>
                              <span>Base Model</span>
                              <DangerCircleIcon />
                            </div>
                            <div className={styles["input-field"]}>
                              <input
                                disabled={true}
                                value={configs["base_model"]}
                              />
                            </div> */}
                          </div>
                        )}
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>Context Length</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <input
                              value={configs["context_length"]}
                              onChange={(e) =>
                                updateConfigs(
                                  "context_length",
                                  e.target.valueAsNumber
                                )
                              }
                              type="number"
                              min={0}
                              placeholder="Enter Value"
                            />
                          </div>
                        </div>
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>Epochs</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <input
                              value={configs["epochs"]}
                              onChange={(e) =>
                                updateConfigs("epochs", e.target.valueAsNumber)
                              }
                              type="number"
                              min={0}
                              placeholder="Enter Value"
                            />
                          </div>
                        </div>
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>Batch Size</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <input
                              value={configs["batch_size"]}
                              onChange={(e) =>
                                updateConfigs(
                                  "batch_size",
                                  e.target.valueAsNumber
                                )
                              }
                              type="number"
                              min={0}
                              placeholder="Enter Value"
                            />
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        container
                        xs
                        style={{ gap: "14px", alignContent: "flex-end" }}
                      >
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>GPU Type</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <Select
                              value={configs["gpu_type"]}
                              onChange={(e) =>
                                updateConfigs("gpu_type", e.target.value)
                              }
                              sx={{
                                width: "100%",
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                "& .MuiSelect-select": {
                                  padding: "0px",
                                },
                              }}
                            >
                              <MenuItem value="">Select type</MenuItem>
                              <MenuItem value="A10G">A10G</MenuItem>
                            </Select>
                          </div>
                        </div>
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>Number of GPU</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <input
                              value={configs["n_gpus"]}
                              onChange={(e) => {
                                if (e.target.value > 5) {
                                  return;
                                }
                                updateConfigs("n_gpus", e.target.valueAsNumber);
                              }}
                              type="number"
                              min={0}
                              placeholder="Enter Value"
                            />
                          </div>
                        </div>
                        <div className={styles["field-ctn"]}>
                          <div className={styles["label"]}>
                            <span>Approximate Cost/hr($)</span>
                            <DangerCircleIcon />
                          </div>
                          <div className={styles["input-field"]}>
                            <input
                              value={configs["n_gpus"] * 1.0}
                              disabled
                              onChange={(e) => {
                                setConfigs({
                                  ...configs,
                                  approx_cost: e.target.value,
                                });
                              }}
                              type="number"
                              step="0.01"
                              min={0}
                              placeholder="Approximate Cost"
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            height: "61px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {showLoader ? (
                            <div
                              style={{ marginRight: "30px" }}
                              className={styles["blinker"]}
                            >
                              {loadStatusText}
                            </div>
                          ) : null}
                          <button
                            style={{ padding: "0px 23px", height: "44px" }}
                            className="gradient-background"
                            onClick={triggerTraining}
                            disabled={showLoader}
                          >
                            Train
                            {showLoader ? (
                              <CircularProgress
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  color: "white",
                                  marginLeft: "5px",
                                }}
                                className={styles["progress"]}
                              ></CircularProgress>
                            ) : null}
                          </button>
                        </div>
                        {errorMesg && (
                          <center>
                            <span style={{ color: "red" }}>
                              <Alert severity="error">{errorMesg}</Alert>
                            </span>
                          </center>
                        )}
                      </Grid>
                    </>
                  )}
                </Grid>
              ) : null}
            </>
          ))}
      </Grid>
    </>
  );
}
