import React, { useEffect, useState } from "react";
import {
  GetFeatureImportance,
  GetCmpr,
} from "../../../../../services/Portals/MLopsPortals";
import "./CommonReports.css";
import { useParams } from "react-router-dom";
import { Box, Slider, MenuItem, FormControl, Select } from "@mui/material";
import { GetListExperiments } from "../../../../../services/Portals/MLopsPortals";

export const FeatureImportance = () => {
  const [featureImportance, setFeatureImportance] = useState({});
  const { experimentId } = useParams();
  useEffect(() => {
    GetFeatureImportance(experimentId)
      .then((res) => {
        console.log("res",res);
        if (res.status === 200) {
          setFeatureImportance(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId]);

  // if (Object.keys(featureImportance)?.length > 0) {
    //console.log("featureImportance", featureImportance);
    return (


      <div className="feat-ctn">
        <h2 className="FeatureTitle">Feature Importance</h2>
        <div className="table">
        <table>
          <tbody>
            {Object.keys(featureImportance).map((key, index) => (
              <tr key={index} className="tableTR">
                <td className="cell-key">{key}</td>
                <td className="cell-color">{Math.round(featureImportance[key] * 100) / 100}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    );
  // }
};

export const ConfusionMatrix = () => {
  const [CMData, setCMData] = useState([]);
  const [CMTempData, setCMTempData] = useState([]);
  const [sliderValue, setSliderValue] = useState(0.01);
  const [showDropdow, setshowDropdow] = useState(false);
  const [selectedItem, setselectedItem] = useState();
  const [selectedItemIndex, setselectedItemIndex] = useState(0);
  const [TargetItems, setTargetItems] = useState([]);
  const { experimentId } = useParams();
  
  const onSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    if (!CMData.length > 0) {
      GetCmpr(experimentId)
        .then((res) => {
          console.log("cmpr", res);
          if (res.status === 200) {
            setCMData(res.data);
            setCMTempData(res.data);
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
          console.log("res", res.data[0].train_config.data.target);
          const checkTargetLength = res.data[0].train_config.data.target.length;
          const targetType = res.data[0].train_config.data.target;
          console.log("targetType", typeof targetType);
          console.log("checkTargetLength", checkTargetLength);
          if (checkTargetLength > 1 && typeof targetType == "object") {
            console.log("show");
            setshowDropdow(true);
            setTargetItems(res.data[0].train_config.data.target);
            setselectedItem(res.data[0].train_config.data.target[0]);
            console.log(selectedItem);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId]);

  const handleModelChangeMetrix = (e) => {
    setselectedItem(e.target.value);
    const selectedIndex = TargetItems.indexOf(e.target.value);
    setselectedItemIndex(selectedIndex);
    const selectedElement = CMData[selectedIndex];
    // setCMData(selectedElement);
    // console.log(selectedIndex);
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
      <Box className="cm-ctn" sx={{ marginTop: "80px" }}>
        <Slider
          sx={{ width: "450px" }}
          defaultValue={0.01}
          step={0.01}
          valueLabelDisplay="auto"
          marks
          min={0.01}
          max={1}
          onChange={onSliderChange}
          className="sliderBg"
        />

        {showDropdow ? (
          <>
            {CMData.length > 0 &&
              CMData[selectedItemIndex].map((cm) => (
                <>
                  {Math.round(cm.threshold * 100) / 100 === sliderValue && (
                    <div className="cm-layer">
                      <div className="cm-data">
                        <table>
                          <thead>
                            <tr>
                              <th></th>
                              <th className="headernames">Actual Positive</th>
                              <th className="headernames">Actual Negative</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="headernames">Predicted Positive</th>
                              <td className="cmValues">{cm.tp}</td>
                              <td className="cmValues">{cm.fp}</td>
                            </tr>
                            <tr>
                              <th className="headernames">Predicted Negative</th>
                              <td className="cmValues">{cm.fn}</td>
                              <td className="cmValues">{cm.tn}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="tp-data">
                        <table>
                          <tbody>
                            <tr>
                              <th className="headernames">Threshold</th>
                              <td className="cmValues">{Math.round(cm.threshold * 100) / 100}</td>
                            </tr>
                            <tr>
                              <th className="headernames">Precision</th>
                              <td className="cmValues">{Math.round(cm.precision * 100) / 100}</td>
                            </tr>
                            <tr>
                              <th className="headernames">Recall</th>
                              <td className="cmValues">{Math.round(cm.recall * 100) / 100}</td>
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
                        <table>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Actual Positive</th>
                              <th>Actual Negative</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Predicted Positive</th>
                              <td>{cm.tp}</td>
                              <td>{cm.fp}</td>
                            </tr>
                            <tr>
                              <th>Predicted Negative</th>
                              <td>{cm.fn}</td>
                              <td>{cm.tn}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="tp-data">
                        <table>
                          <tbody>
                            <tr>
                              <th>Threshold</th>
                              <td>{Math.round(cm.threshold * 100) / 100}</td>
                            </tr>
                            <tr>
                              <th>Precision</th>
                              <td>{Math.round(cm.precision * 100) / 100}</td>
                            </tr>
                            <tr>
                              <th>Recall</th>
                              <td>{Math.round(cm.recall * 100) / 100}</td>
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

