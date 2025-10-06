import { useState, useRef } from "react";
import "./Reports.css";
import { Box, Grid, Typography } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Grafana from "./Grafana/Grafana";
export default function Reports() {
  const [activeReportName, setactiveReportName] = useState("Training Metrics");
  const containerRef = useRef(null);

  const reportsList = [
    "Training Metrics",
    "Training System Metrics",
    "Preprocessing System Metrics",
    "Inference system Metrics",
    "Cost",
    "Drift Metrics",
    "Feature Importance",
    "Confusion Matrix",
    "Load test Metrics",
    "Batch Status",
    "EndPoint Status",
    "Consumption",
  ];
  const scrollRight = () => {
    if (containerRef.current) {
      const scrollAmount = 600; // Adjust the scroll amount as needed
      containerRef.current.scrollLeft += scrollAmount;
    }
  };
  const scrollLeft = () => {
    if (containerRef.current) {
      const scrollAmount = -200; // Adjust the scroll amount as needed
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <>
      <Grid container>
        <Typography className="ReportTitle">
          <b>Reports</b>
        </Typography>

        <Grid container sx={{ width: "100%", display: "flex" }}>
          <Box sx={{ width: "2%", float: "left" }}>
            <Box className="scrollLeft">
              <KeyboardDoubleArrowLeftIcon onClick={scrollLeft} />
            </Box>
          </Box>
          <Box sx={{ width: "95%", marginLeft: "2px" }}>
            <Box className="ReportList" ref={containerRef}>
              <Box sx={{ width: "200%" }}>
                {reportsList.map((item) => (
                  <>
                    <Box
                      className="ReportBox"
                      onClick={() => setactiveReportName(item)}
                    >
                      <Box
                        className={
                          item == activeReportName ? "activeReport" : "ReportName"
                        }
                      >
                        {item}
                      </Box>
                    </Box>
                  </>
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "2%", float: "right" }}>
            <Box className="scrollRight">
              <KeyboardDoubleArrowRightIcon onClick={scrollRight} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 1 }}>
        <Grafana reportItem={activeReportName} />
      </Grid>
    </>
  );
}
