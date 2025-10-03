import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoxIcon from "src/assets/icons/box.svg?react";
import useInterval from "src/components/Elements/hooks/useInterval";
import DangerCircleIcon from "../../../../../assets/icons/dangercircle.svg?react";
import TickSquareIcon from "../../../../../assets/icons/ticksquare.svg?react";
import TickSquareCheckedIcon from "../../../../../assets/icons/ticksquarechecked.svg?react";
import GPT2Icon from "../../../../../assets/images/Models/gpt-2.png";
import {
  GetListExperiments,
  Models,
  Preprocess,
  Train,
  TrainTokenizer,
  UpdateConfig as UpdateConfigService,
  UpdateExp,
  getLLMProjectDetails,
} from "../../../../../services/Portals/LLMPortals";
import styles from "./LLMModelSelector.module.css";
import "../../../../../styles/liquidGlass.css";
export default function LLMModelSelector() {
  const { projectId, experimentId, taskType } = useParams();
  const navigate = useNavigate();
  const [modelsnew, setModelsnew] = useState([]);
  const [errorMesg, seterrorMesg] = useState();
  const [projectName, setProjectName] = useState("");
  const [Awq_quantization, setAwq_quantization] = useState();

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

  const fetchProjectName = () => {
    getLLMProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          setProjectName(res.data.proj_name);
        }
      })
      .catch((err) => {
        ////console.log(err);
      });
  };
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
  const [ErrorMesg, setErrorMesg] = useState("");
  const [selectedBit, setSelectedBit] = useState("");

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
    ////console.log(experimentData);
  }, []);

  useEffect(() => {
    if (getmodels) {
      Models("hugging-face").then((modelres) => {
        let filteredModels;
        if (taskType === "pretrain") {
          filteredModels = modelres.data["hugging-face"].filter(
            (item) => item.applies_to !== "finetune"
          );
        } else {
          filteredModels = modelres.data["hugging-face"];
        }
        setModelsnew(filteredModels);
      });
    }
  }, [getmodels]);

  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data[0]?.status === "FAILED") {
            setgetmodels(false);
            setIsPollingStatus(false);
            setShowLoader(false);
            seterrorMesg("Preprocessing failed please try again");
          }
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
        ////console.log(err);
      });
  };

  const handleChange = (event) => {
    setSelectedBit(event.target.value);
  };
  // ////console.log("Modelsnew", modelsnew);
  // ////console.log("experimentData", experimentData);
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
    batch_size: 1,
    context_length: 128,
    log_steps: 20,
    save_steps: 200,
    storage_location: `s3://mlflowcibi/admin@cibi.com/${experimentId}/models`,
    gpu_type: "A10G",
    n_gpus: 1,
    awq_quantization: false,
    openai_api_key: "",
    completions_only: true,
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
          ////console.log(err);
        });
    } else {
      updateConfigs("base_model", model);
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

  ////console.log("configs", configs);
  const triggerTraining = async () => {
    // navigate("status", { configs: configs })

    if (selectedBit === "") {
      seterrorMesg("Please select Target Model");

      return;
    }

    if (configs.base_model === "openai") {
      if (
        configs.openai_api_key === undefined ||
        configs.openai_api_key === ""
      ) {
        setErrorMesg("API KEY is required");
        return;
      }
    }
    setShowLoader(true);
    seterrorMesg();
    setLoadStatusText("Setting up...");
    // ////console.log("configsbase_mode", configs);

    if (configs.base_model != "bert") {
      if (configs.data_uri === null) {
        // ////console.log("configsbase_mode", configs);

        const preprocessSuccess = await preprocessData();
        // ////console.log("preprocessSuccess", preprocessSuccess);
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

    const modelName = projectName + experimentData.exp_name;
    const payload = {
      base_model: configs.base_model,
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
      awq_quantization: configs.awq_quantization,
      openai_api_key: configs.openai_api_key,
      completions_only: true,
    };

    //dummy

    UpdateConfigService(experimentId, "train", payload)
      .then((res) => {
        if (res.status == 200) {
          // ////console.log("UpdateConfigService", res.data);
          setLoadStatusText("Triggering Training...");

          Train(experimentId)
            .then((res) => {
              if (res.status == 200) {
                // ////console.log(res.data);
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
              ////console.log(err);
              setIsPollingStatus(false);
              setShowLoader(false);
              seterrorMesg("Training is stoping please try after sometime");
            });
        }
      })
      .catch((err) => {
        ////console.log(err);
      });
  };

  useEffect(() => {
    fetchProjectName();
  }, []);

  const handleToggle = (item) => {
    setExpandedName(expandedName === item.model_name ? null : item.model_name);
  };

  const expandfunction = (base_model, idx, available) => {
    seterrorMesg();
    if (!available) {
      return;
    }
    if (expandedName === base_model) {
      selectModel("", -1);
    } else {
      selectModel(base_model, idx);
    }
  };

  return (
    <Box sx={{
      padding: "24px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)"
    }}>
      <Box className="liquid-glass-card-neutral" sx={{
        mb: 4,
        p: 3,
        borderRadius: "20px",
        textAlign: "center"
      }}>
        <span className={styles["Selector-title"]}>
          <span className={styles["step"]}>Steps : 1/2</span>&nbsp;&nbsp;
          <span className={styles["tagline"]}>
            Choose the base model and fill it’s configuration
          </span>
        </span>
      </Box>
      <Grid container spacing={3} sx={{ justifyContent: "flex-start" }}>
        {modelsnew.length > 0 &&
          modelsnew.map((item, idx) => (
            <>
              <Grid
                xs={2.85}
                className={styles["Databaselist"]}
                key={item.model_name}
                sx={{
                  borderRadius: item.base_model === expandedName ? "5px" : "",
                  background:
                    item.base_model === expandedName ? "#ccc" : "#fff",
                }}
              >
                <div
                  className={`${styles["DB-Details"]} ${item.base_model === expandedName ? styles["DB-Details-Selected"] : ""} ${!item.available ? styles["DB-Details-Blur"] : ""} liquid-glass-list-item-premium`}
                  onClick={(e) =>
                    expandfunction(item.base_model, idx, item.available)
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

                    <div>
                      <p style={{ margin: "10px 5px" }}>
                        {item.model_name === "Penguin"
                          ? "Cibi"
                          : item.model_name}
                      </p>

                      <p style={{ margin: "0" }}>
                        {item.available ? (
                          ""
                        ) : (
                          <small style={{ margin: "5px" }}>
                            Comming Soon..
                          </small>
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      styles["chev-icon-ctn"] +
                      " " +
                      (expandedName === item.model_name
                        ? styles["expanded"]
                        : "")
                    }
                    onClick={() => handleToggle(item)}
                  >
                    {item.base_model === expandedName ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </span>
                </div>
              </Grid>

              {expandedIdx >= 0 &&
              Math.floor(expandedIdx / 4) >= Math.floor(idx / 4) &&
              expandedIdx <= idx &&
              ((idx + 1) % 4 == 0 || idx + 1 == modelsnew.length) ? (
                <Grid
                  container
                  xs={12}
                  columnGap={{ xs: "52px" }}
                  className={`${styles["expanded-ctn"]} liquid-glass-card-neutral`}
                  sx={{
                    borderRadius: "16px",
                    padding: "24px",
                    margin: "16px 0",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)"
                  }}
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
                      <Grid container>
                        <Grid xs={5.5} sx={{ ml: 2 }}>
                          <div className={styles["label"]}>
                            <span> Selected Model :</span>
                            <span style={{ color: "#000" }}>
                              <b>{expandedName.toUpperCase()}</b>
                            </span>
                          </div>
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
                                    inputProps={{
                                      "data-testid": "train_tokenizer_checkbox",
                                    }}
                                    onChange={(e) =>
                                      updateConfigs(
                                        "train_tokenizer",
                                        e.target.checked
                                      )
                                    }
                                    icon={
                                      <TickSquareIcon
                                        style={{
                                          height: "18px",
                                          width: "18px",
                                        }}
                                      />
                                    }
                                    checkedIcon={
                                      <TickSquareCheckedIcon
                                        style={{
                                          height: "18px",
                                          width: "18px",
                                        }}
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
                            ""
                          )}

                          {configs.base_model !== "openai" ? (
                            <div className={styles["field-ctn"]}>
                              <h4 style={{ borderBottom: "1px solid #ccc" }}>
                                <b>Model parameters</b>
                              </h4>
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
                          ) : (
                            ""
                          )}
                          <div className={styles["field-ctn"]}>
                            <div className={styles["label"]}>
                              <span>Epochs</span>
                              <DangerCircleIcon />
                            </div>
                            <div className={styles["input-field"]}>
                              <input
                                value={configs["epochs"]}
                                onChange={(e) =>
                                  updateConfigs(
                                    "epochs",
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

                          <div
                            className={styles["field-ctn"]}
                            style={{ display: "flex" }}
                          >
                            <div style={{ width: "100%", display: "flex" }}>
                              <div className={styles["label"]}>
                                <span>Target model</span>
                                <DangerCircleIcon />
                              </div>
                              <div style={{ margin: "0 10px" }}>
                                <input
                                  type="radio"
                                  value="4-bit"
                                  checked={selectedBit === "4-bit"}
                                  onChange={handleChange}
                                  style={{ width: "15px", height: "15px" }}
                                />
                              </div>
                              <span> 4-bit</span>
                              <div style={{ margin: "0 10px" }}>
                                <input
                                  type="radio"
                                  value="8-bit"
                                  checked={selectedBit === "8-bit"}
                                  onChange={handleChange}
                                  style={{ width: "15px", height: "15px" }}
                                />
                              </div>
                              <span> 8-bit</span>
                            </div>
                          </div>
                        </Grid>
                        <Grid xs={5.5} sx={{ ml: 2, mt: 2 }}>
                          {configs.base_model !== "openai" ? (
                            <>
                              <div className={styles["field-ctn"]}>
                                <h4 style={{ borderBottom: "1px solid #ccc" }}>
                                  <b>Infra parameters</b>
                                </h4>
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
                                      updateConfigs(
                                        "n_gpus",
                                        e.target.valueAsNumber
                                      );
                                    }}
                                    type="number"
                                    min={1}
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
                            </>
                          ) : (
                            ""
                          )}

                          {configs.base_model === "openai" ? (
                            <div className={styles["field-ctn"]}>
                              <div className={styles["label"]}>
                                <span>OpenAI API KEY</span>
                                <DangerCircleIcon />
                              </div>
                              <div className={styles["input-field"]}>
                                <input
                                  onChange={(e) => {
                                    setConfigs({
                                      ...configs,
                                      openai_api_key: e.target.value,
                                    });
                                  }}
                                  type="text"
                                  placeholder="OpenAI API KEY"
                                />
                              </div>
                              <span style={{ color: "red" }}>{ErrorMesg}</span>
                            </div>
                          ) : (
                            ""
                          )}

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
                      </Grid>
                    </>
                  )}
                </Grid>
              ) : null}
            </>
          ))}
      </Grid>
    </Box>
  );
}
