import { ControlPoint } from "@mui/icons-material";
import { Button, StyledEngineProvider } from "@mui/material";
import { useEffect, useState, createContext, useContext } from "react";
import {
  CreateExperiment,
  CreateNewProject,
  gettabularProjects,
} from "../../services/Portals/MLopsPortals";
import CreateProject from "../common/CreateProject/CreateProject";
import ListWithSidebarFull from "../common/ListProjects/ListWithSidebarFull";
import TabPanel from "../Elements/TabPanel";

// Create context for Tabular tab state
export const TabularTabContext = createContext();

// Provider component
export function TabularTabProvider({ children }) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <TabularTabContext.Provider value={{ tabValue, setTabValue }}>
      {children}
    </TabularTabContext.Provider>
  );
}

// Hook to use the context
export function useTabularTab() {
  const context = useContext(TabularTabContext);
  if (!context) {
    throw new Error('useTabularTab must be used within a TabularTabProvider');
  }
  return context;
}

export default function Tabular() {
  const [projectsList, setProjectsList] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);
  const { tabValue } = useTabularTab();

  const getProjects = () => {
    gettabularProjects()
      .then((res) => {
        if (res.status === 200) {
          setProjectsList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChildClick = (childStateValue) => {
    setShowDialogBox(childStateValue);
    getProjects();
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <div style={{ width: "-webkit-fill-available", padding: "24px" }}>
        <TabPanel value={tabValue} index={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
                ML(Tabular) Projects
              </h1>
              <p style={{ margin: "8px 0 0 0", color: "#666" }}>
                Manage your tabular machine learning projects and experiments
              </p>
            </div>
            <div>
              <Button
                onClick={() => setShowDialogBox(true)}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                  "&:active": {
                    transform: "translateY(0) scale(0.98)",
                    transition: "all 0.1s ease",
                  },
                }}
              >
                <ControlPoint sx={{ marginRight: "8px", fontSize: "20px" }} />
                <span>New Project</span>
              </Button>
              {ShowDialogBox ? (
                <CreateProject
                  onChildClick={handleChildClick}
                  CreateExperiment={CreateExperiment}
                  CreateNewProject={CreateNewProject}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          {projectsList.length > 0 && (
            <ListWithSidebarFull items={projectsList} />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <div style={{ padding: "24px", textAlign: "center" }}>
            <h2>Data Connectors</h2>
            <p>Connect to various data sources for your tabular ML projects</p>
            {/* Data connectors content will be implemented here */}
          </div>
        </TabPanel>
      </div>
    </StyledEngineProvider>
  );
}
