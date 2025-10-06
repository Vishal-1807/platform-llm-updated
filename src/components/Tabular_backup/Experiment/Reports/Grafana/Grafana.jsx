import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { SelectFilter } from "../SelectFilter";
import "./Grafana.css";
import {
  FeatureImportance,
  ConfusionMatrix,
} from "../CommonReports/subreports";
import {
  GetBatchStatus,
  GetEndPointStatus,
  GetMispredictionTree,
} from "../../../../../services/Portals/MLopsPortals";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { PatientRiskProfile } from "../CommonReports/PatientRiskProfile";
export default function Grafana({ reportItem }) {
  const { projectId, experimentId } = useParams();
  const [rangeFromValue, setRangeFromValue] = useState("now-24h");
  const [CostrangeFromValue, setCostrangeFromValue] = useState("now-1h");
  const [rangeToValue, setRangeToValue] = useState("now");
  const [Showloading, setShowloading] = useState(true);
  const [batchStatus, setBatchStatus] = useState([]);
  const [EndpointStatus, setEndpointStatus] = useState({});
  const [mispredictionUrl, setMispredictionUrl] = useState("");
  const lowerCaseProjectId = projectId.toLowerCase();

  const selectedFromRange = (value) => {
    setRangeFromValue(value);
    setCostrangeFromValue(value);
  };
  console.log("CostrangeFromValue", CostrangeFromValue);

  const selectedToRange = (value) => {
    setRangeToValue(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowloading(false);
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    setRangeFromValue("now-24h");
    setRangeToValue("now");

    if (reportItem === "Training Metrics") {
      GetMispredictionTree(experimentId)
        .then((res) => {
          if (res.status === 200) {
            axios.get(res.data.signed_url).then((svgurl) => {
              setMispredictionUrl(svgurl.data);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (reportItem === "Batch Status") {
      GetBatchStatus(experimentId)
        .then((res) => {
          if (res.status === 200) {
            setBatchStatus(res?.data?.latest_runs);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (reportItem === "EndPoint Status") {
      GetEndPointStatus(experimentId)
        .then((res) => {
          if (res.status === 200) {
            setEndpointStatus(res?.data?.request);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reportItem]);
  const getReports = () => {
    const ApiUrl = "https://cibi.ai";
    switch (true) {
      case reportItem === "Training Metrics":
        // let TMUrl = `${ApiUrl}/cibi/grafana/d/d83e760a-ce8d-4ba1-a289-4cff0909c7ff/model-metrics?orgId=1&refresh=30s&var-experiment=${experimentId}&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        let TMUrl = `${ApiUrl}/cibi/grafana/d/a91763bb-d009-4be3-b378-2187a01e08bd/model-metrics-optuna?orgId=1&var-experiment=${experimentId}&theme=light&kiosk&width=450`;
        return (
          <>
            <Grid sx={{ width: "100%" }}>
              <Box sx={{ mt: 1, width: "100%", height: "50vh" }}>
                <iframe
                  src={TMUrl}
                  title="Grafana Dashboard"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </Box>

              <Box sx={{ m: 1, width: "100%", height: "50vh" }}>
                <h1 className="Misprediction">Misprediction Tree</h1>

                {mispredictionUrl ? (
                  <TransformWrapper>
                    <Controls />
                    <TransformComponent>
                      {/* <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      alt="test"
                      width="100%"
                    /> */}
                      <div
                        dangerouslySetInnerHTML={{ __html: mispredictionUrl }}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                ) : (
                  <p>Loading SVG...</p>
                )}
              </Box>
            </Grid>
          </>
        );

      case reportItem === "Training System Metrics":
        let TSMUrl = `${ApiUrl}/cibi/grafana/d/k8s_views_ns/kubernetes-views-namespaces?orgId=1&refresh=30s&var-datasource=Prometheus&var-namespace=${lowerCaseProjectId}-train&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            <Grid sx={{ width: "100%" }}>
              <Box sx={{ width: "100%" }}>
                <SelectFilter
                  value={rangeFromValue}
                  selectedFromRange={selectedFromRange}
                  selectedToRange={selectedToRange}
                ></SelectFilter>
              </Box>
              <Box sx={{ mt: 1, width: "100%", height: "100vh" }}>
                <iframe
                  src={TSMUrl}
                  title="Grafana Dashboard"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </Box>
            </Grid>
          </>
        );
      case reportItem === "Preprocessing System Metrics":
        let PSMUrl = `${ApiUrl}/cibi/grafana/d/k8s_views_ns/kubernetes-views-namespaces?orgId=1&refresh=30s&var-datasource=Prometheus&var-namespace=${lowerCaseProjectId}-preprocess&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            <SelectFilter
              value={rangeFromValue}
              selectedFromRange={selectedFromRange}
              selectedToRange={selectedToRange}
            ></SelectFilter>
            <Box sx={{ mt: 1, width: "100%", height: "100vh" }}>
              <iframe
                src={PSMUrl}
                title="Grafana Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Box>
          </>
        );

      case reportItem === "Inference system Metrics":
        let ISMUrl = `${ApiUrl}/cibi/grafana/d/k8s_views_ns/kubernetes-views-namespaces?orgId=1&refresh=30s&var-datasource=Prometheus&var-namespace=${lowerCaseProjectId}-infer&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            <SelectFilter
              value={rangeFromValue}
              selectedFromRange={selectedFromRange}
              selectedToRange={selectedToRange}
            ></SelectFilter>
            <Box sx={{ mt: 1, width: "100%", height: "100vh" }}>
              <iframe
                src={ISMUrl}
                title="Grafana Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Box>
          </>
        );
      case reportItem === "Cost":
        let CUrl = `${ApiUrl}/cibi/grafana/d/2LaqbJ0Zk/kubecost?orgId=1&refresh=10s&var-namespace=${lowerCaseProjectId}-infer&var-namespace=${lowerCaseProjectId}-preprocess&var-namespace=${lowerCaseProjectId}-train&theme=light&kiosk&width=450&from=${CostrangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            <SelectFilter
              value={CostrangeFromValue}
              selectedFromRange={selectedFromRange}
              selectedToRange={selectedToRange}
            ></SelectFilter>
            <Box sx={{ mt: 1, width: "100%", height: "100vh" }}>
              <iframe
                src={CUrl}
                title="Grafana Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Box>
          </>
        );

      case reportItem === "Drift Metrics":
        let DTUrl = `${ApiUrl}/cibi/grafana/d/d9e2bfd9-c994-4274-8869-1b4cb092f678/drift-metrics?orgId=1&refresh=30s&var-experiment=${experimentId}&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            <SelectFilter
              value={rangeFromValue}
              selectedFromRange={selectedFromRange}
              selectedToRange={selectedToRange}
            ></SelectFilter>
            <iframe
              src={DTUrl}
              title="Grafana Dashboard"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </>
        );
      case reportItem === "Feature Importance":
        return <FeatureImportance experimentId={experimentId} />;
      case reportItem === "Confusion Matrix":
        return <ConfusionMatrix experimentId={experimentId} />;
      case reportItem === "Load test Metrics":
        let LSMUrl = `${ApiUrl}/cibi/grafana/d/b0e1e08e-c158-4328-917b-fdf2a42ae8e1/locust-v1?orgId=1&refresh=30s&var-TestId=${experimentId}&theme=light&kiosk&width=450&from=${rangeFromValue}&to=${rangeToValue}`;
        return (
          <>
            {Showloading && (
              <div>
                <center>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontFamily: "source-sans-pro",
                      fontWeight: 600,
                    }}
                  >
                    {/* {loadMessage} */}
                  </Typography>
                </center>
              </div>
            )}

            <SelectFilter
              value={rangeFromValue}
              selectedFromRange={selectedFromRange}
              selectedToRange={selectedToRange}
            ></SelectFilter>
            <Box sx={{ mt: 1, width: "100%", height: "100vh" }}>
              <iframe
                src={LSMUrl}
                title="Grafana Dashboard"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </Box>
          </>
        );
      case reportItem === "Batch Status":
        return (
          <div className="bat-ctn">
            {Object.keys(batchStatus).length > 0 && (
              <table>
                <thead>
                  <tr>
                    {Object.keys(batchStatus[0]).map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batchStatus.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(batchStatus[0]).map((column) => (
                        <td key={column}>
                          {column === "start_time" || column === "end_time"
                            ? new Date(row[column] * 1000).toLocaleString()
                            : row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* {batchStatus.map((item, index) => (
                    <tr key={index}>
                      <td>{item.experimentId}</td>
                      <td>{item.model_state}</td>
                      <td>
                        {new Date(item.start_time * 1000).toLocaleString()}
                      </td>
                      <td>{item.batch_id}</td>
                      <td>{item.batch_size}</td>
                      <td>{item.status}</td>
                      <td>{item.detail}</td>
                      <td>{new Date(item.end_time * 1000).toLocaleString()}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            )}
          </div>
        );
      case reportItem === "EndPoint Status":
        return (
          <Box
            sx={{
              p: 2,
              background: "#fff",
              m: 4,
              width: "800px",
              border: "1px solid #ccc",
            }}
          >
            {Object.keys(EndpointStatus).length > 0 && (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  fontFamily: "source-sans-pro",
                  fontWeight: 400,
                  fontSize: "18px",
                }}
              >
                <code>{EndpointStatus.replace(/\s{2,10}/g, "\n")}</code>
              </pre>
            )}
          </Box>
        );

      case reportItem == "Consumption":
        return (
          <>
            <PatientRiskProfile />
          </>
        );
      default:
        return;
    }
  };

  return <div style={{ width: "100%" }}> {getReports()}</div>;
}
