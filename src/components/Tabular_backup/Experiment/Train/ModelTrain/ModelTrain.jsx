import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Box, Tabs, Tab, TextField, InputAdornment, FormControl, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, StyledEngineProvider, Alert } from '@mui/material';
import TabPanel from '../../../../Elements/TabPanel';
import SearchIcon from "../../../../../assets/icons/search.svg?react";
import { GetExpDataSet, GetDataPreview, UpdateConfig,Train, GetAnomaliesPct, GetListExperiments  } from '../../../../../services/Portals/MLopsPortals';
import styles from "./ModelTrain.module.css";
import ChevronDownIcon from "../../../../../assets/icons/chevrondown.svg?react";
import TickSquareIcon from "../../../../../assets/icons/ticksquare.svg?react";
import TickSquareCheckedIcon from "../../../../../assets/icons/ticksquarechecked.svg?react";
import CibiSmallIcon from "../../../../../assets/icons/cibismall.svg?react";
import TrainDashboard from '../TrainDashboard/TrainDashboard';
export default function ModelTrain() {
    const { modelType, experimentId } = useParams();
    const navigate = useNavigate();
    const [predictOptions, setPredictOptions] = useState({});
    const [ignoreOptions, setIgnoreOptions] = useState({});
    const [model, setModel] = useState("lgbm");
    const [tabValue, setTabValue] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [columns, setColumns] = useState([]);
    const [earlyStopping, setEarlyStopping] = useState(5);
    const [minFrequency, setMinFrequency] = useState(0.05);
    const [anomalycheck, setAnomalycheck] = useState(false);
    const [indexOptions, setindexOptions] = useState("None");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDashboard , setShowDashboard] = useState(false);
    const [pollStatus, setPollStatus] = useState(true);
    const [isDq, setisDq] = useState(false);
    const [modelRunMsg, setModelRunMsg] = useState("");
    const [train_config_data, setTrain_config_data] = useState({});
    const [expstatus, setExpStatus] = useState("AD_DONE");
    const [inputFileUrl,setInputFileUrl] = useState("");
    const [enableCreatePredictButton, setEnableCreatePredictButton] = useState(false);
    useEffect(() => {
        GetListExperiments("", experimentId).then((res) => {
            if (res.status === 200 && res.data[0]?.train_config) {
                setTrain_config_data(res.data[0].train_config.data);
                const expstatus = res.data[0].status;
                setExpStatus(res.data[0].status);
                if (res.data[0].train_config.data) {
                    const temp = { ...ignoreOptions};
                    if (res.data[0].train_config.data.ignore) {
                        res.data[0].train_config.data.ignore.forEach((obj) => {
                            temp[obj] = true;
                        });
                    }
                    setIgnoreOptions(temp);
                    const temp2 = {...predictOptions};
                    if (typeof res.data[0].train_config.data.target === "string"){
                        temp2[res.data[0].train_config.data.target] = true;
                    }
                    else if(res.data[0].train_config.data.target){
                        res.data[0].train_config.data.target.forEach((obj) => {
                            temp2[obj] = true;
                        });
                    }
                    setPredictOptions(temp2);
                    setindexOptions(res.data[0].train_config.data.target);

                    if (
                        res.data[0].train_config.data.target &&
                        (expstatus === "TRAINED" || expstatus === "DEPLOYED")
                    ) {
                        setShowDashboard(true);
                        setModelRunMsg("TRAINED")
                        navigate("result",{replace:true});
                    } else {
                        setShowDashboard(false);
                    }
                }
            }
        });
      }, [experimentId]);
    
    const getColumns = () => {
        GetExpDataSet(experimentId).then((res) => {
            if (res.status === 200) {
                setInputFileUrl(res.data.url);
                GetDataPreview(res.data.url).then(res2 => {
                    if (res2.status === 200) {
                        // console.log(Object.keys(JSON.parse(res2.data.sample_data)))
                        setColumns(Object.keys(JSON.parse(res2.data.sample_data)));
                    }
                });

            };
        });
    };

    const handleChangePredict = (e) => {
        const temp = { ...predictOptions}
        if (e.target.checked) {
            temp[e.target.value] = true;
        } else {
            delete temp[e.target.value];
        }
        setPredictOptions(temp);
        if (Object.keys(temp).length > 1) {
            setModel("auto");
        }
    };

    const handleChangeIgnore = (e, optionValue) => {
        const temp = { ...ignoreOptions}
        if (e.target.checked) {
            temp[e.target.value] = true;
        } else {
            delete temp[e.target.value];
        }
        setIgnoreOptions(temp);
      };

    useEffect(() => {
        getColumns();
    }, [experimentId]);

    const handleChangeIndex = (e) => {
        setindexOptions(e.target.value);
    };
    useEffect(() => {
        const temp = columns.filter((option) =>
            option.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOptions(temp);
    }, [searchQuery, columns]);

    useEffect(() => {
        setEnableCreatePredictButton(
            Object.keys(predictOptions).length > 0
            && Object.keys(ignoreOptions).length > 0
            )
    },[ignoreOptions,predictOptions])

    useEffect(() => {
        if (isDq) {
          let dQstatus = ["AD_DONE", "TRAINING", "TRAINED", "DEPLOYED"];
          let interval = null;
          if (pollStatus) {
            interval = setInterval(async () => {
              GetListExperiments("", experimentId)
                .then((res) => {
                  if (res.status === 200) {
                    setExpStatus(res.data[0].status);
                    if (dQstatus.includes(res?.data[0]?.status)) {
                      setPollStatus(false);
                      console.log("commit anomalies");
                      // get Anomaly percentage
                      GetAnomaliesPct(experimentId)
                        .then((res) => {
                          if (res.status === 200) {
                            setAnomalyPercentage(res.data); //set to local storage
                            TrainModel(false); //call with dq as false
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }, 5000);
          } else {
            clearInterval(interval);
          }
          return () => clearInterval(interval);
        } else {
          let interval = null;
          if (pollStatus) {
            interval = setInterval(async () => {
              GetListExperiments("", experimentId)
                .then((res) => {
                  if (res.status === 200) {
                    if (res?.data[0]?.status === "TRAINING") {
                      setModelRunMsg("Training..")
                    }
                    if (res?.data[0]?.status === "TRAINED") {
                        setModelRunMsg(res.data[0].status);
                        setExpStatus(res.data[0].status);
                        setPollStatus(false);
                        setShowDashboard(true);
                        navigate("result",{replace:true});
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }, 5000);
          } else {
            clearInterval(interval);
          }
          return () => clearInterval(interval);
        }
      }, [pollStatus]);

    const TrainModel = (is_dq) => {
        // Train with Anomaly detection flag set to true ex: is_dq= true
        // Train without Anomaly detection flag set to false ex: is_dq=false
        Train(experimentId, is_dq)
          .then((res) => {
            if (res.status === 200) {
              setisDq(is_dq);
              setPollStatus(true);
              if (is_dq === true) {
                setModelRunMsg("Detecting Anomalies");
              } else {
                setModelRunMsg("Setting up the Experiment");
              }
              setShowDashboard(true);
              navigate("result",{replace:true});
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
    
    const createPredictionModel =  () => {
        let selectedPredictOptions = [];
        let selectedIgnoreOptions = [];
        Object.keys(predictOptions).forEach((key) => {
            if (predictOptions[key]) {
                selectedPredictOptions.push(key);
            }
        });
        Object.keys(ignoreOptions).forEach((key) => {
            if (ignoreOptions[key]) {
                selectedIgnoreOptions.push(key);
            }
        });    
        let formData = {
          data: {
            input: inputFileUrl,
            target:
              selectedPredictOptions.length === 1 ? selectedPredictOptions[0] : selectedPredictOptions,
            ignore: selectedIgnoreOptions,
            test_split: {
              ratio: 0.8,
            },
            index_column: indexOptions,
          },
          model: {
            backend: model,
            explain: true,
            type: modelType,
            early_stopping: earlyStopping,
            min_frequency: minFrequency,
          },
        };
        UpdateConfig(experimentId, "train", formData)
          .then((res) => {
            if (res.status === 200) {
              //   setIsLoading(true);
              if (anomalycheck) {
                TrainModel(true);
              } else {
                TrainModel(false);
              } //with dq as true
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
    

    return ( 
        <>
            <div className={styles["page-title"]}>
                Predict
            </div>
            <div className={styles["page-container"]}>
                <div className={styles["left-ctn"]}>
                    <div className={styles["field-ctn"]}>
                        <span className={styles["field-label"]}>Select Model</span>
                        <div className={styles["field"]}>
                            <FormControl fullWidth size="small">
                                <Select
                                        placeholder="StageWeight"
                                        // variant="outlined"
                                        name="StageWeight"
                                        disabled={Object.keys(predictOptions).length > 1}
                                        onChange={(e) => setModel(e.target.value)}
                                        value={model}
                                        style={{
                                            padding:"0px",
                                            color:" #1F1F29",
                                            fontWeight: 400,
                                            fontSize: "14px",
                                            fontFamily: 'Plus Jakarta Sans'
                                        }}
                                        IconComponent={ChevronDownIcon}
                                    >
                                    <MenuItem value="lgbm">LightGBM</MenuItem>
                                    <MenuItem value="xgb">XGBoost</MenuItem>
                                    <MenuItem value="auto">Auto</MenuItem>
                                </Select>
                            </FormControl>   
                        </div>
                    </div>
                    <div className={styles["field-ctn"]}>
                        <span className={styles["field-label"]}>Predict Fields</span>
                        <span className={styles["field-sublabel"]}>Select which numerical or categorical fields to predict and optionally ignore</span>
                        <div className={styles["field"]} style={{padding:"10px"}}>
                            <Tabs
                                value={tabValue}
                                onChange={(e,val) => { setTabValue(val) }}
                                aria-label="basic tabs example"
                                className={styles["tabs"]}
                            >
                                <Tab className={tabValue==1 ? styles["tab-selected"] : styles["tab"] } label="Predict" value={1} />
                                <Tab className={tabValue==2 ? styles["tab-selected"] : styles["tab"] } label="Ignore" value={2} />
                            </Tabs>
                            <FormControl fullWidth>
                               <div style={{border: "1px solid  #D3D3EA", borderRadius:"6px"}}>
                                        <TextField
                                            id="search"
                                            type="search"
                                            fullWidth
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            size="small"
                                            placeholder="Search"
                                            style={{color:"#1F1F2",fontSize: "14px"}}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                               </div>
                            </FormControl>
                            <TabPanel value={tabValue} index={1} style={{width:"-webkit-fill-available"}}>
                                <div className={styles["column-list-ctn"]}>
                                    {filteredOptions.map((obj, dx) => {
                                        return (
                                            <FormGroup
                                                className={styles["column-list-item"]}
                                                key={dx}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            sx={{padding:"2px"}}
                                                            icon={<TickSquareIcon style={{height:"24px", width:"24px"}}/>}
                                                            checkedIcon={<TickSquareCheckedIcon style={{height:"24px", width:"24px",color:"#5420E8"}}/>}
                                                            value={obj}
                                                            checked={predictOptions[obj] && predictOptions[obj]===true}
                                                            onChange={handleChangePredict}
                                                        />
                                                    }
                                                    label={obj}
                                                />
                                            </FormGroup>
                                        )}
                                    )}
                                </div>
                                {(Object.keys(predictOptions).length > 1)?
                                (<Alert severity="warning" icon={false}>WARNING: Choosing more than 1 label will result in a Multilabel Classification Model. Please ensure the target columns are binary [0, 1]</Alert>)
                                : null}
                            </TabPanel>
                            <TabPanel value={tabValue} index={2} style={{width:"-webkit-fill-available"}}>
                                <div className={styles["column-list-ctn"]}>
                                    {filteredOptions.map((obj, dx) => {
                                        return (
                                            <FormGroup
                                                className={styles["column-list-item"]}
                                                key={dx}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            sx={{padding:"2px"}}
                                                            icon={<TickSquareIcon style={{height:"24px", width:"24px"}}/>}
                                                            checkedIcon={<TickSquareCheckedIcon style={{height:"24px", width:"24px",color:"#5420E8"}}/>}
                                                            value={obj}
                                                            checked={ignoreOptions[obj] && ignoreOptions[obj]===true}
                                                            onChange={handleChangeIgnore}
                                                        />
                                                    }
                                                    label={obj}
                                                />
                                            </FormGroup>
                                        )}
                                    )}
                                </div>
                            </TabPanel>
                            
                        </div>
                    </div>
                    <div className={styles["field-ctn"]}>
                        <span className={styles["field-label"]}>Early Stopping</span>
                        <div className={styles["field"]} >
                            <FormControl fullWidth>
                                <input
                                    style={{border:"0px",padding:"10px",background:"none"}}
                                    value={earlyStopping}
                                    type="number"
                                    onChange={(e) => setEarlyStopping(e.target.value)}
                                ></input>
                       
                            </FormControl>   
                        </div>
                    </div>
                    <div className={styles["field-ctn"]}>
                        <span className={styles["field-label"]}>Minimum Frequency</span>
                        <div className={styles["field"]} >
                            <FormControl fullWidth>
                                <input
                                    style={{border:"0px", padding:"10px",background:"none"}}
                                    value={minFrequency}
                                    type="float"
                                    onChange={(e) => setMinFrequency(e.target.value)}
                                ></input>
                       
                            </FormControl>   
                        </div>
                    </div>
                    <div className={styles["field-ctn"]}>
                        <span className={styles["field-label"]}>Anomaly Detection</span>
                        <div className={styles["field"]} style={{border:"0px", justifyContent:"flex-start"}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={anomalycheck}
                                        onChange={(e) => setAnomalycheck(e.target.checked)}
                                    />
                                }
                                label={<span class={styles["field-label"]}>Check Anomaly detction</span>}
                                
                            />
                        </div>
                    </div>

                    
                    
                </div>
                <div className={styles["right-ctn"]}>
                    {!showDashboard ? 
                    (
                        <div style={{display:"flex",alignSelf:"center",height:"100%", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                            <CibiSmallIcon style={{color:"#101016"}}/>
                            <button className="gradient-background" style={{width:"30vw", marginTop:"44px"}} onClick={createPredictionModel} disabled={!enableCreatePredictButton}>Create Predictive Model</button>
                            <span style={{width:"30vw",marginTop:"22px"}} className={styles["small-text"]}>Click to create Predictive Model. It might take some minutes to Detecting Anomalies</span>
                        </div>
                    ) : (
                        <TrainDashboard experimentId={experimentId} experimentStatus={expstatus} message={modelRunMsg}/>
                    )}
                </div>
            </div>
        </>
    )

}