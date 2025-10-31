import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CreateExperiment,
  GetListExperiments,
  getTabularProjectDetails,
} from "../../../services/Portals/MLopsPortals";
import { StyledEngineProvider, Button } from "@mui/material";
import CreateExp from "../../common/CreateExp/CreateExp";
import ListExperiments from "../../common/ListExperiments/ListExperiments";
import { ControlPoint, ArrowBack } from "@mui/icons-material";

export default function TabularProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({ experiments: [] });
  const [experimentsColumnDef, setExperimentsColumnDef] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);

  const formatDate = (timeStamp) =>
    new Date(timeStamp || null).toISOString().split("T")[0] +
    " " +
    new Date(timeStamp || null).toLocaleTimeString();

  const getProjectData = () => {
    getTabularProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          let temp = res.data;
          GetListExperiments(projectId, "")
            .then((res2) => {
              if (res2.status === 200) {
                temp["experiments"] = res2.data;
                console.log(temp);
                setProjectData(temp);
                if (temp["experiments"].length > 0) {
                  let colDefs = [];
                  const keys = Object.keys(temp["experiments"][0]);
                  keys.forEach((key) => {
                    colDefs.push({
                      field: key,
                      headerName: key.split("_").join(" "),
                      sortable: false,
                      flex: 1,
                      valueFormatter:
                        key == "ts"
                          ? (params) => formatDate(params.value)
                          : (params) => params.value,
                    });
                  });
                  console.log(colDefs);
                  setExperimentsColumnDef(colDefs);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChildClick = (childStateValue) => {
    setShowDialogBox(childStateValue);
    getProjectData();
  };

  const handleBackClick = () => {
    navigate("/tabular");
  };

  useEffect(() => {
    getProjectData();
  }, [projectId]);

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
                {projectData.proj_name || "Loading..."}
              </h1>
              <p style={{ margin: "8px 0 0 0", color: "#666" }}>
                {projectData.description || "Tabular ML Project"}
              </p>
            </div>
          </div>
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
            <ControlPoint sx={{ fontSize: "20px" }} />
            <span>New Experiment</span>
          </Button>
        </div>

        {/* Create Experiment Dialog */}
        {ShowDialogBox ? (
          <CreateExp
            onChildClick={handleChildClick}
            projectId={projectId}
            CreateExperiment={CreateExperiment}
          />
        ) : (
          ""
        )}

        {/* Experiments List */}
        <ListExperiments
          experiments={projectData.experiments}
          experimentsColumnDef={experimentsColumnDef}
          projectData={projectData}
          onClickAdd={() => setShowDialogBox(true)}
          onClickRow={(e, id) => navigate(`Experiment/${e.row.exp_id}`)}
        />
      </div>
    </StyledEngineProvider>
  );
}
