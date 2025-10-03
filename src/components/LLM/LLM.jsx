import { ControlPoint } from "@mui/icons-material";
import { Button, StyledEngineProvider } from "@mui/material";
import { useEffect, useState, createContext, useContext } from "react";
import {
  CreateExperiment,
  CreateNewLLMProject,
  getLLMProjectsList,
} from "../../services/Portals/LLMPortals";
import CreateProject from "../common/CreateProject/CreateProject";
import ListWithSidebarFull from "../common/ListProjects/ListWithSidebarFull";
import TabPanel from "../Elements/TabPanel";
import { ModelCatalouge } from "./Project/ModelCatalouge/ModelCatalouge";
import PlayGroundTab from "./Project/PlayGround/PlayGroundTab";

// Create context for LLM tab state
export const LLMTabContext = createContext();

// Provider component
export function LLMTabProvider({ children }) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <LLMTabContext.Provider value={{ tabValue, setTabValue }}>
      {children}
    </LLMTabContext.Provider>
  );
}

// Hook to use the context
export function useLLMTab() {
  const context = useContext(LLMTabContext);
  if (!context) {
    throw new Error('useLLMTab must be used within a LLMTabProvider');
  }
  return context;
}
export default function LLM() {
  const [projectsList, setProjectsList] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);
  const { tabValue } = useLLMTab();
  const getProjects = () => {
    getLLMProjectsList()
      .then((res) => {
        if (res.status === 200) {
          const filteredProjects = res.data.filter(
            (project) => project.proj_type === "llm"
          );
          setProjectsList(filteredProjects);
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
            }}
          >
            <div className="page-title"></div>
            <div className="page-action">
              <Button
  onClick={() => setShowDialogBox(true)}
  sx={{
    borderRadius: '20px',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '16px',
    padding: '12px 24px',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(30,144,255,0.15) 50%, rgba(255,165,0,0.20) 100%)',
    color: '#1E90FF',
    boxShadow: '0 8px 32px rgba(30,144,255,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(30,144,255,0.1)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.4)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      transition: 'left 0.6s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '1px',
      borderRadius: '19px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(30,144,255,0.05) 100%)',
      zIndex: -1,
    },
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(30,144,255,0.20) 0%, rgba(255,165,0,0.25) 50%, rgba(255,255,255,0.15) 100%)',
      color: '#1E90FF',
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 12px 40px rgba(30,144,255,0.4), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(30,144,255,0.2)',
      border: '1px solid rgba(255,255,255,0.6)',
      '&::before': {
        left: '100%',
      },
    },
    '&:active': {
      transform: 'translateY(0) scale(0.98)',
      transition: 'all 0.1s ease',
    },
  }}
>
  <ControlPoint sx={{ marginRight: '8px', fontSize: '20px' }} />
  <span>New Project</span>
</Button>
              {ShowDialogBox ? (
                <CreateProject
                  onChildClick={handleChildClick}
                  CreateExperiment={CreateExperiment}
                  CreateNewProject={CreateNewLLMProject}
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
          {/* <PlayGround /> */}
          <PlayGroundTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ModelCatalouge />
        </TabPanel>
      </div>
    </StyledEngineProvider>
  );
}
