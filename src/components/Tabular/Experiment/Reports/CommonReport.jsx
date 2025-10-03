import React, { useEffect, useState } from "react";
import {
  GetFeatureImportance,
  GetCmpr,
} from "../../../../services/Portals/MLopsPortals";
// import "./Reports.scss";
import { useParams } from "react-router-dom";
import { Box, Slider, MenuItem, Select } from "@mui/material";
import { GetListExperiments } from "../../../../services/Portals/MLopsPortals";
import styles from "./CommonReport.module.css";
import { border } from "@mui/system";
export const FeatureImportance2 = ({ experimentId }) => {
  const [featureImportance, setFeatureImportance] = useState({});

  useEffect(() => {
    GetFeatureImportance(experimentId)
      .then((res) => {
        if (res.status === 200) {
          setFeatureImportance(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (Object.keys(featureImportance)?.length > 0) {
    //console.log("featureImportance", featureImportance);
    return (
      <table style={{ width: "-webkit-fill-available", borderSpacing: "0px" }}>
        <tbody>
          {Object.keys(featureImportance).map((key, index) => (
            <tr key={index} className={styles["feat-table-row"]}>
              <td className={styles["feat-name"]}>{key}</td>
              <td className={styles["feat-value"]}>
                {Math.round(featureImportance[key] * 100) / 100}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

export const ConfusionMatrix2 = ({ experimentId }) => {
  const [CMData, setCMData] = useState([]);
  const [sliderValue, setSliderValue] = useState(0.01);
  const [showDropdow, setshowDropdow] = useState(false);
  const [selectedItem, setselectedItem] = useState();
  const [selectedItemIndex, setselectedItemIndex] = useState(0);
  const [TargetItems, setTargetItems] = useState([]);

  const onSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    if (!CMData.length > 0) {
      GetCmpr(experimentId)
        .then((res) => {
          if (res.status === 200) {
            setCMData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          console.log("res", res);
          const checkTargetLength = res.data[0].train_config.data.target.length;
          const targetType = res.data[0].train_config.data.target;
          console.log("targetType", typeof targetType);
          console.log("checkTargetLength", checkTargetLength);
          if (checkTargetLength > 1 && typeof targetType == "object") {
            console.log("show");
            setshowDropdow(true);
            setTargetItems(res.data[0].train_config.data.target);
            setselectedItem(res.data[0].train_config.data.target[0]);
            console.log("ress",res.data[0].train_config.data.target[0]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleModelChangeMetrix = (e) => {
    setselectedItem(e.target.value);
    const selectedIndex = TargetItems.indexOf(e.target.value);
    setselectedItemIndex(selectedIndex);
    const selectedElement = CMData[selectedIndex];
    // setCMData(selectedElement);
     console.log(selectedIndex);
    // console.log("filteredDataCMData", CMData);
  };

  

  return (
    <>
      {showDropdow ? (
        <>
      
          <Box sx={{ float: "right", mr: 1 }}>
            <Select
              placeholder="StageWeight"
              variant="outlined"
              name="StageWeight"
              value={selectedItem}
              onChange={handleModelChangeMetrix}
            >
              {TargetItems.map((ele, index) => (
                <MenuItem key={index} value={ele}>
                  {ele}
                </MenuItem>
              ))}

              {/* {TargetItems.length > 0 && (
                <>
                  {TargetItems.map((item,index) => {
                    return <MenuItem key={index} value={item}>{item}</MenuItem>;
                  })}
                </>
              )} */}
            </Select>
          </Box>
        </>
      ) : (
        ""
      )}

      <Box className={styles["cm-ctn"]}>
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
          }}
          defaultValue={0.01}
          step={0.01}
          valueLabelDisplay="auto"
          marks
          min={0.01}
          max={1}
          onChange={onSliderChange}
        />

        {showDropdow ? (
          <>
            {CMData.length > 0 &&
              CMData[selectedItemIndex].map((cm) => (
                <>
                  {Math.round(cm.threshold * 100) / 100 === sliderValue && (
                    <div className="cm-layer">
                      <div className="cm-data">
                        <table
                          style={{
                            width: "-webkit-fill-available",
                            height: "200px",
                            borderSpacing: "0px",
                            border: "1px solid #D3D3EA",
                            textAlign: "center",
                            td: { border: "1px solid #D3D3EA" },
                          }}
                        >
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid #D3D3EA" }}></th>
                              <th className={styles["cm-label"]}>
                                Actual Positive
                              </th>
                              <th className={styles["cm-label"]}>
                                Actual Negative
                              </th>
                              <th className={styles["cm-label"]}>Threshold</th>
                              <td
                                style={{
                                  border: "1px solid #D3D3EA",
                                  padding: "15px 30px",
                                }}
                              >
                                {Math.round(cm.threshold * 100) / 100}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className={styles["cm-label"]}>
                                Predicted Positive
                              </th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.tp}
                              </td>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.fp}
                              </td>
                              <th className={styles["cm-label"]}>Precision</th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {Math.round(cm.precision * 100) / 100}
                              </td>
                            </tr>
                            <tr>
                              <th className={styles["cm-label"]}>
                                Predicted Negative
                              </th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.fn}
                              </td>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.tn}
                              </td>
                              <th className={styles["cm-label"]}>Recall</th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {Math.round(cm.recall * 100) / 100}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </>
        ) : (
          <>
            {CMData.length > 0 &&
              CMData.map((cm) => (
                <>
                  {Math.round(cm.threshold * 100) / 100 === sliderValue && (
                    <div className="cm-layer">
                      <div className="cm-data">
                        <table
                          style={{
                            width: "-webkit-fill-available",
                            height: "200px",
                            borderSpacing: "0px",
                            border: "1px solid #D3D3EA",
                            textAlign: "center",
                            td: { border: "1px solid #D3D3EA" },
                          }}
                        >
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid #D3D3EA" }}></th>
                              <th className={styles["cm-label"]}>
                                Actual Positive
                              </th>
                              <th className={styles["cm-label"]}>
                                Actual Negative
                              </th>
                              <th className={styles["cm-label"]}>Threshold</th>
                              <td
                                style={{
                                  border: "1px solid #D3D3EA",
                                  padding: "15px 30px",
                                }}
                              >
                                {Math.round(cm.threshold * 100) / 100}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr >
                              <th className={styles["cm-label"]}>
                                Predicted Positive
                              </th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.tp}
                              </td>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.fp}
                              </td>
                              <th className={styles["cm-label"]}>Precision</th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {Math.round(cm.precision * 100) / 100}
                              </td>
                            </tr>
                            <tr>
                              <th className={styles["cm-label"]}>
                                Predicted Negative
                              </th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.fn}
                              </td>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {cm.tn}
                              </td>
                              <th className={styles["cm-label"]}>Recall</th>
                              <td style={{ border: "1px solid #D3D3EA" }}>
                                {Math.round(cm.recall * 100) / 100}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </>
        )}
      </Box>
    </>
  );
};
