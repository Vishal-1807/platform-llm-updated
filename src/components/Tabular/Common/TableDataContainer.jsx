import React, { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import "./TableDataContainer.css";
export const TableDataContainer = (data, anomalycheck) => {
  //   const data = JSON.parse(localStorage.getItem("localTableData"));
  // const AnomalyPct = getAnomalyPercentage();
  // console.log("AnomalyPct", anomalycheck.anomalycheck);
  const { experimentId } = useParams();

  return (
    <>
      <Box
        sx={{
          fontFamily: "source-sans-pro",
          fontSize: "16px",
          fontWeight: 400,
          background: "rgb(244,244,245)",
          color: "#687083",
          padding: "15px",
          display: "flex",
        }}
      >
        <Box sx={{ p: "0 2%" }}>
          <span className="fname">File Name: </span>
          <span className="TabFilename">{data?.data?.fileName}</span>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ p: "0 2%" }}>
          <span className="tabrows">Rows:</span>{" "}
          <span className="tabrowcount">{data?.data?.rows} </span>{" "}

          <span className="tabrows">Columns:</span>{" "}
          <span className="tabrowcount">{data?.data?.columns}</span>{" "}
          
        </Box>
        <Divider orientation="vertical" flexItem />

        {anomalycheck.anomalycheck ? (
          <Box sx={{ p: "0 2%" }}>
            {/* Anomaly Percentage: {Math.round(AnomalyPct)}% */}
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};
