import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Batch from "./Batch/Batch";
import Endpoint from "./Endpoint/Endpoint";
import LoadTest from "./LoadTest/LoadTest";
import {
  Grid,
  Box,
  AppBar,
  Tabs,
  Tab,
  Stack,
  Paper,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";

import "./Deploy.css";
export default function Deploy() {
  const [tabValue, setTabValue] = useState(1);
  const [showloder, setshowloder] = useState(false);
  const handleChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleChildClick = (childStateValue) => {
    setshowloder(childStateValue);
  };

  return (
    <>
      <div class="top-text">
        Multiple types of deployment and their load time.
      </div>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Box sx={{ background: "#fff", width: "100%" }}>
            <Box sx={{ p: 1 ,pb:0,borderBottom:"1px solid #d3d3ea"}}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "flex-start",
                    gap: "10px",
                    "& .MuiTab-root": {
                      textTransform: "capitalize",
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      
                    },
                  },
                  "& .MuiTab-root.Mui-selected":{
                    color:"#5420E8"
                  },
                  "& .MuiTabs-indicator":{
                    background:"#5420E8"
                  }

                }}
              >
                <Tab  className="tablabel" label="Endpoint Deploy" value={1} />
                <Tab className="tablabel" label="Batch Deploy" value={2} />
              </Tabs>
            </Box>
            <Box>
              {tabValue === 1 ? <Endpoint onChildClick={handleChildClick}></Endpoint> : <Batch ></Batch>}
            </Box>
          </Box>
        </Grid>
        {/* <Grid item xs={5}>
          <Box sx={{ background: "#fff", width: "100%" }}>
            {tabValue === 1 &&  <LoadTest />}
          </Box>
        </Grid> */}
      </Grid>
    </>
  );
}
