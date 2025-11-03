// React component that uses useParams to get projectID
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CreateExperiment,
  GetListExperiments,
  getTabularProjectDetails,
} from "../../../services/Portals/MLopsPortals";
import Box from "@mui/material/Box";
import { StyledEngineProvider, Button } from "@mui/material";
import styles from "./Project.module.css";
import DocumentIcon from "../../../assets/icons/document.svg?react";
import TimeCircleIcon from "../../../assets/icons/timecircle.svg?react";
import CreateExp from "../../common/CreateExp/CreateExp";
import BackIcon from "../../../assets/icons/back.svg?react";
import PlusCircleIcon from "../../../assets/icons/pluscircle.svg?react";
import ListExperiments from "../../common/ListExperiments/ListExperiments";
export default function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({ experiments: [] });
  const [experimentsColumnDef, setExperimentsColumnDef] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);
  const formatDate = (timeStamp)=> (new Date(timeStamp || null).toISOString().split('T')[0]) +" "+ (new Date(timeStamp || null).toLocaleTimeString())
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
                      valueFormatter: (key) =="ts" ? (params) =>formatDate(params.value) : (params) => params.value
                    })
                  }
                  );
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
  
  useEffect(() => {
    getProjectData();
  }, [projectId]);
  return (
    <StyledEngineProvider injectFirst>
      {ShowDialogBox ? (
        <CreateExp
            onChildClick={handleChildClick}
            projectId={projectId}
            CreateExperiment={CreateExperiment}
            />
      ) : (
        ""
      )}
      <ListExperiments
        experiments={projectData.experiments}
        experimentsColumnDef={experimentsColumnDef}
        projectData={projectData}
        onClickAdd={() => setShowDialogBox(true)}
        onClickRow={(e, id) => navigate("Experiment/" + e.row.exp_id)}
        />
    </StyledEngineProvider>
  );
}
