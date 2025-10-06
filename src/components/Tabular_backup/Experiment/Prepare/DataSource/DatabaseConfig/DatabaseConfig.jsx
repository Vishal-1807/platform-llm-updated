import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  Stack,
  Paper,
  Tooltip,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataSourcesList } from "../../../../Constants/utils";
import {
  GetSourceFields,
  VerifyDataSource,
  GetExpDataSet,
} from "../../../../../../services/Portals/MLopsPortals";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BorderLinearProgress } from "../../../../../Elements/BorderLinearProgress";
import "./DatabaseConfig.css";
import Buttons from "../../../../../Elements/Buttons";

export default function DatabaseConfig() {
  const { experimentId, projectId } = useParams();
  const databaseName = decodeURIComponent(useParams().databaseName);
  const [sourceName, setSourceName] = useState(databaseName);
  const [formFields, setFormFields] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const initialValues = location.state?.initialValues || {};
  useEffect(() => {
    console.log(initialValues);
    if (!initialValues) {
      return;
    }
    for (let key in formFields) {
      if (initialValues[key]) {
        setFormValues((values) => ({ ...values, [key]: initialValues[key] }));
      }
    }
  }, [initialValues, formFields]);
  const navigate = useNavigate();
  const submitForm = () => {
    setLoader(true);
    const connectionrequest = {
      datasourcename: sourceName,
      datasource: databaseName,
      connection_data: formValues,
    };
    VerifyDataSource(experimentId, connectionrequest)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setLoader(false);
          navigate(
            `/tabular/${projectId}/Experiment/${experimentId}/prepare/feature`,
            {
              state: {
                dataSourceModel: connectionrequest,
              },
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetSourceFields(databaseName)
      .then((res) => {
        if (res.status === 200) {
          for (let ele in res.data) {
            res.data[ele]["width"] = [
              "user",
              "password",
              "database",
              "port",
            ].includes(ele)
              ? "50%"
              : "100%";
          }
          setFormFields(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sourceName]);

  useEffect(() => {
    GetExpDataSet(experimentId)
      .then((res) => {
        if (res.status === 200) {
          setFormValues(res.data.dataSourceModel.connection_data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sourceName, experimentId]);

  const updateFormValues = (e) => {
    const { name } = e.target;
    let value = e.target.value
    if(e.target.type === "checkbox")
      value = e.target.checked;
    setFormValues((values) => ({ ...values, [name]: value }));
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <>
      <Grid sx={{ p: 1 }}>
        <Typography className="DataseTitle">
          <span className="step">Steps : 2/5 </span>
          <span className="tagline">
            Fill up following details of your selected database 'postgreSQL'
          </span>
        </Typography>
      </Grid>

      <Grid container sx={{ mt: 0 }}>
        <Grid xs={6}>
          <Box className="form-ctn">
            <div className="d-title">Create a Source</div>
            <div className="s-name">Source Name</div>
            <div className="input-ctn">
              <input
                id="src"
                className="input-module"
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                disabled
              />
            </div>
            {!sourceName && (
              <span className="error">This field is required</span>
            )}
          </Box>

          <Box className="DataformDetails">
            <Grid container>
              {Object.keys(formFields)
                .slice(0, 4)
                .map((key, idx) => (
                  <>
                    <Grid xs={6}>
                      <Box sx={{ mb: "14px", display:"flex", flexDirection:"column",gap:"8px"}} key={idx}>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <div className="k-name">{key}</div>
                          <Tooltip
                            title={formFields[key].description}
                            placement="top-end"
                            className="tooltip-ctn"
                            
                          >
                            <InfoOutlinedIcon
                              style={{
                                fontSize: "medium",
                                cursor: "pointer",
                                fill: "#E04EF8",
                                marginLeft:0
                              }}
                            />
                          </Tooltip>
                        </Stack>

                        {formFields[key].type === "bool" ? (
                          <input
                            id="usr"
                            type="checkbox"
                            name={key}
                            checked={formValues[key] || false}
                            onChange={updateFormValues}
                          />
                        ) : (
                          <div className="input-ctn">
                            <input
                              id="usr"
                              className="input-module"
                              type={
                                formFields[key].type === "int"
                                  ? "number"
                                  : formFields[key].type
                              }
                              name={key}
                              value={formValues[key] || ""}
                              onChange={updateFormValues}
                            />
                          </div>
                        )}

                        {errors[key] && (
                          <span className="error">{errors[key]}</span>
                        )}
                      </Box>
                    </Grid>
                  </>
                ))}
            </Grid>

            {Object.keys(formFields)
              .slice(4)
              .map((key, idx) => (
                <>
                  <Grid xs={6}>
                    <Box sx={{ mb: "14px" }} key={idx} style={{display:"flex", flexDirection:"column",gap:"8px",alignItems:"flex-start"}}>
                    {formFields[key].type === "bool" ? (
                      <div style={{display:"flex",gap:"8px"}}>
                      <input
                        id="usr"
                        type="checkbox"
                        name={key}
                        checked={formValues[key] || false}
                        onChange={updateFormValues}
                      />
                      <Stack spacing={1} direction="row" alignItems="center">
                        <div className="k-name">{key}</div>
                        <Tooltip
                          title={formFields[key].description}
                          placement="top-end"
                          className="tooltip-ctn"
                          sx={{marginLeft:"0px"}}
                        >
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: "medium",
                              cursor: "pointer",
                              fill: "#E04EF8",
                              marginLeft:0,
                             
                            }}
                          />
                        </Tooltip>
                      </Stack>
                      </div>
                      ) : (
                        <>
                        <Stack spacing={1} direction="row" alignItems="center">
                        <div className="k-name">{key}</div>
                        <Tooltip
                          title={formFields[key].description}
                          placement="top-end"
                          className="tooltip-ctn"
                        >
                          <InfoOutlinedIcon
                            style={{
                              fontSize: "medium",
                              cursor: "pointer",
                              fill: "#E04EF8",
                              marginLeft:0
                            }}
                          />
                        </Tooltip>
                      </Stack>
                        <div className="input-ctn">
                          <input
                            id="usr"
                            className="input-module"
                            type={
                              formFields[key].type === "int"
                                ? "number"
                                : formFields[key].type
                            }
                            name={key}
                            value={formValues[key] || ""}
                            onChange={updateFormValues}
                          />
                        </div>
                        </>
                      )}

                      {errors[key] && (
                        <span className="error">{errors[key]}</span>
                      )}
                    </Box>
                  </Grid>
                </>
              ))}
            <Grid container>
              <Grid xs={4}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Buttons label={"Verify Connection"} onClick={submitForm} />
                </Box>
              </Grid>
              <Grid xs={8}>
                {loader && (
                  <Box className="BorderLinearProgress">
                    <div className="Ek-name">Establishing Connection</div>
                    {<BorderLinearProgress className="Liner-progress" />}
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* {loader && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )} */}
          </Box>
        </Grid>

        <Grid xs={5.5} sx={{ ml: 2 }}>
          <Box className="Con-details">
            <div className="img-ctn">
              <div className="s-img">
                <img
                  className="icons"
                  src={DataSourcesList[sourceName]}
                  alt=""
                ></img>
              </div>
              <p className="sd-title">{sourceName}</p>
            </div>
            <ul>
              {Object.keys(formFields).map((key, idx) => (
                <Box sx={{ mt: 2 }} key={idx} className>
                  <li className="list">
                    <div className="sk-name">{key}</div>

                    <div className="sk-desc">{formFields[key].description}</div>
                  </li>
                </Box>
              ))}
            </ul>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
