import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetListExperiments, getTabularProjectDetails } from "../../../services/Portals/MLopsPortals";
import { StyledEngineProvider, Button, Tabs, Tab, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function TabularExperiment() {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [experimentInformation, setExperimentInformation] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  const statusRanks = {
    "CREATED": 1,
    "PREPROCESSING": 2,
    "PREPARED": 3,
    "TRAINING": 4,
    "TRAINED": 5,
    "DEPLOYED": 6
  };

  const tabs = [
    { label: "Prepare", value: 0, path: "prepare" },
    { label: "Train", value: 1, path: "train" },
    { label: "Deploy", value: 2, path: "deploy" },
    { label: "Reports", value: 3, path: "reports" }
  ];

  const isTabDisabled = (tabIndex) => {
    const tabName = tabs[tabIndex].path;
    if (tabName === "prepare") {
      return false;
    } else if (tabName === "train") {
      return statusRanks[experimentInformation.status] < statusRanks["PREPARED"];
    } else if (tabName === "deploy" || tabName === "reports") {
      return statusRanks[experimentInformation.status] < statusRanks["TRAINED"];
    }
    return true;
  };

  const handleTabChange = (event, newValue) => {
    if (!isTabDisabled(newValue)) {
      setSelectedTab(newValue);
      const tabPath = tabs[newValue].path;
      navigate(`/tabular/${projectId}/Experiment/${experimentId}/${tabPath}`);
    }
  };

  const handleBackClick = () => {
    navigate(`/tabular/${projectId}`);
  };

  useEffect(() => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentInformation(res.data[0]);
          
          // Auto-navigate based on experiment status
          if (location.pathname.endsWith(experimentId) || location.pathname.endsWith(experimentId + "/")) {
            if (res.data[0].status === "CREATED") {
              navigate(`/tabular/${projectId}/Experiment/${experimentId}/prepare`, { replace: true });
            } else if (["PREPARED", "TRAINED", "DEPLOYED"].includes(res.data[0].status)) {
              navigate(`/tabular/${projectId}/Experiment/${experimentId}/prepare`, { replace: true });
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId, location, projectId, navigate]);

  useEffect(() => {
    getTabularProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          setProjectName(res.data.proj_name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [projectId]);

  // Update selected tab based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("prepare")) setSelectedTab(0);
    else if (currentPath.includes("train")) setSelectedTab(1);
    else if (currentPath.includes("deploy")) setSelectedTab(2);
    else if (currentPath.includes("reports")) setSelectedTab(3);
  }, [location.pathname]);

  return (
    <StyledEngineProvider injectFirst>
      <div style={{ width: "-webkit-fill-available", padding: "24px" }}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              onClick={handleBackClick}
              sx={{
                minWidth: "auto",
                padding: "8px",
                borderRadius: "8px",
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ArrowBack />
            </Button>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
                {projectName || "Loading..."}
              </h1>
              <p style={{ margin: "8px 0 0 0", color: "#666" }}>
                {experimentInformation.name || "Experiment"} • Status: {experimentInformation.status || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "24px" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "600",
                fontSize: "14px",
                minHeight: "48px",
                "&.Mui-disabled": {
                  opacity: 0.4,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#667eea",
                height: "3px",
                borderRadius: "2px",
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={tab.label}
                disabled={isTabDisabled(index)}
                sx={{
                  color: selectedTab === index ? "#667eea" : "#666",
                  "&:hover": {
                    color: "#667eea",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <div style={{ padding: "24px 0" }}>
          <Routes>
            <Route path="prepare" element={
              <div style={{ textAlign: "center", padding: "48px" }}>
                <h2>Data Preparation</h2>
                <p>Configure and prepare your data for training</p>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This section will contain data upload, preprocessing, and feature engineering tools.
                </p>
              </div>
            } />
            <Route path="train" element={
              <div style={{ textAlign: "center", padding: "48px" }}>
                <h2>Model Training</h2>
                <p>Train your machine learning model</p>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This section will contain model configuration, training controls, and progress monitoring.
                </p>
              </div>
            } />
            <Route path="deploy" element={
              <div style={{ textAlign: "center", padding: "48px" }}>
                <h2>Model Deployment</h2>
                <p>Deploy your trained model</p>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This section will contain deployment options, endpoint configuration, and monitoring.
                </p>
              </div>
            } />
            <Route path="reports" element={
              <div style={{ textAlign: "center", padding: "48px" }}>
                <h2>Reports & Analytics</h2>
                <p>View model performance and analytics</p>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This section will contain performance metrics, visualizations, and detailed reports.
                </p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </StyledEngineProvider>
  );
}
