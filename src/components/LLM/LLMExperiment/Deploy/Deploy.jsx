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
import "../../../../styles/liquidGlass.css";
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
    <Box sx={{
      padding: "24px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)"
    }}>
      <Typography
        variant="h6"
        className="top-text"
        sx={{
          mb: 3,
          color: "#3F3F50",
          fontFamily: "Plus Jakarta Sans",
          fontSize: "18px",
          fontWeight: 600,
          textAlign: "center"
        }}
      >
        Multiple types of deployment and their load time.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box className="liquid-glass-card-neutral" sx={{
            width: "100%",
            borderRadius: "20px",
            overflow: "hidden"
          }}>
            <Box sx={{
              p: 2,
              pb: 0,
              borderBottom: "1px solid rgba(211, 211, 234, 0.3)"
            }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="deployment tabs"
                sx={{
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "flex-start",
                    gap: "16px",
                    "& .MuiTab-root": {
                      textTransform: "capitalize",
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      color: "#6E6E88",
                      transition: "all 0.3s ease",
                      borderRadius: "12px",
                      minHeight: "48px",
                      padding: "12px 20px",
                      "&:hover": {
                        background: "rgba(84, 32, 232, 0.08)",
                        color: "#5420E8"
                      }
                    },
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: "#5420E8",
                    background: "rgba(84, 32, 232, 0.1)",
                    fontWeight: 700
                  },
                  "& .MuiTabs-indicator": {
                    background: "#5420E8",
                    height: "3px",
                    borderRadius: "2px"
                  }
                }}
              >
                <Tab className="tablabel" label="Endpoint Deploy" value={1} />
                {/* <Tab className="tablabel" label="Batch Deploy" value={2} /> */}
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              {tabValue === 1 ? <Endpoint onChildClick={handleChildClick} /> : <Batch />}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          {/* Future: Load test component can be added here */}
        </Grid>
      </Grid>
    </Box>
  );
}
