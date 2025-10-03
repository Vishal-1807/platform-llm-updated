import {
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PageHeader from "../../common/PageHeader/PageHeader";
import LLMPrepare from "./Prepare/LLMPrepare";
import LLMTrain from "./Train/LLMTrain";
import Deploy from "./Deploy/Deploy";
// const Reports = lazy(() => import("./Reports/Reports"));
// const Prepare = lazy(() => import("./Prepare/Prepare"));
// const Deploy = lazy(() => import("./Deploy/Deploy"));
// const Train = lazy(() => import("./Train/Train"));
import {
  GetListExperiments,
  getLLMProjectDetails,
} from "../../../services/Portals/LLMPortals";
import { Taskype } from "./TaskType/TaskType";
import LLMReports from "./Reports/LLMReports";

export default function LLMExperiment() {
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [experimentInformation, setExperimentInformation] = useState({});
  const [selectedTab, setSelectedTab] = useState("prepare");
  const [nextPagePath, setNextPagePath] = useState("");
  const [enableNext, setEnableNext] = useState(false);
  const statusRanks = {
    CREATED: 1,
    PREPROCESSING: 2,
    PREPARED: 3,
    TRAINING: 4,
    TRAINED: 5,
    DEPLOYED: 6,
  };
  const tabs = ["prepare", "train", "deploy", "reports"];

  const changeTab = (tabName)=>{
    if(!isTabDisabled(tabName)){
      if(tabName == "prepare"){
        if(experimentInformation?.train_config?.type)
          navigate("/llm/" + projectId + "/Experiment/" + experimentId +"/"+experimentInformation?.train_config?.type+"/prepare/preview");
        else{
          navigate("/llm/" + projectId + "/Experiment/" + experimentId + "/type");
        }
      } else if (tabName == "train") {
        if (
          experimentInformation.status == "TRAINED" ||
          experimentInformation.status == "DEPLOYED"
        )
          navigate(
            "/llm/" +
              projectId +
              "/Experiment/" +
              experimentId +
              "/" +
              experimentInformation?.train_config?.type +
              "/train/status"
          );
        else
          navigate(
            "/llm/" +
              projectId +
              "/Experiment/" +
              experimentId +
              "/" +
              experimentInformation?.train_config?.type +
              "/train"
          );
      } else if (tabName == "deploy") {
        navigate(
          "/llm/" +
            projectId +
            "/Experiment/" +
            experimentId +
            "/" +
            experimentInformation?.train_config?.type +
            "/deploy"
        );
      } else if (tabName == "reports") {
        navigate(
          "/llm/" +
            projectId +
            "/Experiment/" +
            experimentId +
            "/" +
            experimentInformation?.train_config?.type +
            "/reports"
        );
      }
    }
  };

  const isTabDisabled = (tabName) => {
    if (tabName == "prepare") {
      return false;
    } else if (tabName == "train") {
      if (statusRanks[experimentInformation.status] >= statusRanks["PREPARED"])
        return false;
    } else if (tabName == "deploy" || tabName == "reports") {
      if (statusRanks[experimentInformation.status] >= statusRanks["TRAINED"])
        return false;
    }
    return true;
  };

  const setupPageHeader = () => {
    if (location.pathname.includes("/prepare")) {
      setSelectedTab("prepare");
      setNextPagePath(
        "/llm/" +
          projectId +
          "/Experiment/" +
          experimentId +
          "/" +
          experimentInformation.train_config?.type +
          "/train"
      );
      if (
        experimentInformation.status == "TRAINED" ||
        experimentInformation.status == "DEPLOYED"
      ) {
        setNextPagePath(
          "/llm/" +
            projectId +
            "/Experiment/" +
            experimentId +
            "/" +
            experimentInformation?.train_config?.type +
            "/train/status"
        );
        setEnableNext(true);
      } else {
        setEnableNext(false);
      }
    } else if (location.pathname.includes("/train")) {
      setSelectedTab("train");
      setNextPagePath(
        "/llm/" +
          projectId +
          "/Experiment/" +
          experimentId +
          "/" +
          experimentInformation.train_config?.type +
          "/deploy"
      );
      if (location.pathname.endsWith("/status")) {
        setEnableNext(true);
      } else {
        setEnableNext(false);
      }
    } else if (location.pathname.includes("/deploy")) {
      setSelectedTab("deploy");
      setNextPagePath(
        "/llm/" +
          projectId +
          "/Experiment/" +
          experimentId +
          "/" +
          experimentInformation.train_config?.type +
          "/reports"
      );
      setEnableNext(true);
    } else if (location.pathname.includes("/reports")) {
      setSelectedTab("reports");
      setNextPagePath("/llm/" + projectId);
      setEnableNext(true);
    }
  };

  useEffect(() => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          if (
            location.pathname.endsWith(experimentId) ||
            location.pathname.endsWith(experimentId + "/")
          ) {
            if (
              res.data[0].status == "TRAINING" ||
              res.data[0].status == "TRAINED"
            ) {
              navigate(
                "/llm/" +
                  projectId +
                  "/Experiment/" +
                  experimentId +
                  `/${res.data[0]?.train_config?.type}/train/status`,
                { replace: true }
              );
            } else if (res.data[0].status == "PREPROCESSED") {
              if(res.data[0]?.train_config?.data_uri){
                navigate(
                  "/llm/" +
                    projectId +
                    "/Experiment/" +
                    experimentId +
                    `/${res.data[0]?.train_config?.type}/train`,
                  { replace: true }
                );
              } else{
                navigate(
                  "/llm/" +
                    projectId +
                    "/Experiment/" +
                    experimentId +
                    `/${res.data[0]?.train_config?.type}/prepare/preview`,
                  { replace: true }
                );
              }
             
                
            }
            else if (res.data[0].status == "PREPARED") {
              if(res.data[0]?.train_config?.data_uri){
                navigate(
                  "/llm/" +
                    projectId +
                    "/Experiment/" +
                    experimentId +
                    `/${res.data[0]?.train_config?.type}/train/status`,
                  { replace: true }
                );
              } else{
                navigate(
                  "/llm/" +
                    projectId +
                    "/Experiment/" +
                    experimentId +
                    `/${res.data[0]?.train_config?.type}/prepare/preview`,
                  { replace: true }
                );
              }
            }
            else if (res.data[0]?.train_config?.type) {
              navigate(
                "/llm/" +
                  projectId +
                  "/Experiment/" +
                  experimentId +
                  `/${res.data[0]?.train_config?.type}/prepare`,
                { replace: true }
              );
            } else {
              navigate(
                "/llm/" + projectId + "/Experiment/" + experimentId + "/type",
                { replace: true }
              );
            }

            // if (res.data[0].status == "CREATED") {
            //   navigate('/llm/'+projectId+'/Experiment/'+experimentId+'/prepare',{replace:true})
            // }
            // if(res.data[0].status == "PREPARED" || res.data[0].status == "TRAINED" || res.data[0].status == "DEPLOYED"){
            //   navigate('/llm/'+projectId+'/Experiment/'+experimentId+'/prepare/preview',{replace:true})
            // }
          }
          setExperimentInformation(res.data[0]);
          setupPageHeader();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId, location]);

  const fetchProjectName = () => {
    getLLMProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          setProjectName(res.data.proj_name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProjectName();
  }, [projectId]);
  return (
    <>
      {!location.pathname.endsWith("/type") && (
        <PageHeader
          title={projectName}
          subTitle={experimentInformation.exp_name}
          tabs={tabs}
          selectedTab={selectedTab}
          hideNextButton={false}
          nextPagePath={nextPagePath}
          enableNext={enableNext}
          isTabDisabled={isTabDisabled}
          onTabClick={changeTab}
        />
      )}

      <div
        style={{
          width: "-webkit-fill-available",
          padding: location.pathname.endsWith("/type")
            ? "none"
            : "5px 16px 16px 16px",
        }}
      >
        <Suspense fallback={<div>Loading</div>}>
          <Routes>
            <Route path=":taskType/prepare/*" element={<LLMPrepare />} />
            <Route path=":taskType/train/*" element={<LLMTrain />} />
            <Route path=":taskType/reports/*" element={<LLMReports />} />
            <Route
              path="type"
              element={
                <Taskype
                  title={projectName}
                  subTitle={experimentInformation.exp_name}
                />
              }
            />
            <Route path=":taskType/deploy/*" element={<Deploy />} />

            {/* <Route path="/*" element={<Prepare/>}/>  */}
            {/* <Route path="prepare/*" element={<Prepare />} />
    {!location.pathname.endsWith("/type") && (
      <PageHeader 
        title={projectName} 
        subTitle={experimentInformation.exp_name} 
        tabs={tabs}
        labels={{
          "train": experimentInformation?.train_config?.type == "sft" ? "Fine-tune" : "Train"
        }}
        selectedTab={selectedTab} 
        hideNextButton={false}
        nextPagePath={nextPagePath} 
        enableNext={enableNext} 
        isTabDisabled={isTabDisabled} 
        onTabClick={changeTab}
      />
    ) }
      
      <div style={{width:"-webkit-fill-available", padding: location.pathname.endsWith("/type") ? "none" : "5px 16px 16px 16px"}}>
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
        <Route path=":taskType/prepare/*" element={<LLMPrepare />} />
        <Route path=":taskType/train/*" element={<LLMTrain />} />
        <Route path=":taskType/reports/*" element={<LLMReports />} />
        <Route path="type" element={<Taskype  title={projectName} 
          subTitle={experimentInformation.exp_name} />} />
        
          {/* <Route path="/*" element={<Prepare/>}/>  */}
          {/* <Route path="prepare/*" element={<Prepare />} />
          <Route path="reports" element={<Reports />} />
          <Route path="train/*" element={<Train />} />
           */}
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
