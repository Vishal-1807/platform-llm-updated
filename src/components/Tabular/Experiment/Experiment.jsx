import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PageHeader from "../../common/PageHeader/PageHeader";
const Reports = lazy(() => import("./Reports/Reports"));
const Prepare = lazy(() => import("./Prepare/Prepare"));
const Deploy = lazy(() => import("./Deploy/Deploy"));
const Train = lazy(() => import("./Train/Train"));
import { GetListExperiments, getTabularProjectDetails } from "../../../services/Portals/MLopsPortals";
export default function Experiment() {
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [experimentInformation, setExperimentInformation] = useState({});
  const [selectedTab, setSelectedTab] = useState("prepare");
  const [nextPagePath, setNextPagePath] = useState("");
  const [enableNext, setEnableNext] = useState(false);
  const statusRanks = {"CREATED":1, "PREPROCESSING":2,"PREPARED":3,"TRAINING":4, "TRAINED":5, "DEPLOYED":6};
  const tabs = ["prepare", "train", "deploy", "reports"];
  const changeTab = (tabName)=>{
    if(!isTabDisabled(tabName)){
      if(tabName == "prepare"){
        if(experimentInformation.status == "CREATED")
          navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/prepare");
        else
          navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/prepare/preview");
      }else if(tabName == "train"){
          if(experimentInformation.status == "TRAINED" || experimentInformation.status == "DEPLOYED")
            navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/train/" + experimentInformation.train_config.model.type + "/result");
          else
            navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/train");
      }else if(tabName == "deploy"){
          navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/deploy");
      }else if(tabName == "reports"){
          navigate("/tabular/" + projectId + "/Experiment/" + experimentId + "/reports");
      }
    }
  }



  const isTabDisabled = (tabName)=>{
    if(tabName == "prepare"){
        return false;
    }else if(tabName == "train"){
      if (statusRanks[experimentInformation.status] >= statusRanks["PREPARED"])
        return false;
    }else if(tabName == "deploy" || tabName == "reports"){
      if (statusRanks[experimentInformation.status] >= statusRanks["TRAINED"])
        return false;
    }
    return true;
  }

  const setupPageHeader = () => {
    if (location.pathname.includes("prepare")) {
      setSelectedTab("prepare");
      setNextPagePath(
        "/tabular/" + projectId + "/Experiment/" + experimentId + "/train"
      );
      if (location.pathname.endsWith("prepare/preview")) {
        if (experimentInformation.status == "TRAINED" || experimentInformation.status == "DEPLOYED") {
          setNextPagePath(
            "/tabular/" + projectId + "/Experiment/" + experimentId + "/train/" + experimentInformation.train_config.model.type + "/result"
          );
        }
        setEnableNext(true);
      } else {
        setEnableNext(false);
      }
    } else if (location.pathname.includes("train")) {
      setSelectedTab("train");
      setNextPagePath(
        "/tabular/" + projectId + "/Experiment/" + experimentId + "/deploy"
      );
      if (location.pathname.endsWith("/result")) {
        setEnableNext(true);
      } else {
        setEnableNext(false);
      }
    } else if (location.pathname.includes("deploy")) {
      setSelectedTab("deploy");
      setNextPagePath(
        "/tabular/" + projectId + "/Experiment/" + experimentId + "/reports"
      );
      setEnableNext(true);
    } else if (location.pathname.includes("reports")) {
      setSelectedTab("reports");
      setNextPagePath("/tabular/" + projectId);
      setEnableNext(true);
    }
  }

  useEffect(() => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          if(location.pathname.endsWith(experimentId) || location.pathname.endsWith(experimentId+"/")){
            if (res.data[0].status == "CREATED") {
              navigate('/tabular/'+projectId+'/Experiment/'+experimentId+'/prepare',{replace:true})
            }
            if(res.data[0].status == "PREPARED" || res.data[0].status == "TRAINED" || res.data[0].status == "DEPLOYED"){
              navigate('/tabular/'+projectId+'/Experiment/'+experimentId+'/prepare/preview',{replace:true})
            }
          }
          setExperimentInformation(res.data[0]);
          setupPageHeader();
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, [experimentId,location]);

  const fetchProjectName = () => {
    getTabularProjectDetails(projectId)
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
      <PageHeader 
        title={projectName} 
        subTitle={experimentInformation.name} 
        tabs={tabs}
        selectedTab={selectedTab} 
        nextPagePath={nextPagePath} 
        enableNext={enableNext} 
        isTabDisabled={isTabDisabled} 
        onTabClick={changeTab}
      />
      <div style={{width:"-webkit-fill-available","padding":"5px 16px 16px 16px"}}>
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          {/* <Route path="/*" element={<Prepare/>}/>  */}
          <Route path="prepare/*" element={<Prepare />} />
          <Route path="reports" element={<Reports />} />
          <Route path="train/*" element={<Train />} />
          <Route path="deploy/*" element={<Deploy />} />
        </Routes>
      </Suspense>
      </div>
    </>
  );
}
