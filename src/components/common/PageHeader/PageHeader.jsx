import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/styled-engine";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BackIcon from "../../../assets/icons/back.svg?react";
import NextIcon from "../../../assets/icons/next.svg?react";
import styles from "./PageHeader.module.css";
import "../../../styles/liquidGlass.css";

export default function PageHeader({
  title,
  subTitle,
  tabs,
  labels = {},
  selectedTab,
  isTabDisabled,
  onTabClick,
  hideNextButton = false,
  nextPagePath,
  enableNext}) {
  // const experimentId = useParams().experimentId;
  // const projectId = useParams().projectId;
  const navigate = useNavigate();


  




  return (
    <StyledEngineProvider injectFirst>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 32px",
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          borderBottom: "none",
          position: "relative",
          minHeight: "100px"
        }}
      >
        <div
          style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center" }}
          className={`${styles["modern-page-title"]} liquid-glass-card-neutral`}
        >
          <div style={{margin:"auto 0px", cursor:"pointer", padding: "8px", borderRadius: "12px"}} >
            <BackIcon onClick={() => navigate(-1)} style={{color: "#5420E8"}}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft:"16px" }}>
            <span style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#6E6E88",
              fontFamily: "Plus Jakarta Sans"
            }}>
              {title}
            </span>
            <span style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1F1F29",
              fontFamily: "Plus Jakarta Sans",
              marginTop: "2px"
            }}>
              {subTitle}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flex: 2,
            gap: "12px"
          }}
        >
          <div className={styles["modern-tab-container"]}>
            {tabs.map((tab, index) => (
                <div
                  key={tab}
                  className={`${styles["modern-tab"]} ${selectedTab === tab ? styles["modern-tab-selected"] : ""} ${isTabDisabled(tab) ? styles["modern-tab-disabled"] : ""} liquid-glass-list-item-premium`}
                  onClick={() => !isTabDisabled(tab) && onTabClick(tab)}
                >
                  <div className={styles["modern-tab-number"]}>{index+1}</div>
                  <span className={styles["modern-tab-label"]}>{labels[tab] || tab}</span>
                  {selectedTab === tab && <div className={styles["modern-tab-indicator"]}></div>}
                </div>
              ))
            }
            
            {/* <div className={(selectedTab == "train" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("train") ? styles["disabled"] : "")} onClick={() => onTabClick("train")} style={{borderRight: "0px"}}>
              <div className={styles["tab-number-ctn"]}>2</div>&nbsp;<span>Train</span>
            </div>
            <div className={(selectedTab == "deploy" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("deploy") ? styles["disabled"] : "")} onClick={() => onTabClick("deploy")} style={{borderRight: "0px"}}>
              <div className={styles["tab-number-ctn"]}>3</div>&nbsp;<span>Deploy</span>
            </div>
            <div
              className={(selectedTab == "reports" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("reports") ? styles["disabled"] : "")} onClick={() => onTabClick("reports")}
              style={{
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            >
              <div className={styles["tab-number-ctn"]}>4</div>&nbsp;<span>Report</span>
            </div> */}
          </div>
        </div>
        <div className={styles["modern-page-action"]} style={{ flex: 1 }}>
          {(hideNextButton) ? null : (
            <button
            className={`liquid-glass-btn ${!enableNext ? styles["modern-btn-disabled"] : ""}`}
            disabled={!enableNext}
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "16px",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: "600",
              padding: "12px 24px",
              borderRadius: "16px",
              border: "none",
              cursor: enableNext ? "pointer" : "not-allowed",
              opacity: enableNext ? 1 : 0.5
            }}
            onClick={() => enableNext && navigate(nextPagePath)}
          >
            Next
            <NextIcon style={{width: "16px", height: "16px"}} />
          </button>
          )}
        </div>
      </Box>
    </StyledEngineProvider>
  );
}
