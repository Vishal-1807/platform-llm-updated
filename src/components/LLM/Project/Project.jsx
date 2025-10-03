import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  GetListExperiments,
  getLLMProjectDetails,
  CreateExperiment,
} from "../../../services/Portals/LLMPortals";
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
  const [showCreateDialogBox, setCreateShowDialogBox] = useState(false);
  const [experimentsColumnDef, setExperimentsColumnDef] = useState([]);
  const formatDate = (timeStamp) =>
    new Date(timeStamp || null).toISOString().split("T")[0] +
    " " +
    new Date(timeStamp || null).toLocaleTimeString();
  const getProjectData = () => {
    getLLMProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          let temp = res.data;
          GetListExperiments(projectId, "")
            .then((res2) => {
              if (res2.status === 200) {
                temp["experiments"] = res2.data;
                // console.log(temp);
                setProjectData(temp);
                if (temp["experiments"].length > 0) {
                  let colDefs = [];
                  const keys = Object.keys(temp["experiments"][0]);

                  keys.forEach((key) => {
                    if (key == "train_config") {
                      // do nothing
                    } else {
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
                    }
                  });
                  colDefs.push({
                    field: "train_config",
                    headerName: "Type",
                    sortable: false,
                    flex: 1,
                    valueFormatter: (params) =>
                      params?.value?.type == "pretrain"
                        ? "Pretrain"
                        : params?.value?.type == "sft"
                        ? "Finetune"
                        : "",
                  });
                  //  console.log(colDefs);
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

  useEffect(() => {
    getProjectData();
  }, []);

  const onCreateSuccess = (childStateValue) => {
    setCreateShowDialogBox(childStateValue);
    getProjectData();
  };

  const GotoExperiments = (e, id) => {
    console.log(e.row.status);
    if (e.row.status === "FAILED") {
      return;
    } else {
      navigate("Experiment/" + e.row.exp_id);
    }
  };
  return (
    <StyledEngineProvider injectFirst>
      {showCreateDialogBox ? (
        <CreateExp
          onChildClick={onCreateSuccess}
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
        onClickAdd={() => setCreateShowDialogBox(true)}
        onClickRow={(e, id) => GotoExperiments(e, id)}
      />
    </StyledEngineProvider>
  );
}
