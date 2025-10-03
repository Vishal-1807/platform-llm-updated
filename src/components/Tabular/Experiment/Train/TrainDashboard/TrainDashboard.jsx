import { useState, useEffect } from "react";
import { ApiUrl } from "../../../../../services/Api";
import styles from "./TrainDashboard.module.css";
import { FeatureImportance2, ConfusionMatrix2 } from "../../Reports/CommonReport";
import { LinearProgress } from "@mui/material";
export const TrainDashboard = ({ experimentId, experimentStatus, message}) =>{
    
    const [ dashboardUrl, setDashboardUrl] = useState("");
    const [ iframeKey, setIframeKey] = useState(0);
    useEffect(() => {
        console.log(experimentId);
        if(experimentId){
            const url = `${ApiUrl}/cibi/grafana/d/a91763bb-d009-4be3-b378-2187a01e08bd/model-metrics-optuna?orgId=1&var-experiment=${experimentId}&theme=light&kiosk&width=450&refresh=2s`;
            setDashboardUrl(url);
        }
    }, [experimentId]);

    useEffect(() => {
            setIframeKey(iframeKey+1);
    },[experimentStatus,message]);
    return (
        <div className={styles["dashborad-ctn"]}  style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", width:"-webkit-fill-available"}}>
            <div className={styles["chart-ctn"]}>
                <div className={styles["label"]}>Optuna Params</div>
                <div style={{width:"-webkit-fill-available",height:"315px"}} key = {iframeKey}>
                    {(dashboardUrl !== "") ? (
                        <iframe
                        src = {dashboardUrl}
                        key = {iframeKey}
                        height="100%"
                        allowFullScreen
                        style={{ border: "none", padding: "16px 24px", width:"calc(100% - 48px)", height:"-webkit-fill-available", "body":{background:"#fff"}}}
                        >
                    </iframe>
                    ): null}
                    
                </div>
            </div>
            {(experimentStatus === "TRAINED" || experimentStatus === "DEPLOYED" ) ? (
                <div style={{width:"-webkit-fill-available", display:"flex"}}>
                <div className={styles["feat-imp-ctn"]} style={{ flex:"30%", height:"517px"}}>
                    <div className={styles["feat-imp-header"]}>
                        <b>Feature Importance</b>
                    </div>
                    <div className={styles["p-f-ctn"]} style={{padding:"0px 22px 20px 22px"}}>
                        <FeatureImportance2 experimentId={experimentId}/>
                    </div>
                </div>
                <div style={{height:"517px", flex:"70%"}} className={styles["cfn-ctn"]}>
                    <div className={styles["cfn-header"]}><b>Confusion Matrix</b></div>
                    <div style={{height:"-webkit-fill-available", padding:"0px 22px 20px 22px"}}>
                        <ConfusionMatrix2 experimentId={experimentId}/>
                    </div>
                    
                </div>
            </div>
            ) : (
                <div style={{width:"-webkit-fill-available", minHeight: "40vh", display:"flex",flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
                    <div>{message}</div>
                    <LinearProgress sx={{
                        '& .MuiLinearProgress-root':{
                            background: "#D3D3EA"
                        },
                        '& .MuiLinearProgress-bar':{
                            backgroundImage: "linear-gradient(80deg, #5B32D0 0%, #E04EF8 96.35%)"
                        },
                        width: "440px",
                        height: "4px"

                    }}/>
                </div>
            )}
        </div>
    )
}
export default TrainDashboard;
